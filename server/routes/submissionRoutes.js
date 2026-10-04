const express = require('express');
const router = express.Router();
const { 
  getTasks, createTask, deleteTask, 
  getRecordsForTask, updateRecordStatus,
  getMySubmissions
} = require('../controllers/submissionController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);

// Student Routes
router.get('/my-submissions', restrictTo('student'), getMySubmissions);

// Admin Routes (Tasks)
router.route('/tasks')
  .get(restrictTo('admin'), getTasks)
  .post(restrictTo('admin'), createTask);

router.route('/tasks/:id')
  .delete(restrictTo('admin'), deleteTask);

// Admin Routes (Records)
router.get('/tasks/:taskId/records', restrictTo('admin'), getRecordsForTask);
router.patch('/records/:id', restrictTo('admin'), updateRecordStatus);

module.exports = router;
