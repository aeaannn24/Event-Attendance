const express = require('express');
const { protect, authorizeRoles } = require('../middleware/auth');
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

const router = express.Router();
router.use(protect);
router.route('/').get(getStudents).post(authorizeRoles('admin', 'staff'), createStudent);
router.route('/:id').get(getStudentById).put(authorizeRoles('admin', 'staff'), updateStudent).delete(authorizeRoles('admin'), deleteStudent);
module.exports = router;
