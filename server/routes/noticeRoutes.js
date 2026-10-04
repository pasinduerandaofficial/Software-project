const express = require('express');
const router = express.Router();
const { getActiveNotices, createNotice, deleteNotice, getUnreadCount, markRead } = require('../controllers/noticeController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/unread', getUnreadCount);
router.post('/mark-read', markRead);

router.route('/')
  .get(getActiveNotices)
  .post(restrictTo('admin'), createNotice);

router.route('/:id')
  .delete(restrictTo('admin'), deleteNotice);

module.exports = router;