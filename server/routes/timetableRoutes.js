const express = require('express');
const router = express.Router();
const { getTimetable, addSlot, updateSlot, deleteSlot } = require('../controllers/timetableController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getTimetable)
  .post(restrictTo('admin'), addSlot);

router.route('/:id')
  .patch(restrictTo('admin'), updateSlot)
  .delete(restrictTo('admin'), deleteSlot);

module.exports = router;