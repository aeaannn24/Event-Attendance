import { useMemo, useState } from 'react';
import { Plus, Search, Trash2, UserPlus } from 'lucide-react';

const courseOptions = [
  'Bachelor of Science in Information Technology',
  'Bachelor of Science in Hospitality Management',
  'Bachelor of Science in Industrial Technology (Electrical)',
  'Bachelor of Science in Industrial Technology (Automotive)',
  'Bachelor of Science in Industrial Technology (Culinary)',
  'Bachelor of Science in Industrial Technology (Computer Science)',
];

const emptyForm = {
  studentId: '',
  name: '',
  gender: 'male',
  course: courseOptions[0],
  yearLevel: '1',
};

const StudentsPage = ({ user, students = [], onAddStudent, onDeleteStudent }) => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const isAdmin = user?.role === 'admin';

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return students;

    return students.filter((student) =>
      [student.studentId, student.name, student.gender, student.course, student.yearLevel].some((value) =>
        String(value || '').toLowerCase().includes(keyword)
      )
    );
  }, [search, students]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const studentId = form.studentId.trim();
    const name = form.name.trim();

    if (!studentId || !name || !form.gender || !form.course || !form.yearLevel) {
      setMessage('Complete all fields before adding a student.');
      return;
    }

    if (students.some((student) => student.studentId.toLowerCase() === studentId.toLowerCase())) {
      setMessage('Student ID already exists. Use a unique ID.');
      return;
    }

    onAddStudent?.({ ...form, studentId, name });
    setForm(emptyForm);
    setShowForm(false);
    setMessage(`${name} was added successfully.`);
  };

  const handleDelete = (student) => {
    if (!window.confirm(`Delete ${student.name} and related attendance records?`)) return;
    onDeleteStudent?.(student.studentId);
    setMessage(`${student.name} was deleted.`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-800/70 bg-slate-950/80 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.28)] glass-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-sky-300">Student Management</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-100">Students</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Add students, search the roster, and safely remove records from the attendance system.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((open) => !open)}
            disabled={!isAdmin}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            <Plus className="h-4 w-4" />
            Add Student
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-full border border-slate-800/80 bg-slate-900/70 px-4 py-3">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by ID, name, course, or year"
            className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
        </div>

        {message && (
          <div className="mt-5 rounded-3xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
            {message}
          </div>
        )}
      </div>

      {showForm && isAdmin && (
        <form onSubmit={handleSubmit} className="rounded-[32px] border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.3)]">
          <div className="mb-5 flex items-center gap-3 text-slate-100">
            <UserPlus className="h-5 w-5 text-sky-300" />
            <h2 className="text-xl font-semibold">New Student</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              Student ID
              <input
                value={form.studentId}
                onChange={(event) => handleChange('studentId', event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-800/70 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-sky-400"
                placeholder="e.g. S1005"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Full Name
              <input
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-800/70 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-sky-400"
                placeholder="Student name"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Course
              <select
                value={form.course}
                onChange={(event) => handleChange('course', event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-800/70 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-sky-400"
              >
                {courseOptions.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Gender
              <select
                value={form.gender}
                onChange={(event) => handleChange('gender', event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-800/70 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-sky-400"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Year Level
              <select
                value={form.yearLevel}
                onChange={(event) => handleChange('yearLevel', event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-800/70 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-sky-400"
              >
                {['1', '2', '3', '4'].map((year) => (
                  <option key={year} value={year}>Year {year}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
              Save Student
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-slate-800/80 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-[32px] border border-slate-800/70 bg-slate-950/95 shadow-[0_30px_70px_rgba(15,23,42,0.24)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-800/80 bg-slate-900/90 text-slate-400">
              <tr>
                <th className="px-6 py-4">Student ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Gender</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Year Level</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id || student.studentId} className="border-b border-slate-800/80 transition hover:bg-slate-900/70">
                  <td className="px-6 py-4 font-semibold text-sky-200">{student.studentId}</td>
                  <td className="px-6 py-4 text-slate-100">{student.name}</td>
                  <td className="px-6 py-4 capitalize text-slate-300">{student.gender || 'male'}</td>
                  <td className="px-6 py-4 text-slate-300">{student.course}</td>
                  <td className="px-6 py-4 text-slate-300">Year {student.yearLevel}</td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleDelete(student)}
                      disabled={!isAdmin}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
