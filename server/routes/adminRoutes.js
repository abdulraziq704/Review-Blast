const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserByAdmin } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id', protect, admin, updateUserByAdmin);

module.exports = router;
