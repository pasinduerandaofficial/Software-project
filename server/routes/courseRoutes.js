const express = require('express');
const router = express.Router();
const { getAllCourses, createCourse } = require('../controllers/courseController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getAllCourses) // Anyone logged in can view courses
  .post(restrictTo('admin'), createCourse); // Only admin can create

module.exports = router;