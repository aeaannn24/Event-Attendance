const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { errorHandler, notFound } = require('./middleware/error');

dotenv.config();
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not configured. Sign-up/login will fail without it.');
}
if (!process.env.MONGODB_URI) {
  console.warn('WARNING: MONGODB_URI is not configured. The backend cannot connect to MongoDB.');
}
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const uploadPath = process.env.UPLOAD_PATH || 'uploads';
app.use(`/${uploadPath}`, express.static(path.join(__dirname, uploadPath)));

app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/reports', reportRoutes);

app.use(notFound);
app.use(errorHandler);

// Debug helper: when enabled, print registered routes to logs on startup.
// Set SHOW_ROUTES=true in the deployment environment to enable this.
if (process.env.SHOW_ROUTES === 'true') {
  try {
    const routes = [];
    app._router.stack.forEach((layer) => {
      if (layer.route && layer.route.path) {
        const methods = Object.keys(layer.route.methods).map((m) => m.toUpperCase()).join(',');
        routes.push(`${methods} ${layer.route.path}`);
      } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
        layer.handle.stack.forEach((r) => {
          if (r.route && r.route.path) {
            const methods = Object.keys(r.route.methods).map((m) => m.toUpperCase()).join(',');
            routes.push(`${methods} ${r.route.path}`);
          }
        });
      }
    });
    console.log('Registered routes:\n' + routes.join('\n'));
  } catch (err) {
    console.warn('Could not enumerate routes:', err.message);
  }
}

module.exports = app;
