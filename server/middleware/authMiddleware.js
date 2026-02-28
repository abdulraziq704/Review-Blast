const jwt = require('jsonwebtoken');
const User = require('../models/User');



const protect = async (req, res, next) => {
    let token;

    // 1. Check cookies first (for browser sessions)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // 2. Check Authorization header (for manual API calls/mobile)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        if (!process.env.JWT_SECRET) {
            console.error('❌ AUTH ERROR: JWT_SECRET is not defined in server environment!');
            return res.status(500).json({ message: 'Server configuration error' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            console.error(`❌ AUTH ERROR: User not found in database for ID: ${decoded.id}`);
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        return next();
    } catch (error) {
        console.error('❌ AUTH ERROR:', error.message);
        return res.status(401).json({ message: `Not authorized: ${error.message}` });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };

