import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Users, FileText, Settings, LayoutDashboard, UploadCloud, Menu, X } from 'lucide-react';

const adminMenuItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Events', path: '/events', icon: CalendarDays },
  { label: 'Attendance', path: '/attendance', icon: CheckCircle2 },
  { label: 'Students', path: '/students', icon: Users },
  { label: 'Reports', path: '/reports', icon: FileText },
  { label: 'Settings', path: '/settings', icon: Settings },
];

const studentMenuItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Events', path: '/events', icon: CalendarDays },
  { label: 'Attendance', path: '/attendance', icon: CheckCircle2 },
  { label: 'Submit Attendance', path: '/submit-attendance', icon: UploadCloud },
  { label: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ user }) => {
  const menuItems = user?.role === 'admin' ? adminMenuItems : studentMenuItems;
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Default: open on large screens, collapsed on small screens
    const isLarge = typeof window !== 'undefined' && window.innerWidth >= 1024;
    setOpen(isLarge);
    const handleResize = () => setOpen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Floating tab button (visible on small screens) */}
      {!open && (
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="fixed left-0 top-1/2 z-30 -translate-y-1/2 rounded-r-xl bg-slate-900/80 p-2 text-white shadow-lg lg:hidden"
          style={{ transform: 'translateY(-50%)' }}
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      <aside
        className={`fixed left-0 top-0 z-20 h-full w-72 border-r border-slate-800/70 bg-slate-950/90 p-6 backdrop-blur-xl shadow-[24px_0_80px_rgba(15,23,42,0.32)] transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-100">AttendancePro</h1>
            <p className="mt-2 max-w-[220px] text-sm leading-6 text-slate-400">Professional event attendance dashboard</p>
          </div>
          {/* Close button for small screens */}
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="ml-4 rounded-full bg-slate-800/60 p-2 text-slate-200 hover:bg-slate-800 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition duration-200 ${
                    isActive ? 'bg-slate-800 text-sky-200 shadow-[0_20px_40px_rgba(14,165,233,0.16)]' : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-100'
                  }`
                }
                onClick={() => {
                  // Close sidebar on navigation when on small screens
                  if (window.innerWidth < 1024) setOpen(false);
                }}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
