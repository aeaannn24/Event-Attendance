import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import AttendancePage from './pages/AttendancePage';
import StudentsPage from './pages/StudentsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import SubmitAttendancePage from './pages/SubmitAttendancePage';
import AttendanceDetailsPage from './pages/AttendanceDetailsPage';
import Layout from './layout/Layout';

const STORAGE_KEYS = {
  user: 'attendance_user',
  attendanceWindow: 'attendance_window',
  chatMessages: 'attendance_chat_messages',
};

const defaultWindow = {
  date: new Date().toISOString().slice(0, 10),
  time: '09:00',
  durationMinutes: 15,
  announcement: 'Attendance window is open.',
};

const defaultStudents = [
  { id: '1', studentId: 'S1001', name: 'Aiden Reyes', gender: 'male', course: 'Bachelor of Science in Information Technology', yearLevel: '3' },
  { id: '2', studentId: 'S1002', name: 'Bianca Lopez', gender: 'female', course: 'Bachelor of Science in Hospitality Management', yearLevel: '2' },
  { id: '3', studentId: 'S1003', name: 'Carsen Smith', gender: 'male', course: 'Bachelor of Science in Industrial Technology (Automotive)', yearLevel: '1' },
  { id: '4', studentId: 'S1004', name: 'Mila Santos', gender: 'female', course: 'Bachelor of Science in Industrial Technology (Computer Science)', yearLevel: '2' },
];

const defaultEvents = [
  { id: '1', title: 'Campus Orientation', location: 'Main Auditorium', date: '2026-06-25', time: '09:00', durationMinutes: 60, status: 'upcoming' },
  { id: '2', title: 'Science Seminar', location: 'Science Hall', date: '2026-06-27', time: '10:00', durationMinutes: 90, status: 'upcoming' },
  { id: '3', title: 'Career Fair', location: 'Gymnasium', date: '2026-06-18', time: '08:00', durationMinutes: 60, status: 'completed' },
];

const defaultAttendanceRecords = [
  {
    id: '1',
    studentId: 'S1001',
    studentName: 'Aiden Reyes',
    gender: 'male',
    course: 'Bachelor of Science in Information Technology',
    yearLevel: '3',
    eventName: 'Career Fair',
    submissionDate: '2026-06-22',
    submissionTime: '10:04 AM',
    status: 'Present',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=180&q=80',
  },
  {
    id: '2',
    studentId: 'S1002',
    studentName: 'Bianca Lopez',
    gender: 'female',
    course: 'Bachelor of Science in Hospitality Management',
    yearLevel: '2',
    eventName: 'Career Fair',
    submissionDate: '2026-06-22',
    submissionTime: '10:18 AM',
    status: 'Present',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=180&q=80',
  },
  {
    id: '3',
    studentId: 'S1003',
    studentName: 'Carsen Smith',
    gender: 'male',
    course: 'Bachelor of Science in Industrial Technology (Automotive)',
    yearLevel: '1',
    eventName: 'Workshop',
    submissionDate: '2026-06-22',
    submissionTime: '09:34 AM',
    status: 'Absent',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=180&q=80',
  },
  {
    id: '4',
    studentId: 'S1004',
    studentName: 'Mila Santos',
    gender: 'female',
    course: 'Bachelor of Science in Industrial Technology (Computer Science)',
    yearLevel: '2',
    eventName: 'Campus Orientation',
    submissionDate: '2026-06-22',
    submissionTime: '09:58 AM',
    status: 'Present',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=180&q=80',
  },
];

const loadLocal = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const getNotificationsKey = (role) => {
  const normalizedRole = role === 'admin' ? 'admin' : 'student';
  return `attendance_notifications_${normalizedRole}`;
};

const saveLocal = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore localStorage write issues.
  }
};

const createNotification = (message) => ({
  id: `note-${Date.now()}`,
  message,
  timestamp: new Date().toISOString(),
  read: false,
});

