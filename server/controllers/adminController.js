const User = require('../models/User');
const { PLANS } = require('../config/constants');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const User = require('../models/User');
        const Contact = require('../models/Contact');

        const users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean();

        // Get contact counts for each user (only count non-pending status)
        const usersWithUsage = await Promise.all(users.map(async (u) => {
            const contactCount = await Contact.countDocuments({ user: u._id, status: { $ne: 'pending' } });
            return { ...u, contactCount };
        }));

        res.json(usersWithUsage);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user by admin (verify payment, change plan, billing cycle)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserByAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            const { paymentStatus, plan, billingCycle } = req.body;

            if (paymentStatus) user.paymentStatus = paymentStatus;
            if (billingCycle) user.billingCycle = billingCycle;

            if (plan) {
                const planKey = plan.toUpperCase();
                if (PLANS[planKey]) {
                    user.plan = PLANS[planKey].name;
                    user.contactLimit = PLANS[planKey].contactLimit;
                }
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                plan: updatedUser.plan,
                billingCycle: updatedUser.billingCycle,
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

module.exports = {
    getAllUsers,
    updateUserByAdmin
};
