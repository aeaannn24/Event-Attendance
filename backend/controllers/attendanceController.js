const path = require('path');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Event = require('../models/Event');

const createAttendance = async (req, res) => {
  const { studentId, eventId, notes } = req.body;
  const student = await Student.findOne({ studentId });
  const event = await Event.findById(eventId);
  if (!student || !event) {
    return res.status(404).json({ message: 'Student or event not found' });
  }
  // Only allow submission when event is ongoing
  if (event.status !== 'ongoing') {
    return res.status(400).json({ message: 'Event is not open for attendance submission' });
  }
  const existing = await Attendance.findOne({ student: student._id, event: event._id });
  if (existing) {
    return res.status(409).json({ message: 'Already submitted for this event. Please wait for another event to submit attendance.' });
  }
  let photoUrl = req.body.photoUrl;
  if (req.file) {
    photoUrl = `${req.protocol}://${req.get('host')}/${path.join(process.env.UPLOAD_PATH || 'uploads', req.file.filename)}`;
  }
  if (!photoUrl) {
    return res.status(400).json({ message: 'Attendance photo is required' });
  }
  try {
    const attendance = await Attendance.create({
      student: student._id,
      event: event._id,
      photoUrl,
      notes: notes || '',
      createdBy: req.user._id,
    });
    res.status(201).json(attendance);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Already submitted for this event. Please wait for another event to submit attendance.' });
    }

    throw error;
  }
};

const getAttendanceRecords = async (req, res) => {
  const { eventId, search, status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (eventId) query.event = eventId;
  if (status) query.status = status;

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    const students = await Student.find({
      $or: [
        { studentId: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
      ],
    }).select('_id');
    const events = await Event.find({ title: searchRegex }).select('_id');

    query.$or = [];
    if (students.length) {
      query.$or.push({ student: { $in: students.map((student) => student._id) } });
    }
    if (events.length) {
      query.$or.push({ event: { $in: events.map((event) => event._id) } });
    }
    if (query.$or.length === 0) {
      query.$or.push({ notes: searchRegex });
    }
  }

  const records = await Attendance.find(query)
    .populate('student')
    .populate('event')
    .sort({ checkInTime: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit, 10));
  const total = await Attendance.countDocuments(query);
  res.json({ records, total, page: Number(page), limit: Number(limit) });
};

const getAttendanceById = async (req, res) => {
  const record = await Attendance.findById(req.params.id).populate('student event');
  if (!record) return res.status(404).json({ message: 'Attendance record not found' });
  res.json(record);
};

const updateAttendance = async (req, res) => {
  const record = await Attendance.findById(req.params.id);
  if (!record) return res.status(404).json({ message: 'Attendance record not found' });
  const fields = ['status', 'notes'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) record[field] = req.body[field];
  });
  await record.save();
  res.json(record);
};

const deleteAttendance = async (req, res) => {
  const record = await Attendance.findById(req.params.id);
  if (!record) return res.status(404).json({ message: 'Attendance record not found' });
  await record.deleteOne();
  res.json({ message: 'Attendance record deleted' });
};

module.exports = { createAttendance, getAttendanceRecords, getAttendanceById, updateAttendance, deleteAttendance };
