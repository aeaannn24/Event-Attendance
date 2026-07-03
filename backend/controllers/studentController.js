const Student = require('../models/Student');

const createStudent = async (req, res) => {
  const { studentId, firstName, lastName, gender, course, yearLevel, email } = req.body;
  const exists = await Student.findOne({ studentId });
  if (exists) {
    return res.status(400).json({ message: 'Student ID already exists' });
  }
  const student = await Student.create({ studentId, firstName, lastName, gender, course, yearLevel, email });
  res.status(201).json(student);
};

const getStudents = async (req, res) => {
  const students = await Student.find().sort({ lastName: 1, firstName: 1 });
  res.json(students);
};

const getStudentById = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
};

const updateStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  const updates = ['studentId', 'firstName', 'lastName', 'gender', 'course', 'yearLevel', 'email'];
  updates.forEach((field) => {
    if (req.body[field] !== undefined) {
      student[field] = req.body[field];
    }
  });
  await student.save();
  res.json(student);
};

const deleteStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  await student.deleteOne();
  res.json({ message: 'Student removed' });
};

module.exports = { createStudent, getStudents, getStudentById, updateStudent, deleteStudent };
