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
    const { name, phone, email } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ message: 'Name and Phone are required' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (user.paymentStatus !== 'done') {
            return res.status(403).json({ message: 'Payment pending. Please complete payment to add contacts.' });
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
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Contact with this phone already exists' });
        }
        res.status(500).json({ message: error.message });
    }
};

const updateContact = async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (contact && contact.user.toString() === req.user.id) {
        contact.name = req.body.name || contact.name;
        contact.phone = req.body.phone || contact.phone;
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

            return {
                user: req.user.id,
                name: name ? name.toString().trim() : null,
                phone: phone ? phone.toString().trim().replace(/(?!^\+)\D/g, '') : null,
            };
        }).filter(c => c.name && c.phone);

        // Limit the number of contacts to be uploaded based on remaining limit
        if (contacts.length > remainingLimit) {
            contacts = contacts.slice(0, remainingLimit);
        }

        if (contacts.length === 0) {
            return res.status(400).json({ message: 'No valid contacts found or limit already reached.' });
        }

        const result = await Contact.insertMany(contacts, { ordered: false });
        res.status(201).json({
            message: `Uploaded ${result.length} contacts successfully.${result.length < parsedData.length ? ' Some contacts were skipped due to plan limits.' : ''}`,
            count: result.length
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

    let query = { user: req.user.id };
    if (Array.isArray(contactIds) && contactIds.length > 0) {
        query._id = { $in: contactIds };
    }

    const contacts = await Contact.find(query);

    if (contacts.length === 0) {
        return res.status(400).json({ message: 'No contacts selected' });
    }

    // Iterate and send (Batching logic is simplified here)
    const results = [];

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
        // Replace 'HX...' with the SID from your approved 'our_review_utility' template
        const response = await sendWhatsAppMessage(
            contact.phone,
            templateVariables,
            'HX67470a69bf8bc8c7e31f60fe376c8f0d' // From image_e4c006.png
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

module.exports = {
    getContacts,
    addContact,
    uploadContacts,
    sendReviews,
    updateContact,
    deleteContact,
    bulkDeleteContacts,
};

