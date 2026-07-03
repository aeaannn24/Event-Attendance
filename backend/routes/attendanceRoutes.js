const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, authorizeRoles } = require('../middleware/auth');
const {
  createAttendance,
  getAttendanceRecords,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} = require('../controllers/attendanceController');

const uploadPath = process.env.UPLOAD_PATH || 'uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', uploadPath)),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const router = express.Router();
router.use(protect);
router.route('/').get(getAttendanceRecords).post(authorizeRoles('admin', 'staff', 'student'), upload.single('photo'), createAttendance);
router.route('/:id').get(getAttendanceById).put(authorizeRoles('admin', 'staff'), updateAttendance).delete(authorizeRoles('admin'), deleteAttendance);
module.exports = router;
