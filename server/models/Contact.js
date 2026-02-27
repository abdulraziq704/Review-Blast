const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    status: { // pending, sent, delivered, read, failed
        type: String,
        default: 'pending',
    },
    lastMessageSid: {
        type: String,
        unique: true,
        sparse: true, // Only if present
    },
    lastSentAt: {
        type: Date,
    }
}, {
    timestamps: true,
});

// Compound index to prevent duplicates for same user
contactSchema.index({ user: 1, phone: 1 }, { unique: true });

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
