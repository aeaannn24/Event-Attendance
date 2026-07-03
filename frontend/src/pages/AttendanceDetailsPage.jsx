import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';

const AttendanceDetailsPage = ({ attendanceRecords = [], events = [] }) => {
  const { id } = useParams();
  const [photoSize, setPhotoSize] = useState(72);
  const record = useMemo(() => attendanceRecords.find((item) => String(item.id) === String(id)), [attendanceRecords, id]);
  const event = events.find((item) => item.title === record?.eventName);

  if (!record) {
    return (
      <div className="rounded-[32px] border border-slate-800/70 bg-slate-950/90 p-8 text-slate-100">
        <h1 className="text-2xl font-semibold">Record not found</h1>
        <p className="mt-2 text-sm text-slate-400">The attendance record may have been deleted or is no longer available.</p>
        <Link to="/attendance" className="mt-6 inline-flex rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white">
          Back to Attendance
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.28)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link to="/attendance" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200">
              <ArrowLeft className="h-4 w-4" />
              Back to records
            </Link>
            <h1 className="mt-4 text-3xl font-semibold text-slate-100">Attendance Details</h1>
            <p className="mt-2 text-sm text-slate-400">Full student check-in record with photo proof and event metadata.</p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            <Printer className="h-4 w-4" />
            Print Record
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[32px] border border-slate-800/70 bg-slate-950/90 p-6">
          <h2 className="text-lg font-semibold text-slate-100">Student Information</h2>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            <Detail label="Student ID" value={record.studentId} />
            <Detail label="Name" value={record.studentName} />
            <Detail label="Gender" value={record.gender || 'male'} valueClass="capitalize text-slate-100" />
            <Detail label="Course" value={record.course} />
            <Detail label="Year Level" value={`Year ${record.yearLevel}`} />
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-800/70 bg-slate-950/90 p-6">
          <h2 className="text-lg font-semibold text-slate-100">Event Information</h2>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            <Detail label="Event" value={record.eventName} />
            <Detail label="Location" value={event?.location || 'Not specified'} />
            <Detail label="Event Date" value={event?.date || record.submissionDate} />
            <Detail label="Status" value={record.status} valueClass={record.status === 'Present' ? 'text-emerald-300' : 'text-amber-300'} />
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[32px] border border-slate-800/70 bg-slate-950/90 p-6">
          <h2 className="text-lg font-semibold text-slate-100">Check-in Summary</h2>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            <Detail label="Submitted Date" value={record.submissionDate || '—'} />
            <Detail label="Submitted Time" value={record.submissionTime || '—'} />
            <Detail label="Verification" value={record.photoUrl ? 'Photo proof attached' : 'No photo attached'} />
          </div>
          <div className="mt-6 rounded-3xl border border-slate-800/70 bg-slate-900/80 p-4 text-sm leading-6 text-slate-400">
            This details view uses the selected attendance record, so every student row opens its own photo and attendance data.
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-800/70 bg-slate-950/90 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Attendance Photo</h2>
              <p className="mt-1 text-sm text-slate-500">Use the slider to adjust the proof photo size.</p>
            </div>
            <label className="text-sm font-semibold text-slate-300">
              Size: {photoSize}%
              <input
                type="range"
                min="35"
                max="100"
                value={photoSize}
                onChange={(event) => setPhotoSize(event.target.value)}
                className="mt-2 block w-56 accent-sky-400"
              />
            </label>
          </div>
          <div className="mt-6 overflow-auto rounded-[28px] border border-slate-800/70 bg-slate-900/80 p-4">
            <img
              src={record.photoUrl}
              alt={`${record.studentName} attendance proof`}
              style={{ width: `${photoSize}%` }}
              className="mx-auto max-h-[640px] min-w-[220px] rounded-[24px] object-contain shadow-2xl shadow-slate-950/40"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const Detail = ({ label, value, valueClass = 'text-slate-100' }) => (
  <div className="flex flex-col gap-1 rounded-3xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
    <span className="text-slate-500">{label}</span>
    <span className={`font-semibold ${valueClass}`}>{value}</span>
  </div>
);

export default AttendanceDetailsPage;