const App = () => {
  const [user, setUser] = useState(() => loadLocal(STORAGE_KEYS.user, null));
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState(() => loadLocal('attendance_students', defaultStudents));
  const [events, setEvents] = useState(() => loadLocal('attendance_events', defaultEvents));
  const [attendanceRecords, setAttendanceRecords] = useState(() => loadLocal('attendance_records', defaultAttendanceRecords));
  const [attendanceWindow, setAttendanceWindow] = useState(() => loadLocal(STORAGE_KEYS.attendanceWindow, defaultWindow));
  const [chatMessages, setChatMessages] = useState(() => loadLocal(STORAGE_KEYS.chatMessages, []));

  useEffect(() => {
    saveLocal(STORAGE_KEYS.user, user);
  }, [user]);

  useEffect(() => {
    if (user) {
      setNotifications(loadLocal(getNotificationsKey(user.role), []));
    } else {
      setNotifications([]);
    }
  }, [user]);

  useEffect(() => {
    saveLocal('attendance_students', students);
  }, [students]);

  useEffect(() => {
    saveLocal('attendance_events', events);
  }, [events]);

  useEffect(() => {
    saveLocal('attendance_records', attendanceRecords);
  }, [attendanceRecords]);

  useEffect(() => {
    saveLocal(STORAGE_KEYS.attendanceWindow, attendanceWindow);
  }, [attendanceWindow]);

  useEffect(() => {
    saveLocal(STORAGE_KEYS.chatMessages, chatMessages);
  }, [chatMessages]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEYS.user);
  };

  const addStudent = (studentData) => {
    const newStudent = {
      id: `student-${Date.now()}`,
      studentId: studentData.studentId || `S${Date.now()}`,
      name: studentData.name,
      gender: studentData.gender || 'male',
      course: studentData.course,
      yearLevel: studentData.yearLevel,
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const deleteStudent = (studentId) => {
    setStudents((prev) => prev.filter((student) => student.studentId !== studentId));
    setAttendanceRecords((prev) => prev.filter((record) => record.studentId !== studentId));
    addNotificationForRole('admin', `Student ${studentId} was removed from the roster.`);
  };

  const saveEventDetails = (eventId, eventData) => {
    const trimmedTitle = eventData.title?.trim();
    const trimmedLocation = eventData.location?.trim();

    if (!trimmedTitle || !trimmedLocation || !eventData.date) return null;

    const existingEvent = events.find((event) => event.id === eventId);
    const savedEvent = {
      id: eventId || `event-${Date.now()}`,
      title: trimmedTitle,
      location: trimmedLocation,
      date: eventData.date,
      time: eventData.time || attendanceWindow.time || '09:00',
      durationMinutes: Number(eventData.durationMinutes || attendanceWindow.durationMinutes || 15),
      status: eventData.status || 'upcoming',
    };

    setEvents((prev) => {
      if (existingEvent) {
        return prev.map((event) => (event.id === eventId ? savedEvent : event));
      }

      return [savedEvent, ...prev];
    });

    if (existingEvent && existingEvent.title !== savedEvent.title) {
      setAttendanceRecords((prev) =>
        prev.map((record) => (record.eventName === existingEvent.title ? { ...record, eventName: savedEvent.title } : record))
      );
    }

    if (savedEvent.status === 'ongoing') {
      const nextWindow = {
        date: savedEvent.date || attendanceWindow.date,
        time: savedEvent.time || attendanceWindow.time,
        durationMinutes: Number(savedEvent.durationMinutes || attendanceWindow.durationMinutes || 15),
        announcement: attendanceWindow.announcement || 'Attendance window is open.',
        activeEventId: savedEvent.id,
      };
      setAttendanceWindow(nextWindow);
      addNotificationForRole('admin', `Attendance window aligned to ongoing event ${savedEvent.title}: ${nextWindow.date} at ${nextWindow.time}.`);
      addNotificationForRole('student', `Attendance window updated for ${savedEvent.title} on ${nextWindow.date} at ${nextWindow.time}.`);
    }

    addNotificationForRole('admin', `Event updated: ${savedEvent.title} at ${savedEvent.location}.`);
    addNotificationForRole('student', `Event details updated: ${savedEvent.title} at ${savedEvent.location}.`);
    return savedEvent;
  };

  const deleteEvent = (eventId) => {
    const eventToDelete = events.find((event) => event.id === eventId);
    if (!eventToDelete) return;

    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    setAttendanceRecords((prev) => prev.filter((record) => record.eventName !== eventToDelete.title));
    addNotificationForRole('admin', `Event deleted: ${eventToDelete.title}.`);
    addNotificationForRole('student', `Event removed: ${eventToDelete.title}.`);
  };

  const updateUserProfile = (profileData) => {
    const nextUser = {
      ...user,
      ...profileData,
      name: profileData.name?.trim() || user?.name || 'User',
      email: profileData.email?.trim() || user?.email || '',
    };

    setUser(nextUser);
    addNotificationForRole(nextUser.role || 'student', 'Your profile information was updated.');
  };

  const saveNotifications = (role, nextNotifications) => {
    saveLocal(getNotificationsKey(role), nextNotifications);
  };

  const loadNotifications = (role) => {
    return loadLocal(getNotificationsKey(role), []);
  };

  const addNotificationForRole = (role, message) => {
    const note = createNotification(message);
    const prev = loadNotifications(role);
    const next = [note, ...prev];
    saveNotifications(role, next);

    if (user?.role === role) {
      setNotifications(next);
    }

    return next;
  };

  const addNotification = (message) => {
    if (!user) return;
    return addNotificationForRole(user.role, message);
  };

  const clearNotifications = () => {
    if (!user) return;
    const next = [];
    saveNotifications(user.role, next);
    setNotifications(next);
  };

  const markAllNotificationsRead = () => {
    if (!user) return;
    const next = notifications.map((note) => ({ ...note, read: true }));
    saveNotifications(user.role, next);
    setNotifications(next);
  };

  const updateAttendanceWindow = ({ date, time, durationMinutes, announcement, activeEventId } = {}) => {
    const next = {
      date: date || attendanceWindow.date,
      time: time || attendanceWindow.time,
      durationMinutes: Number(durationMinutes || attendanceWindow.durationMinutes || 15),
      announcement: announcement || attendanceWindow.announcement,
      activeEventId: activeEventId || attendanceWindow.activeEventId || null,
    };
    setAttendanceWindow(next);
    addNotificationForRole('admin', `Admin set attendance window for ${next.date} at ${next.time} (${next.durationMinutes} minutes).`);
    addNotificationForRole('student', `Attendance window updated to ${next.date} at ${next.time} for ${next.durationMinutes} minutes.`);
  };

  const publishAnnouncement = (message) => {
    const next = { ...attendanceWindow, announcement: message };
    setAttendanceWindow(next);
    addNotificationForRole('admin', `Admin announcement: ${message}`);
    addNotificationForRole('student', `New announcement: ${message}`);
  };

  const submitAttendanceRecord = (record) => {
    const alreadySubmitted = attendanceRecords.some(
      (item) => item.studentId === record.studentId && item.eventName === record.eventName
    );

    if (alreadySubmitted) {
      return false;
    }

    setAttendanceRecords((prev) => [record, ...prev]);

    addNotificationForRole('admin', `Student ${record.studentName} submitted attendance for ${record.eventName}.`);
    if (user?.role === 'student') {
      addNotificationForRole('student', `Your attendance for ${record.eventName} was submitted.`);
    }

    return true;
  };

  const deleteAttendanceRecord = (recordId) => {
    const record = attendanceRecords.find((item) => String(item.id) === String(recordId));
    if (!record || user?.role !== 'admin') return false;

    setAttendanceRecords((prev) => prev.filter((item) => String(item.id) !== String(recordId)));
    addNotificationForRole('admin', `Attendance record deleted: ${record.studentName} - ${record.eventName}.`);
    return true;
  };

  const sendChatMessage = ({ text, recipient, replyToId }) => {
    if (!user || !text?.trim() || !recipient) return;

    const nextMessage = {
      id: `chat-${Date.now()}`,
      text: text.trim(),
      senderName: user.name || (user.role === 'admin' ? 'Admin' : 'Student'),
      senderRole: user.role === 'admin' ? 'admin' : 'student',
      senderId: user.id || user.email || user.name,
      recipientId: recipient.id,
      recipientName: recipient.name,
      recipientRole: recipient.role,
      replyToId: replyToId || null,
      reactions: {},
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [nextMessage, ...prev]);
  };

  const deleteChatMessage = (messageId) => {
    setChatMessages((prev) =>
      prev.filter((message) => {
        const ownsMessage = message.senderId === (user?.id || user?.email || user?.name);
        return String(message.id) !== String(messageId) || (!ownsMessage && user?.role !== 'admin');
      })
    );
  };

  const reactToChatMessage = (messageId, reaction) => {
    const actorId = user?.id || user?.email || user?.name || 'current-user';
    setChatMessages((prev) =>
      prev.map((message) => {
        if (String(message.id) !== String(messageId)) return message;
        const nextReactions = { ...(message.reactions || {}) };
        nextReactions[actorId] = nextReactions[actorId] === reaction ? null : reaction;
        return { ...message, reactions: nextReactions };
      })
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Navigate to="/login/student" replace />} />
        <Route path="/signup" element={<Navigate to="/signup/student" replace />} />
        <Route path="/login/:role?" element={<LoginPage onLogin={login} />} />
        <Route path="/signup/:role?" element={<SignupPage onLogin={login} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute
              user={user}
              component={
                <Layout
                  user={user}
                  onLogout={logout}
                  notifications={notifications}
                  clearNotifications={clearNotifications}
                  onMarkAllRead={markAllNotificationsRead}
                  chatMessages={chatMessages}
                  students={students}
                  events={events}
                  attendanceRecords={attendanceRecords}
                  onSendChatMessage={sendChatMessage}
                  onDeleteChatMessage={deleteChatMessage}
                  onReactToChatMessage={reactToChatMessage}
                />
              }
            />
          }
        >
          <Route index element={<DashboardPage user={user} attendanceWindow={attendanceWindow} attendanceRecords={attendanceRecords} events={events} students={students} />} />
          <Route
            path="events"
            element={
              <EventsPage
                user={user}
                events={events}
                attendanceWindow={attendanceWindow}
                onSaveEvent={saveEventDetails}
                onDeleteEvent={deleteEvent}
                onSaveWindow={updateAttendanceWindow}
                onPublishAnnouncement={publishAnnouncement}
              />
            }
          />
          <Route path="attendance" element={<AttendancePage user={user} attendanceRecords={attendanceRecords} onDeleteAttendance={deleteAttendanceRecord} />} />
          <Route path="students" element={<StudentsPage user={user} students={students} onAddStudent={addStudent} onDeleteStudent={deleteStudent} />} />
          <Route
            path="submit-attendance"
            element={
              <SubmitAttendancePage
                user={user}
                events={events}
                attendanceRecords={attendanceRecords}
                attendanceWindow={attendanceWindow}
                onSaveWindow={updateAttendanceWindow}
                onPublishAnnouncement={publishAnnouncement}
                onSubmitAttendance={submitAttendanceRecord}
              />
            }
          />
          <Route path="attendance/:id" element={<AttendanceDetailsPage attendanceRecords={attendanceRecords} events={events} />} />
          <Route path="reports" element={<ReportsPage attendanceRecords={attendanceRecords} events={events} students={students} />} />
          <Route path="settings" element={<SettingsPage user={user} onUpdateProfile={updateUserProfile} />} />
        </Route>
        <Route path="*" element={<Navigate to={user ? '/' : '/login/student'} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const ProtectedRoute = ({ user, component }) => {
  return user ? component : <Navigate to="/login/student" replace />;
};

export default App;
