const express = require('express');
const router = express.Router();
const { getMyRequests, createRequest, getAllRequests, updateRequestStatus } = require('../controllers/medicalController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);

// Student routes
router.route('/my-requests')
  .get(restrictTo('student'), getMyRequests)
  .post(restrictTo('student'), createRequest);

// Admin/Lecturer routes
router.route('/all')
  .get(restrictTo('admin', 'lecturer'), getAllRequests);

router.route('/:id/status')
  .put(restrictTo('admin', 'lecturer'), updateRequestStatus);

module.exports = router;