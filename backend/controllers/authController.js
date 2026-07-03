const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const signupUser = async (req, res) => {
  const { name, email, password, role, gender } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  const normalizedRole = role === 'admin' ? 'admin' : role === 'staff' ? 'staff' : 'student';
  const user = await User.create({
    name,
    email,
    password,
    gender: gender === 'female' ? 'female' : 'male',
    role: normalizedRole,
  });
  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    role: user.role,
    token: generateToken(user._id),
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.comparePassword(password))) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const getProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    gender: req.user.gender,
    role: req.user.role,
  });
};

module.exports = { signupUser, loginUser, getProfile };
