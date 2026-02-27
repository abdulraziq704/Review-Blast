const express = require('express');
const router = express.Router();
const {
    getContacts,
    addContact,
    updateContact,
    uploadContacts,
    sendReviews,
    deleteContact,
    bulkDeleteContacts,
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, getContacts)
    .post(protect, addContact);

router.post('/upload', protect, upload.single('file'), uploadContacts);
router.post('/send-reviews', protect, sendReviews);
router.put('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact); // 'auth' ensures only the owner can delete
router.post('/bulk-delete', protect, bulkDeleteContacts);

module.exports = router;
