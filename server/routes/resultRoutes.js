const express = require('express');
const router = express.Router();
const { getMyResults, submitResult } = require('../controllers/resultController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/my-results')
  .get(restrictTo('student'), getMyResults);

router.route('/')
  .post(restrictTo('lecturer', 'admin'), submitResult);

module.exports = router;