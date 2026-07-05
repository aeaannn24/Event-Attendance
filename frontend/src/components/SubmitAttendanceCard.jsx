import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, UploadCloud } from 'lucide-react';

const availableEvents = ['Seminar', 'Workshop', 'Campus Orientation', 'Career Fair'];
const presetTimes = [2, 5, 10];

const SubmitAttendanceCard = () => {
  const [selectedEvent, setSelectedEvent] = useState(availableEvents[0]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoVerified, setPhotoVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(150);
  const [statusMessage, setStatusMessage] = useState('Attach a clear photo and submit attendance.');
  const [showTimeSettings, setShowTimeSettings] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('3');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formattedTime = useMemo(() => {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [timeLeft]);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoPreview(null);
      setPhotoVerified(false);
      setStatusMessage('Photo upload cancelled.');
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    setPhotoPreview(fileUrl);
    setPhotoVerified(true);
    setStatusMessage('Photo uploaded successfully. Ready to submit.');
  };

  const handleSubmit = () => {
    if (!photoVerified) {
      setStatusMessage('Please attach a photo to verify your attendance.');
      return;
    }

    setStatusMessage('Attendance submitted successfully. Thank you!');
  };

  const handleSetTime = (minutes) => {
    setTimeLeft(minutes * 60);
    setShowTimeSettings(false);
    setStatusMessage(`Attendance window set to ${minutes} minutes.`);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="rounded-[32px] border border-panel/70 bg-panel/70 p-6 shadow-[0_40px_90px_rgba(7,26,47,0.32)] glass-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Submit Attendance</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">Quick check-in</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-400">Premium quick attendance submission with a sleek timer and photo proof panel.</p>
        </div>
        <div className="rounded-3xl bg-accent/10 px-4 py-3 text-sm font-semibold text-accent shadow-[0_12px_30px_rgba(6,182,212,0.12)]">
          {timeLeft > 0 ? 'Time is running out' : 'Window closed'}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[28px] border border-panel/70 bg-panel/70 p-5">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Countdown</p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-5xl font-semibold tracking-tighter text-slate-100">{formattedTime}</p>
              <p className="mt-2 text-sm text-slate-400">Submit by the timer to keep the session active.</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent shadow-[0_16px_40px_rgba(6,182,212,0.12)]">
              <span className="text-xl font-semibold">{Math.ceil(timeLeft / 60)}m</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowTimeSettings(!showTimeSettings)}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-panel/70 bg-panel/70 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-panel/80"
          >
            <AlertTriangle className="h-4 w-4 text-accent" />
            Set Time
          </button>

          {showTimeSettings && (
            <div className="mt-5 rounded-[24px] border border-panel/70 bg-panel/70 p-4 shadow-[0_20px_40px_rgba(7,26,47,0.16)]">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Preset duration</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {presetTimes.map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    onClick={() => handleSetTime(minutes)}
                    className="rounded-full border border-panel/70 bg-panel/70 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-accent hover:text-accent"
                  >
                    {minutes} min
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="w-24 rounded-2xl border border-panel/70 bg-panel/70 px-3 py-2 text-sm text-slate-100 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSetTime(Number(customMinutes) || 1)}
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-panel/70 bg-panel/70 p-5">
          <label className="block text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Attendance for</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="mt-4 w-full rounded-[24px] border border-panel/70 bg-panel/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-accent"
          >
            {availableEvents.map((eventName) => (
              <option key={eventName} value={eventName} className="bg-panel/70 text-slate-100">
                {eventName}
              </option>
            ))}
          </select>

          <div className="mt-6 rounded-[28px] border border-panel/70 bg-panel/70 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-100">Attach Photo</p>
                <p className="mt-1 text-xs text-slate-500">Proof verification</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-panel/70 px-3 py-2 text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                {photoVerified ? 'Verified' : 'Pending'}
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-[24px] bg-panel/80 shadow-[0_24px_60px_rgba(7,26,47,0.18)]">
              <img
                src={photoPreview || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'}
                alt="Attendance preview"
                className="h-56 w-full object-cover"
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                onClick={handleUploadClick}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-panel/70 bg-panel/70 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-panel/80"
              >
                <UploadCloud className="h-4 w-4 text-accent" />
                Upload Photo
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95"
              >
                Submit Attendance
              </button>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />

      {statusMessage && (
        <p className="mt-6 rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300 shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default SubmitAttendanceCard;
