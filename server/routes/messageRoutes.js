const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const messageController = require('../controllers/messageController');

// All message routes require authentication
router.use(protect);

router.get('/unread', messageController.getUnreadCount);
router.get('/contacts', messageController.getContacts);
router.get('/conversations', messageController.getConversations);
router.get('/thread/:otherUserId', messageController.getThread);
router.post('/send', messageController.sendMessage);

module.exports = router;
