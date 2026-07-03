import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import ChatWidget from '../components/ChatWidget';

const Layout = ({
  user,
  onLogout,
  notifications,
  clearNotifications,
  onMarkAllRead,
  chatMessages,
  students,
  events,
  attendanceRecords,
  onSendChatMessage,
  onDeleteChatMessage,
  onReactToChatMessage,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar user={user} />
      <div className="md:pl-72">
        <Topbar
          user={user}
          onLogout={onLogout}
          notifications={notifications}
          onClearNotifications={clearNotifications}
          onMarkAllRead={onMarkAllRead}
          events={events}
          students={students}
          attendanceRecords={attendanceRecords}
        />
        <main className="mx-auto max-w-7xl px-4 pb-12 pt-6 md:px-8">
          <Outlet />
        </main>
      </div>
      <ChatWidget
        user={user}
        students={students}
        messages={chatMessages}
        onSendMessage={onSendChatMessage}
        onDeleteMessage={onDeleteChatMessage}
        onReactToMessage={onReactToChatMessage}
      />
    </div>
  );
};

export default Layout;
