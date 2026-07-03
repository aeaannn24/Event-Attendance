const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Event = require('../models/Event');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

dotenv.config();

const seedData = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Event.deleteMany(), Student.deleteMany(), Attendance.deleteMany()]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Password123!',
    gender: 'male',
    role: 'admin',
  });

  const staff = await User.create({
    name: 'Event Staff',
    email: 'staff@example.com',
    password: 'Password123!',
    gender: 'female',
    role: 'staff',
  });

  const events = await Event.create([
    {
      title: 'Campus Orientation',
      description: 'Welcome session for freshmen and returning students.',
      location: 'Main Auditorium',
      date: new Date(Date.now() + 86400000),
      status: 'upcoming',
      organizer: admin._id,
    },
    {
      title: 'Science Seminar',
      description: 'Advanced seminar on AI and data science in education.',
      location: 'Science Hall',
      date: new Date(Date.now() + 3 * 86400000),
      status: 'upcoming',
      organizer: staff._id,
    },
    {
      title: 'Career Fair',
      description: 'Meet employers and prepare for future opportunities.',
      location: 'Gymnasium',
      date: new Date(Date.now() - 2 * 86400000),
      status: 'completed',
      organizer: admin._id,
    },
  ]);

  const students = await Student.create([
    { studentId: 'S1001', firstName: 'Aiden', lastName: 'Reyes', gender: 'male', course: 'Computer Science', yearLevel: '3', email: 'aiden.reyes@school.edu' },
    { studentId: 'S1002', firstName: 'Bianca', lastName: 'Lopez', gender: 'female', course: 'Information Technology', yearLevel: '2', email: 'bianca.lopez@school.edu' },
    { studentId: 'S1003', firstName: 'Carsen', lastName: 'Smith', gender: 'male', course: 'Business Administration', yearLevel: '1', email: 'carsen.smith@school.edu' },
  ]);

  await Attendance.create([
    {
      student: students[0]._id,
      event: events[2]._id,
      photoUrl: 'https://via.placeholder.com/200x200.png?text=Attendance+Photo',
      status: 'present',
      notes: 'Checked in on time.',
      createdBy: staff._id,
    },
    {
      student: students[1]._id,
      event: events[2]._id,
      photoUrl: 'https://via.placeholder.com/200x200.png?text=Attendance+Photo',
      status: 'present',
      notes: 'Arrived late.',
      createdBy: staff._id,
    },
  ]);

  console.log('Seed complete');
  process.exit();
};

seedData().catch((error) => {
  console.error(error);
  process.exit(1);
});
