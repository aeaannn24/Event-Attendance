# Event Attendance Management System

A complete Event Attendance Management System built for schools, colleges, seminars, and organizational events.

## Tech Stack
- Frontend: React.js + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB
- Authentication: JWT
- File Upload: Local storage with Cloudinary-ready helper
- Charts: Recharts
- Icons: Lucide React

## Project Structure
- `backend/` - Express API, MongoDB models, authentication, attendance endpoints
- `frontend/` - React dashboard, responsive UI, protected routes

## Quick Start

### Backend
1. Open terminal in `backend`
2. `npm install`
3. Create `.env` from `.env.example`
4. `npm run dev`

### Frontend
1. Open terminal in `frontend`
2. `npm install`
3. `npm run dev`

## Sample Data
Seed sample users, events, students, and attendance using:

```bash
cd backend
node seeds/seed.js
```

## Notes
- Configure MongoDB URI and JWT secret in `backend/.env`
- Cloudinary is optional. If not configured, uploaded images will use local storage
- Frontend uses relative `/api` calls and Vite proxy configuration for backend access
