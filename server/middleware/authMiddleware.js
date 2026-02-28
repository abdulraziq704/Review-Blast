const jwt = require('jsonwebtoken');
const User = require('../models/User');

// const protect = async (req, res, next) => {
//     let token = req.cookies.token;

//     if (token) {
//         try {
//             // Verify token
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             console.log('Protect Middleware - Token verified for user:', decoded.id);

//             // Get user from the token
//             req.user = await User.findById(decoded.id).select('-password');
//             if (!req.user) {
//                 console.log('Protect Middleware - User not found in DB');
//             }

//             next();
//         } catch (error) {
//             console.error('Protect Middleware - JWT Error:', error.message);
//             res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     } else {
//         console.log('Protect Middleware - No token found in cookies');
//         console.log('Available Request Cookies:', req.cookies);
//         res.status(401).json({ message: 'Not authorized, no token' });
//     }
// };


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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        return next();
    } catch (error) {
        console.error('Auth Error:', error.message);
        return res.status(401).json({ message: 'Not authorized, token failed' });
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

