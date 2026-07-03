import { NavLink } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Users, FileText, Settings, LayoutDashboard, UploadCloud } from 'lucide-react';

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
  return (
    <aside className="fixed left-0 top-0 z-20 h-full w-72 border-r border-slate-800/70 bg-slate-950/90 p-6 backdrop-blur-xl shadow-[24px_0_80px_rgba(15,23,42,0.32)]">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100">AttendancePro</h1>
        <p className="mt-2 max-w-[220px] text-sm leading-6 text-slate-400">Professional event attendance dashboard</p>
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
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
