const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  checkInTime: { type: Date, default: Date.now },
  photoUrl: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent'], default: 'present' },
  notes: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

attendanceSchema.index({ student: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
