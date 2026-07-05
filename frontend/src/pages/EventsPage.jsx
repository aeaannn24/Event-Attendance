import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock3, MapPin, Megaphone, PencilLine, Plus, Send, Trash2 } from 'lucide-react';

const sampleEvents = [
  { id: '1', title: 'Campus Orientation', location: 'Main Auditorium', date: '2026-06-25', status: 'upcoming' },
  { id: '2', title: 'Science Seminar', location: 'Science Hall', date: '2026-06-27', status: 'upcoming' },
  { id: '3', title: 'Career Fair', location: 'Gymnasium', date: '2026-06-18', status: 'completed' },
];

const splitDuration = (minutes) => {
  const total = Math.max(1, Number(minutes || 15));
  return { hours: Math.floor(total / 60), minutes: total % 60 };
};

const formatDuration = (minutes) => {
  const { hours, minutes: remainingMinutes } = splitDuration(minutes);
  const parts = [];
  if (hours) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (remainingMinutes) parts.push(`${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`);
  return parts.join(' ') || '0 minutes';
};

const EventsPage = ({ user, events: appEvents, attendanceWindow = {}, onSaveEvent, onDeleteEvent, onSaveWindow, onPublishAnnouncement }) => {
  const events = useMemo(() => (Array.isArray(appEvents) ? appEvents : sampleEvents), [appEvents]);
  const [activeEventId, setActiveEventId] = useState(events[0]?.id || null);
  const [editingEventId, setEditingEventId] = useState(events[0]?.id || null);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: events[0]?.title || '',
    location: events[0]?.location || '',
    date: events[0]?.date || new Date().toISOString().slice(0, 10),
    time: events[0]?.time || '09:00',
    durationMinutes: events[0]?.durationMinutes || 15,
    status: events[0]?.status || 'upcoming',
  });
  const [selectedDate, setSelectedDate] = useState(attendanceWindow.date || new Date().toISOString().slice(0, 10));
  const [selectedTime, setSelectedTime] = useState(attendanceWindow.time || '09:00');
  const [durationMinutes, setDurationMinutes] = useState(attendanceWindow.durationMinutes || 15);
  const [announcementMessage, setAnnouncementMessage] = useState(attendanceWindow.announcement || 'Please be punctual for the next session.');
  const [statusMessage, setStatusMessage] = useState('Configure event timing and announcement details for students.');
  const [now, setNow] = useState(() => new Date());

  const activeEvent = events.find((event) => event.id === activeEventId) || events[0] || null;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!activeEvent) {
      setSelectedDate(attendanceWindow.date || new Date().toISOString().slice(0, 10));
      setSelectedTime(attendanceWindow.time || '09:00');
      setDurationMinutes(attendanceWindow.durationMinutes || 15);
      setAnnouncementMessage(attendanceWindow.announcement || 'Please be punctual for the next session.');
      setEventForm({
        title: '',
        location: '',
        date: new Date().toISOString().slice(0, 10),
        status: 'upcoming',
      });
      return;
    }

    setSelectedDate(attendanceWindow.date || activeEvent.date);
    setSelectedTime(attendanceWindow.time || activeEvent.time || '09:00');
    setDurationMinutes(attendanceWindow.durationMinutes || activeEvent.durationMinutes || 15);
    setAnnouncementMessage(attendanceWindow.announcement || 'Please be punctual for the next session.');
    setEventForm({
      title: activeEvent.title || '',
      location: activeEvent.location || '',
      date: activeEvent.date || new Date().toISOString().slice(0, 10),
      time: activeEvent.time || '09:00',
      durationMinutes: activeEvent.durationMinutes || 15,
      status: activeEvent.status || 'upcoming',
    });
  }, [attendanceWindow, activeEvent]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (events.length > 0 && !events.some((event) => event.id === activeEventId)) {
      setActiveEventId(events[0].id);
    }
  }, [activeEventId, events]);

  const handleEventFormChange = (field, value) => {
    setEventForm((current) => ({ ...current, [field]: value }));
  };

  const handleCreateEvent = () => {
    const nextDate = new Date().toISOString().slice(0, 10);
    setEditingEventId(null);
    setEventForm({
      title: '',
      location: '',
      date: nextDate,
      time: '09:00',
      durationMinutes: 15,
      status: 'upcoming',
    });
    setSelectedDate(nextDate);
    setIsEditingEvent(true);
    setStatusMessage('Create a new event with location, date, and status.');
  };

  const handleSaveEventDetails = () => {
    if (!eventForm.title.trim() || !eventForm.location.trim() || !eventForm.date || !eventForm.time) {
      setStatusMessage('Complete the event name, location, date, and time before saving.');
      return;
    }

    if (Number(eventForm.durationMinutes) <= 0) {
      setStatusMessage('Event duration must be at least 1 minute.');
      return;
    }

    const savedEvent = onSaveEvent?.(editingEventId, {
      ...eventForm,
      durationMinutes: Number(eventForm.durationMinutes),
    });
    if (savedEvent?.id) {
      setActiveEventId(savedEvent.id);
    }

    setSelectedDate(eventForm.date);
    setSelectedTime(eventForm.time);
    setDurationMinutes(Number(eventForm.durationMinutes));
    setIsEditingEvent(false);
    setStatusMessage(`Event saved: ${eventForm.title} at ${eventForm.location} (${eventForm.time}).`);
  };

  const handleSaveEventTime = () => {
    if (!selectedDate || !selectedTime) {
      setStatusMessage('Enter both date and time before saving the event window.');
      return;
    }

    onSaveWindow?.({ date: selectedDate, time: selectedTime, durationMinutes, announcement: announcementMessage, activeEventId: activeEvent?.id });
    setStatusMessage(`Event window set for ${selectedDate} at ${selectedTime} for ${formatDuration(durationMinutes)}.`);
  };

  const handleSendAnnouncement = () => {
    if (!announcementMessage.trim()) {
      setStatusMessage('Enter a clear announcement message before sending.');
      return;
    }

    onPublishAnnouncement?.(announcementMessage.trim());
    setStatusMessage('Announcement sent successfully to all students.');
  };

  const handleDurationPartChange = (field, value) => {
    const current = splitDuration(durationMinutes);
    const nextValue = Math.max(0, Number(value || 0));
    const nextHours = field === 'hours' ? nextValue : current.hours;
    const nextMinutes = field === 'minutes' ? Math.min(59, nextValue) : current.minutes;
    setDurationMinutes(Math.max(1, nextHours * 60 + nextMinutes));
  };

  const durationParts = splitDuration(durationMinutes);

  const formatRemaining = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) return '00:00';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const start = new Date(`${selectedDate}T${selectedTime}`);
  const end = Number.isNaN(start.getTime()) ? null : new Date(start.getTime() + Number(durationMinutes || 15) * 60000);
  const opensIn = start && end ? start.getTime() - now.getTime() : 0;
  const remaining = end ? end.getTime() - now.getTime() : 0;
  const isBeforeWindow = Boolean(start && now < start);
  const isWindowOpen = Boolean(start && end && now >= start && now <= end);

  const handleDeleteEvent = (event) => {
    if (!isAdmin || !event) return;

    const confirmed = window.confirm(`Delete "${event.title}"? This will also remove its attendance records.`);
    if (!confirmed) return;

    onDeleteEvent?.(event.id);
    setIsEditingEvent(false);
    setEditingEventId(null);
    setActiveEventId((currentId) => {
      if (currentId !== event.id) return currentId;
      const nextEvent = events.find((item) => item.id !== event.id);
      return nextEvent?.id || null;
    });
    setStatusMessage(`Event deleted: ${event.title}.`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-brand to-panel p-6 shadow-[0_28px_80px_rgba(7,26,47,0.5)] border border-white/8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-accent/80">Event Details</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{activeEvent?.title || 'No event selected'}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Maintain a polished event schedule and broadcast updates directly to students from the AttendancePro admin panel.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2">
                <MapPin className="h-4 w-4 text-accent" />
                {activeEvent?.location || 'No location'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2">
                <CalendarDays className="h-4 w-4 text-accent" />
                {activeEvent?.date || 'No date'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2 text-slate-100">
                Status: {activeEvent?.status || 'none'}
              </span>
            </div>
            {isAdmin && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingEventId(activeEvent?.id || null);
                    setIsEditingEvent((open) => !open);
                  }}
                  disabled={!activeEvent}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-panel"
                >
                  <PencilLine className="h-4 w-4" />
                  Set Location & Event
                </button>
                <button
                  type="button"
                  onClick={handleCreateEvent}
                  className="inline-flex items-center gap-2 rounded-full border border-panel/60 bg-panel/60 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-panel/80"
                >
                  <Plus className="h-4 w-4" />
                  New Event
                </button>
              </div>
            )}
          </div>
          <div className="grid min-w-[220px] gap-3 rounded-3xl bg-panel/60 p-4 text-sm text-slate-200 shadow-lg">
            <div className="rounded-3xl bg-panel/70 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Current Time</p>
              <p className="mt-2 text-lg font-semibold text-white">{selectedDate} · {selectedTime}</p>
              <p className="mt-1 text-xs text-slate-400">Limit: {formatDuration(durationMinutes)}</p>
              <p className="mt-2 text-xs text-slate-400">Deadline: {end ? end.toLocaleString() : 'Invalid deadline'}</p>
              <p className={`mt-3 text-2xl font-semibold ${isWindowOpen ? 'text-emerald-300' : 'text-amber-300'}`}>
                {isWindowOpen ? formatRemaining(remaining) : isBeforeWindow ? `Opens in ${formatRemaining(opensIn)}` : 'Closed'}
              </p>
            </div>
            <div className="rounded-3xl bg-panel/70 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Announcement</p>
              <p className="mt-2 text-sm leading-6 text-slate-300 break-words whitespace-pre-line">{attendanceWindow.announcement || 'No announcement yet.'}</p>
            </div>
          </div>
        </div>
      </div>

      {isEditingEvent && isAdmin && (
        <div className="rounded-3xl border border-accent/20 bg-panel p-6 shadow-[0_28px_60px_rgba(7,26,47,0.35)]">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-accent">Set Location & Event</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Professional event setup</h2>
              <p className="mt-2 text-sm text-slate-400">Update the event name, venue, event date, and status shown across dashboards.</p>
            </div>
            <span className="rounded-full bg-accent/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent/90">
              Admin editable
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-6">
            <label className="block text-sm font-medium text-slate-300 lg:col-span-2">
              Event Name
              <input
                value={eventForm.title}
                onChange={(event) => handleEventFormChange('title', event.target.value)}
                placeholder="e.g. Leadership Seminar"
                className="mt-2 w-full rounded-3xl border border-panel/70 bg-panel/70 px-4 py-3 text-white outline-none transition focus:border-accent"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300 lg:col-span-2">
              Location
              <input
                value={eventForm.location}
                onChange={(event) => handleEventFormChange('location', event.target.value)}
                placeholder="e.g. Main Auditorium"
                className="mt-2 w-full rounded-3xl border border-panel/70 bg-panel/70 px-4 py-3 text-white outline-none transition focus:border-accent"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Event Date
              <input
                type="date"
                value={eventForm.date}
                onChange={(event) => handleEventFormChange('date', event.target.value)}
                className="mt-2 w-full rounded-3xl border border-panel/70 bg-panel/70 px-4 py-3 text-white outline-none transition focus:border-accent"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Time
              <input
                type="time"
                value={eventForm.time}
                onChange={(event) => handleEventFormChange('time', event.target.value)}
                className="mt-2 w-full rounded-3xl border border-panel/70 bg-panel/70 px-4 py-3 text-white outline-none transition focus:border-accent"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Duration (mins)
              <input
                type="number"
                min="1"
                value={eventForm.durationMinutes}
                onChange={(event) => handleEventFormChange('durationMinutes', event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-800/80 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-sky-400"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Status
              <select
                value={eventForm.status}
                onChange={(event) => handleEventFormChange('status', event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-800/80 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-sky-400"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <div className="flex items-end gap-3 lg:col-span-2">
              <button
                type="button"
                onClick={handleSaveEventDetails}
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95"
              >
                Save Event Details
              </button>
              {activeEvent && (
                <button
                  type="button"
                  onClick={() => handleDeleteEvent(activeEvent)}
                  className="inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/15 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/25"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Event
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsEditingEvent(false)}
                className="rounded-full border border-slate-800/80 bg-slate-900/90 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-panel/70 p-6 shadow-[0_28px_60px_rgba(7,26,47,0.35)] border border-white/10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Set Event Time & Date</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Admin-only scheduling</h2>
            </div>
            <span className="rounded-full bg-slate-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
              {isAdmin ? 'Admin Access' : 'Read only'}
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <label className="group flex flex-col gap-3 rounded-3xl border border-slate-800/80 bg-slate-900/90 p-4 transition hover:border-sky-400/50">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-200">
                <CalendarDays className="h-4 w-4 text-sky-300" />
                Date
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                disabled={!isAdmin}
                className="w-full rounded-3xl border border-panel/70 bg-panel/70 px-4 py-3 text-white outline-none transition focus:border-accent"
              />
            </label>
            <label className="group flex flex-col gap-3 rounded-3xl border border-slate-800/80 bg-slate-900/90 p-4 transition hover:border-sky-400/50">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-200">
                <Clock3 className="h-4 w-4 text-sky-300" />
                Time
              </span>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                disabled={!isAdmin}
                className="w-full rounded-3xl border border-panel/70 bg-panel/70 px-4 py-3 text-white outline-none transition focus:border-accent"
              />
            </label>
            <label className="group flex flex-col gap-3 rounded-3xl border border-slate-800/80 bg-slate-900/90 p-4 transition hover:border-sky-400/50">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-200">
                <Clock3 className="h-4 w-4 text-sky-300" />
                Time Limit
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  value={durationParts.hours}
                  onChange={(e) => handleDurationPartChange('hours', e.target.value)}
                  disabled={!isAdmin}
                  className="w-full rounded-3xl border border-panel/70 bg-panel/70 px-4 py-3 text-white outline-none transition focus:border-accent"
                  aria-label="Hours"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={durationParts.minutes}
                  onChange={(e) => handleDurationPartChange('minutes', e.target.value)}
                  disabled={!isAdmin}
                  className="w-full rounded-3xl border border-panel/70 bg-panel/70 px-4 py-3 text-white outline-none transition focus:border-accent"
                  aria-label="Minutes"
                />
              </div>
              <span className="text-xs text-slate-500">{formatDuration(durationMinutes)}</span>
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-slate-400">Set the official event schedule here so students can see the date and time in their dashboard and event details.</p>
            <button
              type="button"
              onClick={handleSaveEventTime}
              disabled={!isAdmin}
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-panel"
            >
              Set Time
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-panel/70 p-6 shadow-[0_28px_60px_rgba(7,26,47,0.35)] border border-white/10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-accent">Send Announcement</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Broadcast a message</h2>
            </div>
            <Megaphone className="h-6 w-6 text-accent" />
          </div>

          <label className="block text-sm font-medium text-slate-300">Announcement message</label>
          <textarea
            value={announcementMessage}
            onChange={(e) => setAnnouncementMessage(e.target.value)}
            disabled={!isAdmin}
            rows={8}
            className="mt-3 w-full resize-none rounded-[28px] border border-panel/70 bg-panel/70 px-4 py-4 text-sm text-white outline-none transition focus:border-accent"
            placeholder="Write your announcement here..."
          />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">The announcement will appear on the student dashboard without text clipping.</p>
            <button
              type="button"
              onClick={handleSendAnnouncement}
              disabled={!isAdmin}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-panel"
            >
              <Send className="h-4 w-4" />
              Send Announcement
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-panel/80 p-6 shadow-[0_24px_50px_rgba(7,26,47,0.35)] border border-white/10 text-slate-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Event announcement</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Latest student notification</h2>
          </div>
          <p className="text-sm text-slate-400">{statusMessage}</p>
        </div>
        <div className="mt-4 rounded-[28px] bg-panel/70 p-5 text-sm leading-7 text-slate-200 break-words whitespace-pre-line">
          {attendanceWindow.announcement || 'No announcement has been published yet. This space is reserved for important student updates.'}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-panel/80 shadow-xl shadow-black/30">
        <table className="min-w-full divide-y divide-panel/60 text-left text-sm">
          <thead className="bg-panel/70 text-slate-300">
            <tr>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-panel/60 bg-panel/70">
            {events.map((event) => (
              <tr key={event.id} className={event.id === activeEventId ? 'bg-panel/80' : ''}>
                <td className="px-6 py-4 font-medium text-slate-100">{event.title}</td>
                <td className="px-6 py-4 text-slate-300">{event.date}</td>
                <td className="px-6 py-4 text-slate-300">{event.location}</td>
                <td className="px-6 py-4 text-slate-200">{event.status}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveEventId(event.id);
                      setIsEditingEvent(false);
                    }}
                    className="rounded-full bg-panel/60 px-4 py-2 text-xs font-medium text-slate-100 transition hover:bg-panel/80"
                  >
                    View
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(event)}
                      className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-200 transition hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  )}
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                  No events yet. Create a new event to start scheduling attendance.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsPage;
