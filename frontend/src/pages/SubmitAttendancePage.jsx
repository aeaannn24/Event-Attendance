import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Clock3, Timer, UploadCloud } from 'lucide-react';

const fallbackEvents = [
  { id: 'seminar', title: 'Seminar' },
  { id: 'workshop', title: 'Workshop' },
  { id: 'orientation', title: 'Campus Orientation' },
  { id: 'career-fair', title: 'Career Fair' },
];

const formatDateTime = (date) =>
  date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const formatRemaining = (milliseconds) => {
  if (milliseconds <= 0) return '00:00';
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const getWindowTimes = (date, time, durationMinutes) => {
  const start = new Date(`${date}T${time}`);
  if (Number.isNaN(start.getTime())) return { start: null, end: null };
  const end = new Date(start.getTime() + Number(durationMinutes || 15) * 60000);
  return { start, end };
};

const SubmitAttendancePage = ({ user, events = [], attendanceRecords = [], attendanceWindow = {}, onSaveWindow, onPublishAnnouncement, onSubmitAttendance }) => {
  const isAdmin = user?.role === 'admin';
  const eventOptions = useMemo(() => events.filter((event) => event.status !== 'upcoming'), [events]);
  const ongoingEvents = useMemo(() => eventOptions.filter((event) => event.status === 'ongoing'), [eventOptions]);
  const [selectedEvent, setSelectedEvent] = useState(ongoingEvents[0]?.title || eventOptions[0]?.title || '');
  const [windowDate, setWindowDate] = useState(attendanceWindow.date || new Date().toISOString().slice(0, 10));
  const [windowTime, setWindowTime] = useState(attendanceWindow.time || '09:00');
  const [durationMinutes, setDurationMinutes] = useState(attendanceWindow.durationMinutes || 15);
  const [announcementText, setAnnouncementText] = useState(attendanceWindow.announcement || 'Attendance window is open.');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Upload your photo proof and submit attendance.');
  const [showSubmissionConfirmation, setShowSubmissionConfirmation] = useState(false);
  const [savedAnnouncement, setSavedAnnouncement] = useState(attendanceWindow.announcement || 'Attendance window is open.');
  const [now, setNow] = useState(() => new Date());
  const fileInputRef = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setSelectedEvent((current) => {
      // If the attendanceWindow includes an activeEventId, prefer that event
      if (attendanceWindow?.activeEventId) {
        const active = events.find((e) => e.id === attendanceWindow.activeEventId);
        if (active) return active.title;
      }
      if (eventOptions.some((event) => event.title === current)) return current;
      if (ongoingEvents.length > 0) return ongoingEvents[0].title;
      return eventOptions[0]?.title || '';
    });
    if (eventOptions.length === 0) {
      setStatusMessage('No ongoing attendance sessions are available. Please wait for an active event.');
    }
  }, [eventOptions, ongoingEvents, attendanceWindow, events]);

  useEffect(() => {
    setWindowDate(attendanceWindow.date || new Date().toISOString().slice(0, 10));
    setWindowTime(attendanceWindow.time || '09:00');
    setDurationMinutes(attendanceWindow.durationMinutes || 15);
    setAnnouncementText(attendanceWindow.announcement || 'Attendance window is open.');
    setSavedAnnouncement(attendanceWindow.announcement || 'Attendance window is open.');
  }, [attendanceWindow]);

  const { start, end } = getWindowTimes(windowDate, windowTime, durationMinutes);
  const currentStudentId = user?.studentId || user?.id || 'S0000';
  const alreadySubmitted = attendanceRecords.some(
    (record) => record.studentId === currentStudentId && record.eventName === selectedEvent
  );
  const submittedRecord = attendanceRecords.find((record) => record.studentId === currentStudentId && record.eventName === selectedEvent);
  const studentSubmittedRecords = attendanceRecords.filter((record) => record.studentId === currentStudentId);
  const selectedEventObject = events.find((event) => event.title === selectedEvent);
  const hasAvailableEvents = eventOptions.length > 0;
  const isSelectedEventOngoing = selectedEventObject?.status === 'ongoing';
  const isSelectedEventFinished = selectedEventObject?.status === 'completed';
  const isCurrentEventClosed = Boolean(end && now > end);
  const opensIn = start ? start.getTime() - now.getTime() : 0;
  const remaining = end ? end.getTime() - now.getTime() : 0;
  const isBeforeWindow = Boolean(start && now < start);
  const isWindowOpen = Boolean(start && end && now >= start && now <= end);
  const windowStatus = isWindowOpen ? 'Open' : isBeforeWindow ? 'Not open yet' : 'Closed';
  const eventDisplayStatus = isCurrentEventClosed || isSelectedEventFinished ? 'Completed' : selectedEventObject?.status === 'ongoing' ? 'Ongoing' : selectedEventObject?.status || 'Unknown';
  const eventSubmissionState = alreadySubmitted ? 'Submitted' : isCurrentEventClosed ? 'Incomplete' : 'Pending';

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoPreview(null);
      setPhotoUploaded(false);
      setStatusMessage('Photo upload canceled. Please select an image.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setStatusMessage('Please upload a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setPhotoUploaded(true);
      setStatusMessage('Photo uploaded successfully. Ready to submit.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveWindow = () => {
    if (!windowDate || !windowTime || Number(durationMinutes) < 1) {
      setStatusMessage('Please set a valid date, time, and time limit before saving.');
      return;
    }

    onSaveWindow?.({ date: windowDate, time: windowTime, durationMinutes, announcement: announcementText });
    setSavedAnnouncement(announcementText);
    setStatusMessage(`Attendance window saved for ${windowDate} at ${windowTime} with a ${durationMinutes}-minute limit.`);
  };

  const handlePublishAnnouncement = () => {
    if (!announcementText.trim()) {
      setStatusMessage('Please enter an announcement message first.');
      return;
    }

    onPublishAnnouncement?.(announcementText.trim());
    setSavedAnnouncement(announcementText.trim());
    setStatusMessage('Announcement has been published to students.');
  };

  const handleSubmit = () => {
    if (!hasAvailableEvents) {
      setStatusMessage('No attendance events are available yet. Please contact the administrator.');
      return;
    }

    if (!selectedEvent) {
      setStatusMessage('Select an event before submitting attendance.');
      return;
    }

    if (!isSelectedEventOngoing) {
      setStatusMessage(
        isSelectedEventFinished
          ? 'Attendance submission is closed for finished events. Please choose an ongoing event when available.'
          : 'Attendance is only open for ongoing events. Please select an event with status Ongoing.'
      );
      return;
    }

    if (alreadySubmitted) {
      setStatusMessage(`You already submitted for ${selectedEvent}. You can submit once per event.`);
      return;
    }

    if (!isWindowOpen) {
      setStatusMessage(isBeforeWindow ? 'Attendance is not open yet.' : 'Attendance window is closed. Submission is no longer allowed.');
      return;
    }

    if (!photoUploaded) {
      setStatusMessage('Please upload a photo before submitting.');
      return;
    }

    const submittedAt = new Date();
    const record = {
      id: `record-${Date.now()}`,
      studentId: currentStudentId,
      studentName: user?.name || 'Current Student',
      gender: user?.gender || 'male',
      course: user?.course || 'Bachelor of Science in Information Technology',
      yearLevel: user?.yearLevel || '3',
      eventName: selectedEvent,
      eventDate: selectedEventObject?.date ? new Date(selectedEventObject.date).toISOString().slice(0, 10) : submittedAt.toISOString().slice(0, 10),
      submissionDate: submittedAt.toISOString().slice(0, 10),
      submissionTime: submittedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      status: 'Present',
      photoUrl: photoPreview,
    };

    const saved = onSubmitAttendance?.(record);
    if (saved === false) {
      setStatusMessage(`Already submitted for ${selectedEvent}. Please wait for another event to submit attendance.`);
      return;
    }

    setStatusMessage(`Attendance submitted for ${selectedEvent}.`);
    setShowSubmissionConfirmation(true);
  };

  return (
    <div className="rounded-[32px] border border-panel/70 bg-panel/70 p-6 shadow-[0_40px_90px_rgba(7,26,47,0.32)] glass-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Submit Attendance</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-100">Attendance Submission</h1>
        </div>
        <div className={`rounded-3xl px-4 py-2 text-sm font-semibold ${isWindowOpen ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
          {windowStatus}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
            <div className="rounded-[28px] border border-panel/70 bg-panel/70 p-5">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block text-sm font-semibold text-slate-100">
                <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-accent" /> Date</span>
                <input
                  type="date"
                  value={windowDate}
                  onChange={(event) => setWindowDate(event.target.value)}
                    className="mt-3 w-full rounded-[24px] border border-panel/70 bg-panel/70 px-4 py-3 text-slate-100 outline-none"
                  disabled={!isAdmin}
                />
              </label>
              <label className="block text-sm font-semibold text-slate-100">
                <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-accent" /> Time</span>
                <input
                  type="time"
                  value={windowTime}
                  onChange={(event) => setWindowTime(event.target.value)}
                  className="mt-3 w-full rounded-[24px] border border-panel/70 bg-panel/70 px-4 py-3 text-slate-100 outline-none"
                  disabled={!isAdmin}
                />
              </label>
              <label className="block text-sm font-semibold text-slate-100">
                <span className="inline-flex items-center gap-2"><Timer className="h-4 w-4 text-accent" /> Limit</span>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={durationMinutes}
                  onChange={(event) => setDurationMinutes(event.target.value)}
                  className="mt-3 w-full rounded-[24px] border border-panel/70 bg-panel/70 px-4 py-3 text-slate-100 outline-none"
                  disabled={!isAdmin}
                />
              </label>
            </div>

              <div className="mt-5 rounded-[24px] border border-panel/70 bg-panel/70 px-4 py-4 text-slate-100">
              <p className="text-sm text-slate-400">Attendance window</p>
              <p className="mt-2 text-lg font-semibold text-slate-100">{start ? formatDateTime(start) : 'Invalid start time'}</p>
              <p className="mt-1 text-sm text-slate-500">Deadline: {end ? formatDateTime(end) : 'Invalid deadline'}</p>
              <p className={`mt-3 text-2xl font-semibold ${isWindowOpen ? 'text-emerald-300' : 'text-amber-300'}`}>
                {isWindowOpen ? formatRemaining(remaining) : isBeforeWindow ? `Opens in ${formatRemaining(opensIn)}` : 'Closed'}
              </p>
              {selectedEventObject && (
                  <div className="mt-4 rounded-2xl border border-panel/60 bg-panel/70 p-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Event status</p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">{selectedEventObject.title}</p>
                  <p className="mt-1 text-xs text-slate-400">Status: {selectedEventObject.status}</p>
                  {!isSelectedEventOngoing && <p className="mt-2 text-sm text-amber-300">Attendance submission is only active for ongoing events.</p>}
                </div>
              )}
              {alreadySubmitted && submittedRecord && (
                  <div className="mt-4 rounded-2xl border border-panel/60 bg-panel/70 p-3">
                  <p className="text-xs text-slate-400">You already submitted for this event</p>
                  <p className="mt-1 text-sm font-semibold text-slate-100">Submitted: {submittedRecord.submissionDate} · {submittedRecord.submissionTime}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <img src={submittedRecord.photoUrl} alt="submitted proof" className="h-12 w-12 rounded-lg object-cover" />
                    <span className="text-sm text-slate-300">Photo proof attached</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap gap-3 rounded-[28px] border border-panel/70 bg-panel/70 p-5 text-sm text-slate-300">
              <button type="button" onClick={handleSaveWindow} className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95">
                Save Window
              </button>
              <button type="button" onClick={handlePublishAnnouncement} className="rounded-full border border-panel/70 bg-panel/70 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-panel/80">
                Publish Announcement
              </button>
              <p className="flex-1 text-sm text-slate-500">Admin controls define when students can submit attendance.</p>
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="rounded-[28px] border border-slate-800/70 bg-slate-900/80 p-5">
            <h3 className="text-sm font-semibold text-slate-100">Your Submissions</h3>
            <p className="mt-1 text-xs text-slate-500">Recent attendance submissions (one per event).</p>
            <div className="mt-4 space-y-3">
              {studentSubmittedRecords.length === 0 && <p className="text-sm text-slate-400">You haven't submitted any attendance yet.</p>}
              {studentSubmittedRecords.map((rec) => (
                <div key={rec.id} className="flex items-center justify-between rounded-2xl border border-slate-800/60 bg-slate-950/80 p-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{rec.eventName}</p>
                    <p className="text-xs text-slate-400">{rec.submissionDate} · {rec.submissionTime}</p>
                  </div>
                  <img src={rec.photoUrl} alt="proof" className="h-12 w-12 rounded-lg object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-800/70 bg-slate-900/80 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="block text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Select Event</label>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                style={{ backgroundColor: alreadySubmitted ? '#16a34a' : isCurrentEventClosed ? '#b45309' : '#0ea5e9' }}>
                {alreadySubmitted ? 'Submitted' : isCurrentEventClosed ? 'Incomplete' : eventDisplayStatus}
              </div>
            </div>
            <select
              value={selectedEvent}
              onChange={(event) => {
                const nextEvent = event.target.value;
                setSelectedEvent(nextEvent);
                const hasRecord = attendanceRecords.some(
                  (record) => record.studentId === currentStudentId && record.eventName === nextEvent
                );
                setStatusMessage(
                  hasRecord
                    ? `Already submitted for ${nextEvent}. Please wait for another event to submit attendance.`
                    : 'Upload your photo proof and submit attendance.'
                );
              }}
              className="mt-4 w-full rounded-[24px] border border-slate-800/70 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none"
              disabled={isAdmin}
            >
              {!hasAvailableEvents && <option value="">No ongoing events available</option>}
              {eventOptions.map((event) => (
                <option key={event.id || event.title} value={event.title}>{event.title}</option>
              ))}
            </select>
          </div>

          <div className="rounded-[28px] border border-slate-800/70 bg-slate-900/80 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-100">Announcement</p>
                <p className="mt-1 text-xs text-slate-500">Students see this message while submitting attendance.</p>
              </div>
              <div className={`rounded-full px-3 py-2 text-xs font-semibold ${savedAnnouncement ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-700/70 text-slate-300'}`}>
                {savedAnnouncement ? 'Active' : 'No announcement'}
              </div>
            </div>
            <textarea
              value={announcementText}
              onChange={(event) => setAnnouncementText(event.target.value)}
              rows={4}
              className="mt-4 w-full rounded-[24px] border border-slate-800/70 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none"
              placeholder="Write an announcement for students..."
              disabled={!isAdmin}
            />
            {!isAdmin && <p className="mt-3 text-sm text-slate-300">{savedAnnouncement || 'No current announcement.'}</p>}
          </div>

          {!isAdmin && (
            <div className="rounded-[28px] border border-slate-800/70 bg-slate-950/95 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Proof Photo</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {alreadySubmitted ? 'This event already has your attendance record.' : 'Upload a photo to complete your attendance submission.'}
                  </p>
                </div>
                <div className={`rounded-full px-3 py-2 text-xs font-semibold ${alreadySubmitted ? 'bg-accent/15 text-accent' : photoUploaded ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-700/70 text-slate-300'}`}>
                  {alreadySubmitted ? 'Submitted' : photoUploaded ? 'Ready' : 'Pending'}
                </div>
              </div>
              <div className="mt-5 overflow-hidden rounded-[24px] bg-slate-950/90">
                <img
                  src={photoPreview || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80'}
                  alt="Photo preview"
                  className="h-56 w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={alreadySubmitted}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-800/70 bg-slate-900/90 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-800/50 disabled:text-slate-500"
              >
                <UploadCloud className="h-4 w-4 text-accent" />
                Upload Photo
              </button>
              {!selectedEvent && (
                <p className="mt-3 text-xs text-amber-300">Please select an ongoing event before uploading proof.</p>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </div>
          )}

          {!isAdmin && (
            <div className="flex flex-col gap-3 rounded-[28px] border border-slate-800/70 bg-slate-950/95 p-5 text-sm text-slate-300">
              <p>
                {alreadySubmitted
                  ? `Already submitted for ${selectedEvent}. Please wait for another event to submit attendance.`
                  : statusMessage}
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isWindowOpen || alreadySubmitted || !hasAvailableEvents || !selectedEvent || !isSelectedEventOngoing}
                className="mt-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-slate-700"
              >
                {alreadySubmitted
                  ? 'Already Submitted'
                  : isCurrentEventClosed
                  ? 'Closed — Incomplete'
                  : isSelectedEventOngoing
                  ? 'Submit Attendance'
                  : 'Select Ongoing Event'}
              </button>
            </div>
          )}

          {showSubmissionConfirmation && !isAdmin && (
            <div className="rounded-[28px] border border-emerald-500/20 bg-emerald-500/5 p-5 text-slate-100">
              <h2 className="text-lg font-semibold text-emerald-300">Submission recorded</h2>
              <p className="mt-2 text-sm text-slate-400">Your attendance was submitted with photo proof and saved to the attendance records.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SubmitAttendancePage;
