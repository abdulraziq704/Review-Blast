const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    googleId: { type: String },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    businessName: {
        type: String,
    },
    reviewLink: { // The Google Review Link
        type: String,
        default: '',
    },
    whatsappNumber: { // The sender number (Simulated for now via Env/Twilio)
        type: String,
    },
    plan: {
        type: String,
        enum: ['startup', 'growth', 'business'],
        default: 'startup',
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly',
    },
    contactLimit: {
        type: Number,
        default: 300,
    },
    currency: {
        type: String,
        enum: ['PKR', 'USD'],
        default: 'PKR',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'done'],
        default: 'pending',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
    const crypto = require('crypto');
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire (10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};



userSchema.pre('save', async function (next) {
    if (!this.password || !this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
