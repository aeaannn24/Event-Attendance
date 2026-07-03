const express = require('express');
const { protect, authorizeRoles } = require('../middleware/auth');
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

const router = express.Router();
router.use(protect);
router.route('/').get(getEvents).post(authorizeRoles('admin', 'staff'), createEvent);
router.route('/:id').get(getEventById).put(authorizeRoles('admin', 'staff'), updateEvent).delete(authorizeRoles('admin'), deleteEvent);
module.exports = router;
