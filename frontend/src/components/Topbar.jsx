import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, Bell, Search, UserCircle2, X } from 'lucide-react';

const Topbar = ({ user, onLogout, notifications = [], onClearNotifications, onMarkAllRead, events = [], students = [], attendanceRecords = [] }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const unreadCount = notifications.filter((note) => !note.read).length;
  const notificationsToShow = showAll ? notifications : notifications.slice(0, 5);
  const panelWidth = showAll ? 'w-[30rem]' : 'w-80';
  const keyword = search.trim().toLowerCase();
  const searchResults = keyword
    ? [
        ...events
          .filter((event) => [event.title, event.location, event.status].some((value) => String(value || '').toLowerCase().includes(keyword)))
          .slice(0, 4)
          .map((event) => ({ id: `event-${event.id}`, title: event.title, detail: event.location, path: '/events', type: 'Event' })),
        ...students
          .filter((student) => [student.name, student.studentId, student.course].some((value) => String(value || '').toLowerCase().includes(keyword)))
          .slice(0, 4)
          .map((student) => ({ id: `student-${student.id || student.studentId}`, title: student.name, detail: student.studentId, path: user?.role === 'admin' ? '/students' : '/settings', type: 'Student' })),
        ...attendanceRecords
          .filter((record) => [record.studentName, record.studentId, record.eventName, record.status].some((value) => String(value || '').toLowerCase().includes(keyword)))
          .slice(0, 4)
          .map((record) => ({ id: `attendance-${record.id}`, title: record.studentName, detail: record.eventName, path: `/attendance/${record.id}`, type: 'Attendance' })),
      ].slice(0, 8)
    : [];

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const firstResult = searchResults[0];
    if (firstResult) {
      navigate(firstResult.path);
      setSearch('');
      return;
    }

    if (keyword) navigate(user?.role === 'admin' ? '/students' : '/attendance');
  };

  return (
    <div className="sticky top-0 z-10 border-b border-panel/70 bg-gradient-to-b from-brand/20 to-panel/60 px-4 py-4 backdrop-blur-xl md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 text-slate-100">
          <CalendarClock className="h-5 w-5 text-accent" />
          <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
        </div>
        <form onSubmit={handleSearchSubmit} className="relative flex flex-1 items-center gap-3 rounded-full border border-panel/70 bg-panel/60 px-4 py-2 shadow-[0_24px_80px_rgba(7,26,47,0.35)]">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search events, students, attendance"
            className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
          />
          {keyword && (
            <div className="absolute left-0 right-0 top-full z-30 mt-3 overflow-hidden rounded-[24px] border border-panel/70 bg-panel p-0 shadow-[0_24px_70px_rgba(7,26,47,0.5)]">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      navigate(result.path);
                      setSearch('');
                    }}
                    className="flex w-full items-center justify-between gap-4 border-b border-panel/70 px-4 py-3 text-left text-sm transition last:border-b-0 hover:bg-panel/80"
                  >
                    <span>
                      <span className="block font-semibold text-slate-100">{result.title}</span>
                      <span className="block text-xs text-slate-500">{result.detail}</span>
                    </span>
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">{result.type}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-4 text-sm text-slate-500">No results found.</div>
              )}
            </div>
          )}
        </form>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications((open) => !open)}
              className="inline-flex items-center gap-2 rounded-2xl border border-panel/70 bg-panel/70 px-4 py-2 text-sm text-slate-200 transition hover:bg-panel/80"
            >
              <Bell className="h-4 w-4" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-2 text-[11px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className={`absolute right-0 z-20 mt-3 ${panelWidth} rounded-[28px] border border-panel/70 bg-panel p-4 shadow-[0_30px_80px_rgba(7,26,47,0.45)]`}>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">Notifications</p>
                    <p className="mt-1 text-xs text-slate-500">Recent updates and messages.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="rounded-full border border-panel/70 bg-panel/70 p-2 text-slate-300 transition hover:bg-panel/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {notifications.length > 0 ? (
                    notificationsToShow.map((note) => (
                      <div
                        key={note.id}
                        className={`rounded-3xl border px-4 py-3 text-sm transition ${note.read ? 'border-panel/70 bg-panel/70 text-slate-300' : 'border-accent bg-panel text-slate-100 shadow-[0_8px_30px_rgba(6,182,212,0.08)]'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-medium leading-6">{note.message}</p>
                          {!note.read && <span className="rounded-full bg-accent px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">New</span>}
                        </div>
                        <p className="mt-2 text-xs text-slate-500">{new Date(note.timestamp).toLocaleString()}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 text-sm text-slate-500">No notifications available.</div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onMarkAllRead?.();
                        }}
                        className="rounded-full bg-panel/70 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-panel/80"
                      >
                        Mark all read
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onClearNotifications) onClearNotifications();
                        }}
                        className="rounded-full border border-panel/70 bg-panel/70 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-panel/80"
                      >
                        Clear all
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAll((open) => !open)}
                      className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
                    >
                      {showAll ? 'Collapse' : 'View all'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="hidden items-center gap-3 rounded-full border border-panel/70 bg-panel/70 px-4 py-2 text-left shadow-[0_16px_40px_rgba(7,26,47,0.18)] transition hover:bg-panel/80 md:flex"
          >
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt={user?.name || 'User'} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <UserCircle2 className="h-6 w-6 text-accent" />
            )}
            <div>
              <p className="text-sm font-semibold text-slate-100">Welcome, {user?.name || 'User'}</p>
              <p className="text-xs text-slate-500">{user?.role ? `Role: ${user.role}` : 'Role: student'}</p>
            </div>
          </button>
          <button className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
