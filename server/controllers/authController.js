const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const { PLANS } = require('../config/constants');
const sendEmail = require('../utils/sendEmail');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, businessName, whatsappNumber, plan } = req.body;

        if (!name || !email || !password || !businessName) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email: email.toLowerCase() });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Determine contact limit based on plan
        const selectedPlan = plan ? plan.toLowerCase() : 'startup';
        const planInfo = PLANS[selectedPlan.toUpperCase()] || PLANS.STARTUP;

        // Hash password handled in Model pre-save
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            businessName,
            whatsappNumber,
            plan: planInfo.name,
            contactLimit: planInfo.contactLimit,
            billingCycle: req.body.billingCycle || 'monthly',
            paymentStatus: 'pending' // Always pending on registration
        });

        if (user) {
            const token = generateToken(user.id);
            res.cookie('token', token, {
                httpOnly: true,
                secure: true, // Required for sameSite: 'none' and Railway
                sameSite: 'none', // Required for cross-site (Railway -> Vercel)
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                businessName: user.businessName,
                plan: user.plan,
                contactLimit: user.contactLimit,
                paymentStatus: user.paymentStatus,
                role: user.role,
                token // Added here
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server Error during registration' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check for user email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user.id);
            res.cookie('token', token, {
                httpOnly: true,
                secure: true, // Required for sameSite: 'none'
                sameSite: 'none',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                businessName: user.businessName,
                reviewLink: user.reviewLink,
                plan: user.plan,
                contactLimit: user.contactLimit,
                paymentStatus: user.paymentStatus,
                role: user.role,
                token // Added here
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error during login' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            reviewLink: user.reviewLink,
            businessName: user.businessName,
            plan: user.plan,
            contactLimit: user.contactLimit,
            paymentStatus: user.paymentStatus,
            role: user.role
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.reviewLink = req.body.reviewLink || user.reviewLink;
            // Add any other profile updates here

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                businessName: updatedUser.businessName,
                reviewLink: updatedUser.reviewLink,
                plan: updatedUser.plan,
                contactLimit: updatedUser.contactLimit,
                paymentStatus: updatedUser.paymentStatus,
                role: updatedUser.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update payment status (Manual update as requested)
// @route   PUT /api/auth/payment-status
// @access  Private (In production should be restricted)
const updatePaymentStatus = async (req, res) => {
    const { status, userId } = req.body; // userId optional, if not provided update own

    try {
        const targetId = userId || req.user._id;
        const user = await User.findById(targetId);

        if (user) {
            user.paymentStatus = status;
            await user.save();
            res.json({ message: 'Payment status updated', paymentStatus: user.paymentStatus });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out' });
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });

    if (!user) {
        return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        res.status(500).json({ message: 'Email could not be sent' });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
        plan: user.plan,
        contactLimit: user.contactLimit,
        paymentStatus: user.paymentStatus,
        role: user.role,
        token
    });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateUserProfile,
    updatePaymentStatus,
    logoutUser,
    forgotPassword,
    resetPassword,
};

