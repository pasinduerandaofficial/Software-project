const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, deleteUser } = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/')
  .get(restrictTo('admin', 'lecturer'), getAllUsers)
  .post(restrictTo('admin'), createUser);

router.route('/:id')
  .delete(restrictTo('admin'), deleteUser);

module.exports = router;