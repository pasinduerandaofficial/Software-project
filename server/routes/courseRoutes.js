const express = require('express');
const router = express.Router();
const { getAllCourses, getMyCourses, createCourse } = require('../controllers/courseController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getAllCourses)
  .post(restrictTo('admin'), createCourse);

router.route('/my-courses')
  .get(restrictTo('lecturer'), getMyCourses);

module.exports = router;