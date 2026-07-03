import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const AttendancePage = ({ user, attendanceRecords = [], onDeleteAttendance }) => {
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [selectedEvent, setSelectedEvent] = useState('All Events');
  const [filterDate, setFilterDate] = useState('');
  const [message, setMessage] = useState('');
  const isAdmin = user?.role === 'admin';

  const courseFilters = useMemo(() => {
    const courses = attendanceRecords.map((record) => record.course).filter(Boolean);
    return ['All Courses', ...Array.from(new Set(courses))];
  }, [attendanceRecords]);

  const filtered = attendanceRecords.filter((record) => {
    const keyword = search.trim().toLowerCase();
    const matchesCourse = selectedCourse === 'All Courses' || record.course === selectedCourse;
    const matchesEvent = selectedEvent === 'All Events' || record.eventName === selectedEvent;
    const matchesDate = !filterDate || record.eventDate === filterDate || record.submissionDate === filterDate;
    const matchesSearch =
      !keyword ||
      [record.studentName, record.studentId, record.gender, record.eventName, record.status].some((value) =>
        String(value || '').toLowerCase().includes(keyword)
      );

    return matchesCourse && matchesEvent && matchesDate && matchesSearch;
  });

  const handleDelete = (record) => {
    if (!isAdmin) return;
    if (!window.confirm(`Delete attendance record for ${record.studentName} - ${record.eventName}?`)) return;

    const deleted = onDeleteAttendance?.(record.id);
    setMessage(deleted ? 'Attendance record deleted.' : 'Unable to delete attendance record.');
  };

  return (
    <div className="min-w-0 space-y-6">
      <section className="rounded-[32px] border border-slate-800/70 bg-slate-950/80 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.28)] glass-card">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-100">Attendance Records</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Search, filter, and review student attendance submissions with photo proof and detailed record pages.
            </p>
          </div>
          <div className="w-full max-w-2xl">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by student, event, status, or ID"
              className="w-full rounded-full border border-slate-800/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <select
            value={selectedEvent}
            onChange={(event) => setSelectedEvent(event.target.value)}
            className="rounded-full border border-slate-800/70 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 outline-none transition hover:border-slate-600"
          >
            <option>All Events</option>
            {Array.from(new Set(attendanceRecords.map((record) => record.eventName))).map((eventName) => (
              <option key={eventName} value={eventName}>{eventName}</option>
            ))}
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(event) => setFilterDate(event.target.value)}
            className="rounded-full border border-slate-800/70 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 outline-none transition hover:border-slate-600"
          />
          <button
            type="button"
            onClick={() => {
              setSelectedEvent('All Events');
              setFilterDate('');
              setSearch('');
              setSelectedCourse('All Courses');
            }}
            className="rounded-full border border-slate-800/70 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-600"
          >
            Clear filters
          </button>
          {courseFilters.map((course) => (
            <button
              key={course}
              type="button"
              onClick={() => setSelectedCourse(course)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                selectedCourse === course
                  ? 'border-sky-400 bg-sky-500/15 text-sky-300 shadow-[0_0_0_1px_rgba(56,189,248,0.3)]'
                  : 'border-slate-800/70 bg-slate-900/80 text-slate-300 hover:border-slate-600 hover:bg-slate-900/95'
              }`}
            >
              {course}
            </button>
          ))}
        </div>

        {message && (
          <div className="mt-5 rounded-3xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
            {message}
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-800/70 bg-slate-950/95 shadow-[0_30px_70px_rgba(15,23,42,0.24)]">
          <div className="overflow-x-auto">
            <table className="min-w-[1080px] text-left text-sm">
              <thead className="border-b border-slate-800/80 bg-slate-900/90 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Student ID</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Gender</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Proof</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id} className="border-b border-slate-800/80 transition duration-300 hover:bg-slate-900/75">
                    <td className="px-4 py-4 text-sky-200">{record.studentId}</td>
                    <td className="px-4 py-4 text-slate-100">{record.studentName}</td>
                    <td className="px-4 py-4 capitalize text-slate-300">{record.gender || 'male'}</td>
                    <td className="max-w-[260px] truncate px-4 py-4 text-slate-300">{record.course}</td>
                    <td className="px-4 py-4 text-slate-300">{record.yearLevel}</td>
                    <td className="px-4 py-4 text-slate-300">{record.eventName}</td>
                    <td className="px-4 py-4 text-slate-300">{record.submissionDate || '—'}</td>
                    <td className="px-4 py-4 text-slate-300">{record.submissionTime || '—'}</td>
                    <td className={`px-4 py-4 font-semibold ${record.status === 'Present' ? 'text-emerald-300' : 'text-amber-300'}`}>{record.status}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <img src={record.photoUrl} alt={`${record.studentName} proof`} className="h-14 w-14 rounded-2xl object-cover" />
                        <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Photo</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/attendance/${record.id}`}
                          className="inline-flex rounded-full border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-sky-400 hover:text-sky-300"
                        >
                          Details
                        </Link>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDelete(record)}
                            className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="11" className="px-4 py-10 text-center text-slate-500">No attendance records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AttendancePage;
