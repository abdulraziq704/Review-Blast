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
            const name = row.name || row.Name || row['Full Name'] || row.fullname || row.NAME;
            const phone = row.phone || row.Phone || row['Phone Number'] || row.number || row.PHONE;

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

// @desc    Send Review Requests
// @route   POST /api/contacts/send-reviews
// @access  Private
const sendReviews = async (req, res) => {
    const { contactIds, messageTemplate } = req.body; // Expect array of IDs or 'all'

    // Get User for Business Name and Link
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
        return res.status(400).json({ message: 'No contacts selected' });
    }

    // Iterate and send (Batching logic is simplified here)
    const results = [];

    // Map template slugs to actual Content SIDs
    const templateMapping = {
        'Standard': process.env.CONTENT_SID_STANDARD || process.env.CONTENT_SID || 'HX639ada6892c39d611f0977a11aca6ea7',
        'Friendly': process.env.CONTENT_SID_FRIENDLY || 'HX68682d93a0af084e541d09c4f0c35e35',
        'Incentive': process.env.CONTENT_SID_INCENTIVE || 'HX9a1e9af3050bfb57a66ec7818fed5c4c',
        'Direct': process.env.CONTENT_SID_DIRECT || 'HX67470a69bf8bc8c7e31f60fe376c8f0d'
    };

    // Inside your sendReviews controller
    for (const contact of contacts) {
        // 1. Prepare variables for your specific template:
        // {{1}} = Contact Name, {{2}} = Business Name, {{3}} = Review Link
        const templateVariables = {
            1: contact.name,
            2: user.businessName,
            3: user.reviewLink
        };

        // 2. Call the updated helper using Content SID
        // Resolve slug to actual SID or fallback
        const templateId = templateMapping[messageTemplate] || messageTemplate || templateMapping['Standard'];
        
        const response = await sendWhatsAppMessage(
            contact.phone,
            templateVariables,
            templateId
        );

        if (response.success) {
            contact.status = 'sent';
            contact.lastMessageSid = response.sid; // Store the SID for tracking
            contact.lastSentAt = Date.now();
            await contact.save();
            results.push({ phone: contact.phone, status: 'sent', sid: response.sid });
        } else {
            contact.status = 'failed';
            await contact.save();
            results.push({ phone: contact.phone, status: 'failed', error: response.error });
        }
    }

    res.json({ message: 'Batch processing complete', results });
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

