const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    updateUserProfile,
    updatePaymentStatus,
    logoutUser,
    forgotPassword,
    resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.get('/debug', (req, res) => {
    res.json({
        cookies: req.cookies,
        headers: req.headers,
        env: process.env.NODE_ENV
    });
});
router.put('/profile', protect, updateUserProfile);
router.put('/payment-status', protect, updatePaymentStatus); // Added this line
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;