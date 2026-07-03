const Attendance = require('../models/Attendance');
const Event = require('../models/Event');

const getAttendanceReport = async (req, res) => {
  const { startDate, endDate, eventId } = req.query;
  const match = {};
  if (startDate) match.checkInTime = { $gte: new Date(startDate) };
  if (endDate) match.checkInTime = { ...(match.checkInTime || {}), $lte: new Date(endDate) };
  if (eventId) match.event = eventId;

  const report = await Attendance.aggregate([
    { $match: match },
    { $lookup: { from: 'students', localField: 'student', foreignField: '_id', as: 'student' } },
    { $unwind: '$student' },
    { $lookup: { from: 'events', localField: 'event', foreignField: '_id', as: 'event' } },
    { $unwind: '$event' },
    {
      $project: {
        studentId: '$student.studentId',
        studentName: { $concat: ['$student.firstName', ' ', '$student.lastName'] },
        course: '$student.course',
        yearLevel: '$student.yearLevel',
        eventName: '$event.title',
        checkInTime: 1,
        photoUrl: 1,
        status: 1,
        notes: 1,
      },
    },
    { $sort: { checkInTime: -1 } },
  ]);
  res.json(report);
};

const getEventReport = async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  const report = await Promise.all(
    events.map(async (event) => {
      const totalAttendance = await Attendance.countDocuments({ event: event._id, status: 'present' });
      return {
        eventId: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
        status: event.status,
        totalAttendance,
      };
    })
  );
  res.json(report);
};

module.exports = { getAttendanceReport, getEventReport };
