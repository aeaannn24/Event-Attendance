import { useMemo, useState } from 'react';
import { Heart, MessageCircle, Reply, Search, Send, SmilePlus, Trash2, X } from 'lucide-react';

const reactions = [
  { key: 'heart', label: 'Heart', value: '♥' },
  { key: 'like', label: 'Like', value: '👍' },
  { key: 'wow', label: 'Wow', value: '😮' },
  { key: 'sad', label: 'Sad', value: '😢' },
  { key: 'angry', label: 'Angry', value: '😡' },
];

const formatTime = (timestamp) => {
  try {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return '';
  }
};

const formatRelativeTime = (timestamp) => {
  try {
    const now = new Date();
    const msgTime = new Date(timestamp);
    const diffMs = now - msgTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return msgTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
};

const getUserId = (user) => user?.id || user?.email || user?.name || 'current-user';

const defaultAdminContact = {
  id: 'admin-default',
  name: 'OSWD Administration',
  role: 'admin',
  subtitle: 'Admin Office',
};

const ChatWidget = ({ user, students = [], messages = [], onSendMessage, onDeleteMessage, onReactToMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [contactSearch, setContactSearch] = useState('');
  const [replyToId, setReplyToId] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const currentUserId = getUserId(user);
  const currentRole = user?.role === 'admin' ? 'admin' : 'student';

  const contacts = useMemo(() => {
    const mappedStudents = students.map((student) => ({
      id: student.id || student.studentId,
      name: student.name,
      role: 'student',
      subtitle: student.studentId || 'Student',
    }));

    const uniqueContacts = Array.from(
      new Map(
        mappedStudents.map((contact) => [String(contact.id), contact])
      ).values()
    );

    if (currentRole === 'admin') {
      return uniqueContacts;
    }

    return [defaultAdminContact, ...uniqueContacts];
  }, [currentRole, students]);

  const getUnreadCountForContact = (contactId) => {
    return messages.filter(
      (msg) => String(msg.recipientId) === String(currentUserId) && String(msg.senderId) === String(contactId)
    ).length;
  };

  const getLastMessageForContact = (contactId) => {
    return messages.find(
      (msg) =>
        (String(msg.senderId) === String(currentUserId) && String(msg.recipientId) === String(contactId)) ||
        (String(msg.senderId) === String(contactId) && String(msg.recipientId) === String(currentUserId))
    );
  };

  const selectedContact = useMemo(
    () => contacts.find((contact) => String(contact.id) === String(selectedContactId)) || contacts[0] || defaultAdminContact,
    [contacts, selectedContactId]
  );

  const filteredContacts = contacts.filter((contact) =>
    [contact.name, contact.subtitle, contact.role].some((value) => String(value || '').toLowerCase().includes(contactSearch.trim().toLowerCase()))
  );

  const visibleMessages = useMemo(() => {
    const contactId = selectedContact?.id;
    return messages
      .filter((message) => {
        if (message.senderId && message.recipientId) {
          return (
            (String(message.senderId) === String(currentUserId) && String(message.recipientId) === String(contactId)) ||
            (String(message.senderId) === String(contactId) && String(message.recipientId) === String(currentUserId))
          );
        }

        return message.senderRole === currentRole || message.recipientRole === currentRole;
      })
      .slice()
      .reverse();
  }, [currentRole, currentUserId, messages, selectedContact]);

  const replyMessage = messages.find((message) => String(message.id) === String(replyToId));
  const unreadCount = messages.filter((message) => String(message.recipientId) === String(currentUserId) || message.recipientRole === currentRole).length;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!draft.trim() || !selectedContact) return;
    onSendMessage?.({ text: draft, recipient: selectedContact, replyToId });
    setDraft('');
    setReplyToId(null);
    setIsOpen(true);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <section className="w-[min(calc(100vw-2rem),460px)] overflow-hidden rounded-[28px] border border-panel/70 bg-panel p-0 shadow-[0_24px_80px_rgba(7,26,47,0.55)]">
          <div className="flex items-center justify-between gap-3 border-b border-panel/70 bg-panel/70 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-100">{selectedContact?.name || 'Select contact'}</p>
              <p className="text-xs text-slate-500">{selectedContact?.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-panel/70 bg-panel/70 text-slate-300 transition hover:text-white hover:bg-panel/80"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid max-h-[34rem] grid-cols-[135px_1fr]">
            <aside className="border-r border-panel/70 bg-panel/60 p-3">
              <div className="flex items-center gap-2 rounded-full border border-panel/70 bg-panel/60 px-3 py-2">
                <Search className="h-3.5 w-3.5 text-slate-500" />
                <input
                  value={contactSearch}
                  onChange={(event) => setContactSearch(event.target.value)}
                  placeholder="Search"
                  className="min-w-0 flex-1 bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-500"
                />
              </div>
              <div className="mt-3 max-h-[27rem] space-y-1 overflow-y-auto">
                {filteredContacts.map((contact) => {
                  const lastMsg = getLastMessageForContact(contact.id);
                  const unreadCount = getUnreadCountForContact(contact.id);
                  const isSelected = String(selectedContact?.id) === String(contact.id);

                  return (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => setSelectedContactId(contact.id)}
                      className={`w-full rounded-2xl px-3 py-2 text-left transition ${
                        isSelected
                          ? 'bg-accent/15 border border-accent/40 text-accent'
                          : 'bg-panel/60 hover:bg-panel/80 border border-panel/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-slate-100">{contact.name}</span>
                          <span className="block truncate text-[11px] text-slate-500">{contact.subtitle}</span>
                          {lastMsg && (
                            <span className="block truncate text-[10px] text-slate-400 mt-1">
                              {lastMsg.text.length > 30 ? lastMsg.text.substring(0, 30) + '...' : lastMsg.text}
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <span className="min-w-5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white flex-shrink-0">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
                {filteredContacts.length === 0 && <p className="px-2 py-3 text-xs text-slate-500">No contacts.</p>}
              </div>
            </aside>

            <div className="flex min-h-[30rem] flex-col">
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                {visibleMessages.map((message) => {
                  const isMine = String(message.senderId) === String(currentUserId) || (!message.senderId && message.senderRole === currentRole);
                  const parent = messages.find((item) => String(item.id) === String(message.replyToId));
                  const reactionValues = Object.values(message.reactions || {}).filter(Boolean);

                  return (
                    <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[92%] rounded-3xl px-4 py-3 text-sm ${isMine ? 'bg-accent text-white' : 'bg-panel text-slate-200'}`}>
                        <div className="mb-1 flex items-center justify-between gap-3 text-[11px] opacity-80">
                          <span>{isMine ? 'You' : message.senderName}</span>
                          <span title={formatTime(message.timestamp)}>{formatRelativeTime(message.timestamp)}</span>
                        </div>
                        {parent && (
                          <div className="mb-2 rounded-2xl bg-panel/80 px-3 py-2 text-xs opacity-90">
                            Reply to {parent.senderName}: {parent.text}
                          </div>
                        )}
                        <p className="break-words leading-5">{message.text}</p>
                        {reactionValues.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {reactionValues.map((reaction, index) => (
                              <span key={`${message.id}-${reaction}-${index}`} className="rounded-full bg-panel/60 px-2 py-0.5 text-xs">{reaction}</span>
                            ))}
                          </div>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-1">
                          <button type="button" onClick={() => setReplyToId(message.id)} className="rounded-full bg-panel/70 px-2 py-1 text-[11px] font-semibold">
                            <Reply className="mr-1 inline h-3 w-3" />
                            Reply
                          </button>
                          {reactions.map((reaction) => (
                            <button
                              key={reaction.key}
                              type="button"
                              title={reaction.label}
                              onClick={() => onReactToMessage?.(message.id, reaction.value)}
                              className="rounded-full bg-panel/70 px-2 py-1 text-xs"
                            >
                              {reaction.value}
                            </button>
                          ))}
                          {(isMine || currentRole === 'admin') && (
                            <button type="button" onClick={() => onDeleteMessage?.(message.id)} className="rounded-full bg-panel/70 px-2 py-1 text-[11px] font-semibold">
                              <Trash2 className="mr-1 inline h-3 w-3" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {visibleMessages.length === 0 && (
                  <div className="rounded-3xl border border-panel/70 bg-panel/70 p-4 text-sm text-slate-400">
                    No messages yet.
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="border-t border-panel/70 bg-panel/80 p-3">
                {replyMessage && (
                  <div className="mb-2 flex items-center justify-between gap-2 rounded-2xl bg-panel/70 px-3 py-2 text-xs text-slate-300">
                    <span className="truncate">Replying to {replyMessage.senderName}: {replyMessage.text}</span>
                    <button type="button" onClick={() => setReplyToId(null)} className="text-slate-500 hover:text-white">Cancel</button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={`Message ${selectedContact?.name || 'contact'}`}
                    className="min-w-0 flex-1 rounded-full border border-panel/70 bg-panel/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-accent"
                  />
                  <button type="submit" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white transition hover:brightness-95" aria-label="Send message">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_18px_45px_rgba(6,182,212,0.36)] transition hover:brightness-95"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && <span className="absolute -right-1 -top-1 min-w-6 rounded-full bg-accent px-1.5 py-0.5 text-xs font-bold text-white">{unreadCount}</span>}
      </button>
    </div>
  );
};

export default ChatWidget;
