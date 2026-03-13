const Contact = require('../models/Contact');
const { parseCSV } = require('../services/csvService');
const { sendWhatsAppMessage } = require('../services/twilioService');
const User = require('../models/User');

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = async (req, res) => {
    const contacts = await Contact.find({ user: req.user.id });
    res.json(contacts);
};

// @desc    Add a single contact
// @route   POST /api/contacts
// @access  Private
const addContact = async (req, res) => {
    let { name, phone, email } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ message: 'Name and Phone are required' });
    }

    // Clean phone number: Keep leading +, remove all other non-digits
    phone = phone.toString().trim().replace(/(?!^\+)\D/g, '');

    // Convert 00 prefix to + or ensure leading +
    if (phone.startsWith('00')) {
        phone = '+' + phone.substring(2);
    } else if (!phone.startsWith('+')) {
        phone = '+' + phone;
    }

    try {
        const user = await User.findById(req.user.id);

        if (user.paymentStatus !== 'done') {
            return res.status(403).json({ message: 'Payment pending. Please complete payment to add contacts.' });
        }

        const existingContact = await Contact.findOne({ user: req.user.id, phone });

        if (existingContact) {
            existingContact.name = name;
            existingContact.status = 'pending';
            await existingContact.save();
            return res.status(200).json(existingContact);
        }

        const contactCount = await Contact.countDocuments({ user: req.user.id });
        if (contactCount >= user.contactLimit) {
            return res.status(400).json({
                message: `Contact limit reached (${user.contactLimit}). Please upgrade your plan.`
            });
        }

        const contact = await Contact.create({
            user: req.user.id,
            name,
            phone,
            email,
        });
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateContact = async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (contact && contact.user.toString() === req.user.id) {
        contact.name = req.body.name || contact.name;
        if (req.body.phone) {
            let cleanedPhone = req.body.phone.toString().trim().replace(/(?!^\+)\D/g, '');
            if (cleanedPhone.startsWith('00')) {
                cleanedPhone = '+' + cleanedPhone.substring(2);
            } else if (!cleanedPhone.startsWith('+')) {
                cleanedPhone = '+' + cleanedPhone;
            }
            contact.phone = cleanedPhone;
        }
        const updated = await contact.save();
        res.json(updated);
    } else {
        res.status(404).json({ message: 'Not found' });
    }
};

// @desc    Upload users via CSV
// @route   POST /api/contacts/upload
// @access  Private
const uploadContacts = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded. Please select a CSV file.' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (user.paymentStatus !== 'done') {
            return res.status(403).json({ message: 'Payment pending. Please complete payment to upload contacts.' });
        }

        const parsedData = await parseCSV(req.file.buffer);

        if (!parsedData || parsedData.length === 0) {
            return res.status(400).json({ message: 'The CSV file is empty or invalid.' });
        }

        const existingCount = await Contact.countDocuments({ user: req.user.id });
        const remainingLimit = user.contactLimit - existingCount;

        if (remainingLimit <= 0) {
            return res.status(400).json({
                message: `Contact limit reached (${user.contactLimit}). Please upgrade your plan.`
            });
        }

        let contacts = parsedData.map((row) => {
            // Trim all keys to handle accidental spaces in headers
            const cleanRow = {};
            Object.keys(row).forEach(key => {
                cleanRow[key.trim()] = row[key];
            });

            // Smart Header Mapping
            const nameKeys = ['name', 'fullname', 'full name', 'customer', 'contact name', 'contact', 'user'];
            const phoneKeys = ['phone', 'phone number', 'number', 'mobile', 'whatsapp', 'wa', 'cell'];

            let name = null;
            let phone = null;

            // 1. Try to find by specific keywords
            for (const key of Object.keys(cleanRow)) {
                const lowerKey = key.toLowerCase();
                if (!name && nameKeys.includes(lowerKey)) name = cleanRow[key];
                if (!phone && phoneKeys.includes(lowerKey)) phone = cleanRow[key];
            }

            // 2. Fallback: If not found but we have at least 2 columns, assume 1st is Name, 2nd is Phone
            if ((!name || !phone) && Object.keys(cleanRow).length >= 2) {
                const values = Object.values(cleanRow);
                if (!name) name = values[0];
                if (!phone) phone = values[1];
            }

            let cleanedPhone = phone ? phone.toString().trim().replace(/(?!^\+)\D/g, '') : null;
            if (cleanedPhone) {
                if (cleanedPhone.startsWith('00')) {
                    cleanedPhone = '+' + cleanedPhone.substring(2);
                } else if (!cleanedPhone.startsWith('+')) {
                    cleanedPhone = '+' + cleanedPhone;
                }
            }

            return {
                user: req.user.id,
                name: name ? name.toString().trim() : null,
                phone: cleanedPhone,
            };
        }).filter(c => c.name && c.phone);

        // Limit the number of contacts to be uploaded based on remaining limit
        if (contacts.length > remainingLimit) {
            contacts = contacts.slice(0, remainingLimit);
        }

        if (contacts.length === 0) {
            return res.status(400).json({ message: 'No valid contacts found or limit already reached.' });
        }

        const bulkOps = contacts.map(c => ({
            updateOne: {
                filter: { user: req.user.id, phone: c.phone },
                update: { $set: { name: c.name, status: 'pending' } },
                upsert: true
            }
        }));

        const result = await Contact.bulkWrite(bulkOps);

        res.status(201).json({
            message: `Processed ${contacts.length} contacts successfully.`,
            count: result.upsertedCount + result.modifiedCount
        });
    } catch (error) {
        console.error('CSV Upload Error:', error);
        res.status(500).json({ message: 'Error processing CSV: ' + error.message });
    }
};

