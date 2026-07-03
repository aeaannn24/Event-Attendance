import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import DashboardCard from '../components/DashboardCard';
import ChartCard from '../components/ChartCard';
import { CalendarDays, Users, CheckCircle2, ShieldCheck } from 'lucide-react';

const todayKey = new Date().toISOString().slice(0, 10);

const shortEventName = (name = '') => name.replace('Campus ', '').replace('Science ', '').slice(0, 16) || 'Event';

const DashboardPage = ({ user, attendanceWindow = {}, attendanceRecords = [], events = [], students = [] }) => {
  const role = user?.role || 'student';
  const isAdmin = role === 'admin';
  const currentStudentRecords = attendanceRecords.filter((record) =>
    record.studentId === user?.studentId || record.studentId === user?.id || record.studentName === user?.name
  );
  const visibleRecords = isAdmin ? attendanceRecords : currentStudentRecords;
  const totalEvents = events.length;
  const totalStudents = students.length;
  const totalAttended = visibleRecords.filter((record) => record.status === 'Present').length;
  const totalAbsent = visibleRecords.filter((record) => record.status === 'Absent').length;
  const studentAbsent = Math.max(totalEvents - totalAttended, totalAbsent);
  const attendanceRate = totalAttended + totalAbsent > 0 ? Math.round((totalAttended / (totalAttended + totalAbsent)) * 100) : 0;
  const eventsToday = events.filter((event) => event.date === todayKey).length;

  const statsData = isAdmin
    ? [
        { label: 'Total Events', value: totalEvents, icon: <CalendarDays className="h-5 w-5" />, accent: 'bg-blue-100 text-blue-600' },
        { label: 'Registered Students', value: totalStudents, icon: <Users className="h-5 w-5" />, accent: 'bg-slate-100 text-slate-700' },
        { label: 'Total Attended', value: totalAttended, icon: <CheckCircle2 className="h-5 w-5" />, accent: 'bg-green-100 text-emerald-600' },
        { label: 'Total Absent', value: totalAbsent, icon: <ShieldCheck className="h-5 w-5" />, accent: 'bg-orange-100 text-amber-600' },
      ]
    : [
        { label: 'Total Events', value: totalEvents, icon: <CalendarDays className="h-5 w-5" />, accent: 'bg-blue-100 text-blue-600' },
        { label: 'Total Attended', value: totalAttended, icon: <CheckCircle2 className="h-5 w-5" />, accent: 'bg-green-100 text-emerald-600' },
        { label: 'Total Absent', value: studentAbsent, icon: <ShieldCheck className="h-5 w-5" />, accent: 'bg-orange-100 text-amber-600' },
        { label: 'Attendance Rate', value: `${attendanceRate}%`, icon: <Users className="h-5 w-5" />, accent: 'bg-slate-100 text-slate-700' },
      ];

  const attendanceTrendData = Object.values(
    visibleRecords.reduce((groups, record) => {
      const label = record.submissionDate || 'No date';
      groups[label] ||= { name: label.slice(5) || label, attendance: 0 };
      if (record.status === 'Present') groups[label].attendance += 1;
      return groups;
    }, {})
  ).slice(-6);

  const eventParticipationData = events.map((event) => ({
    name: shortEventName(event.title),
    attendees: attendanceRecords.filter((record) => record.eventName === event.title && record.status === 'Present').length,
  }));

  const recentAttendanceData = visibleRecords.slice(0, 4);
  const upcomingEvents = events.filter((event) => event.status !== 'completed').slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white/95 p-6 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {isAdmin ? 'Admin Dashboard' : 'Student Dashboard'}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {isAdmin
                ? 'Manage events, attendance, and student engagement from a central overview.'
                : 'Review your attendance record, upcoming events, and recent check-ins.'}
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 shadow-sm">
            <span className="font-semibold text-slate-900">Welcome back</span>
            <p className="mt-1">{user?.name || 'User'}, here is your latest summary.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statsData.map((item) => (
          <DashboardCard key={item.label} {...item} />
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-xl shadow-slate-200/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Latest Announcement</h2>
            <p className="mt-2 text-sm text-slate-400">Important attendance window updates and admin messages.</p>
          </div>
          <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-200">
            {attendanceWindow.durationMinutes || 15} minute limit
          </span>
        </div>
        <div className="mt-5 rounded-[28px] bg-slate-900/90 p-5 text-sm leading-7 text-slate-200 whitespace-pre-line break-words">
          {attendanceWindow.announcement || 'No announcements have been published yet. Check back here for the latest updates.'}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title={isAdmin ? 'Attendance Count by Date' : 'Your Attendance Trend'}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrendData.length ? attendanceTrendData : [{ name: 'No data', attendance: 0 }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Event Participation">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventParticipationData.length ? eventParticipationData : [{ name: 'No events', attendees: 0 }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="attendees" fill="#2563EB" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl bg-white/95 p-6 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{isAdmin ? 'Upcoming Events' : 'Next Scheduled Events'}</h2>
              <p className="mt-2 text-sm text-slate-500">{eventsToday} event(s) scheduled today.</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Active</span>
          </div>
          <div className="mt-6 space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{event.title}</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{event.location} • {event.date}</p>
              </div>
            ))}
            {upcomingEvents.length === 0 && <p className="text-sm text-slate-500">No upcoming events.</p>}
          </div>
        </div>

        <div className="rounded-3xl bg-white/95 p-6 shadow-xl shadow-slate-200/50 xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{isAdmin ? 'Recent Check-ins' : 'Your Recent Attendance'}</h2>
              <p className="mt-2 text-sm text-slate-500">Review the latest attendance activity and session statuses.</p>
            </div>
            <Link to="/attendance" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
              View All
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {recentAttendanceData.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-3xl border border-slate-200 p-4">
                <div>
                  <p className="text-sm text-slate-500">{isAdmin ? item.studentName : item.eventName}</p>
                  <p className="mt-1 text-sm text-slate-700">{isAdmin ? item.eventName : item.status}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{item.submissionTime || '—'}</p>
              </div>
            ))}
            {recentAttendanceData.length === 0 && <p className="rounded-3xl border border-slate-200 p-4 text-sm text-slate-500">No attendance records yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
