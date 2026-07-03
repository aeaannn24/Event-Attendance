const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  gender: { type: String, enum: ['male', 'female'], default: 'male' },
  course: { type: String, required: true, trim: true },
  yearLevel: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
}, { timestamps: true });

studentSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Student', studentSchema);