const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Check if the contact belongs to the logged-in user
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await contact.deleteOne();
        res.json({ message: 'Contact removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const bulkDeleteContacts = async (req, res) => {
    const { contactIds } = req.body;

    try {
        await Contact.deleteMany({
            _id: { $in: contactIds },
            user: req.user.id // Security: Ensure user only deletes their own contacts
        });

        res.status(200).json({ message: 'Contacts deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during bulk delete' });
    }
};

// @desc    Send Review Requests (Optimized for Bulk)
// @route   POST /api/contacts/send-reviews
// @access  Private
const sendReviews = async (req, res) => {
    const { contactIds, messageTemplate } = req.body;

    const user = await User.findById(req.user.id);
    if (user.paymentStatus !== 'done') {
        return res.status(403).json({ message: 'Payment pending. Please complete payment to send messages.' });
    }

    if (!user.reviewLink) {
        return res.status(400).json({ message: 'Please set your Review Link in settings first' });
    }

    let query = { user: req.user.id, status: 'pending' };
    if (Array.isArray(contactIds) && contactIds.length > 0) {
        query = { _id: { $in: contactIds }, user: req.user.id };
    }

    const contacts = await Contact.find(query);

    if (contacts.length === 0) {
        return res.status(400).json({ message: 'No pending contacts selected' });
    }

    // Immediately respond to the client so the UI doesn't hang
    res.json({ 
        message: 'Campaign processing started in the background', 
        total: contacts.length 
    });

    // Background Execution Loop
    (async () => {
        console.log(`🚀 Starting background campaign for ${user.businessName} (${contacts.length} contacts)`);
        
        const templateMapping = {
            'Standard': process.env.CONTENT_SID_STANDARD || process.env.CONTENT_SID || 'HX639ada6892c39d611f0977a11aca6ea7',
            'Friendly': process.env.CONTENT_SID_FRIENDLY || 'HX68682d93a0af084e541d09c4f0c35e35',
            'Incentive': process.env.CONTENT_SID_INCENTIVE || 'HX9a1e9af3050bfb57a66ec7818fed5c4c',
            'Direct': process.env.CONTENT_SID_DIRECT || 'HX67470a69bf8bc8c7e31f60fe376c8f0d'
        };

        const templateId = templateMapping[messageTemplate] || messageTemplate || templateMapping['Standard'];

        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            
            // Pacing: Add 1-second delay between messages (respect Twilio WhatsApp limits)
            if (i > 0) await new Promise(resolve => setTimeout(resolve, 1000));

            const templateVariables = {
                1: contact.name,
                2: user.businessName,
                3: user.reviewLink
            };

            const response = await sendWhatsAppMessage(
                contact.phone,
                templateVariables,
                templateId
            );

            if (response.success) {
                contact.status = 'sent';
                contact.lastMessageSid = response.sid;
                contact.lastSentAt = Date.now();
                await contact.save();
                console.log(`[${i+1}/${contacts.length}] ✅ Sent to ${contact.phone}`);
            } else {
                contact.status = 'failed';
                await contact.save();
                console.log(`[${i+1}/${contacts.length}] ❌ Failed for ${contact.phone}: ${response.error}`);
            }
        }
        console.log(`🏁 Campaign completed for ${user.businessName}`);
    })().catch(err => {
        console.error('🔥 Background Campaign Fatal Error:', err);
    });
};

const getContactStats = async (req, res) => {
    try {
        console.log(`📊 Fetching stats for user ID: ${req.user.id}`);
        const totalContacts = await Contact.countDocuments({ user: req.user.id });
        const pendingContacts = await Contact.countDocuments({ user: req.user.id, status: 'pending' });
        const sentHistory = await Contact.countDocuments({ 
            user: req.user.id, 
            status: { $in: ['sent', 'delivered', 'read'] } 
        });

        console.log(`✅ Stats results - Total: ${totalContacts}, Pending: ${pendingContacts}, Sent: ${sentHistory}`);

        res.json({
            totalContacts,
            pendingContacts,
            sentHistory
        });
    } catch (error) {
        console.error('❌ Error fetching stats:', error);
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

module.exports = {
    getContacts,
    addContact,
    uploadContacts,
    sendReviews,
    updateContact,
    deleteContact,
    bulkDeleteContacts,
    getContactStats,
};

