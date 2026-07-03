const express = require('express');
const { protect, authorizeRoles } = require('../middleware/auth');
const { getAttendanceReport, getEventReport } = require('../controllers/reportController');

const router = express.Router();
router.use(protect);
router.get('/attendance', authorizeRoles('admin', 'staff'), getAttendanceReport);
router.get('/events', authorizeRoles('admin', 'staff'), getEventReport);
module.exports = router;
