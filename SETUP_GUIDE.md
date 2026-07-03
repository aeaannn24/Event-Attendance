# Application Setup & Running Instructions

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
node seeds/seed.js  # Populate test data (admin, events, students)
npm run dev         # Runs on http://localhost:5000 or next available port
```

**Test Credentials (after seeding):**
- Admin: `admin@example.com` / `Password123!`
- Staff: `staff@example.com` / `Password123!`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev         # Runs on http://localhost:5173 (local) + http://YOUR_IP:5173 (network)
```

---

## Local Network Access (Connect from Another Device)

### Step 1: Find Your Machine's Local IP
**Windows:**
```powershell
ipconfig  # Look for IPv4 Address (e.g., 192.168.x.x)
```

**Mac/Linux:**
```bash
ifconfig  # Look for inet (e.g., 192.168.x.x)
```

### Step 2: Connect from Another Device
1. Frontend: `http://YOUR_IP:5173` (e.g., `http://192.168.1.100:5173`)
2. Backend runs on: `http://YOUR_IP:5000`
3. The frontend Vite dev server automatically proxies `/api` calls to the backend on the host machine (default: `http://127.0.0.1:5000`) → works on LAN

### Common Issues & Fixes

#### **Login/Signup Not Working**
- **Issue:** Frontend can't reach backend API
- **Fix 1:** Ensure backend is running (`npm run dev` in `backend/`)
- **Fix 2:** Check frontend browser console (F12) for CORS or proxy errors
- **Fix 3:** Verify network: Ping your machine's IP from another device

#### **Dashboard Showing No Data**
- **Issue:** Seed data not loaded
- **Fix:** Run `node seeds/seed.js` in the `backend/` folder before starting the app

#### **Port Already in Use**
- **Backend:** Auto-increments to next port (5001, 5002, etc.) — check console output
- **Frontend:** If 5173 is busy, specify a different port: `npm run dev -- --port 5174`

#### **Cross-Device Access Not Working**
- **Issue:** Firewall blocking ports 5000 or 5173
- **Fix:** Allow ports in Windows Firewall:
  - Open Windows Defender Firewall → Advanced Settings
  - Create Inbound Rules for ports 5000 and 5173
- **Or disable firewall temporarily for testing** (not recommended for production)

---

## Dashboard Features (Both Admin & Student)

### Admin-Only Features:
- ✅ Manage students (add/delete)
- ✅ Create & edit events
- ✅ Set attendance windows
- ✅ Publish announcements
- ✅ View all attendance records
- ✅ Generate reports
- ✅ Chat with students

### Student Features:
- ✅ View dashboard & attendance summary
- ✅ Submit attendance (within attendance window)
- ✅ View upcoming events
- ✅ Check personal attendance history
- ✅ Chat with admin
- ✅ Update profile

---

## Architecture

```
Frontend (React + Vite)
├── Login/Signup → /api/auth/*
├── Dashboard → Shows student/admin views
└── Pages → Events, Attendance, Students, Reports, Settings
     └── Proxied to Backend via Vite dev server (/api → http://localhost:5000)

Backend (Express + MongoDB)
├── /api/auth/* → Authentication (JWT)
├── /api/events/* → Event CRUD
├── /api/students/* → Student CRUD
├── /api/attendance/* → Attendance records
└── /api/reports/* → Generate reports
```

---

## Testing Login/Signup with cURL (Optional)

```bash
# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Password123!"}'

# Expected response
{"id":"...","name":"Admin User","email":"admin@example.com","role":"admin","token":"..."}
```

---

## Development Notes
- Frontend API calls use relative paths (`/api/...`) → proxied to backend
- Backend runs on port 5000 by default, auto-increments if port taken
- Database: MongoDB (local `mongodb://127.0.0.1:27017/event-attendance`)
- Auth: JWT tokens stored in `localStorage`
- Notifications: Stored locally per role
