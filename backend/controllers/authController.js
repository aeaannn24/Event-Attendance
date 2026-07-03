const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const signupUser = async (req, res, next) => {
  try {
    const { name, email, password, role, gender } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const normalizedRole = role === 'admin' ? 'admin' : role === 'staff' ? 'staff' : 'student';
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
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
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (user && (await user.comparePassword(password))) {
      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
        token: generateToken(user._id),
      });
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    next(error);
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
