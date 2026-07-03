const Event = require('../models/Event');
const Attendance = require('../models/Attendance');

const createEvent = async (req, res) => {
  const { title, description, location, date, status } = req.body;
  const event = await Event.create({
    title,
    description,
    location,
    date,
    status,
    organizer: req.user._id,
  });
  res.status(201).json(event);
};

const getEvents = async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
};

const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
};

const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  const updates = ['title', 'description', 'location', 'date', 'status'];
  updates.forEach((field) => {
    if (req.body[field] !== undefined) {
      event[field] = req.body[field];
    }
  });
  await event.save();
  res.json(event);
};

const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  await Attendance.deleteMany({ event: event._id });
  await event.deleteOne();
  res.json({ message: 'Event removed' });
};

module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent };
