import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, Camera, CreditCard, Mail, Phone, Save, ShieldCheck, UserCircle2 } from 'lucide-react';

const courseOptions = [
  'Bachelor of Science in Information Technology',
  'Bachelor of Science in Hospitality Management',
  'Bachelor of Science in Industrial Technology (Electrical)',
  'Bachelor of Science in Industrial Technology (Automotive)',
  'Bachelor of Science in Industrial Technology (Culinary)',
  'Bachelor of Science in Industrial Technology (Computer Science)',
];

const SettingsPage = ({ user, onUpdateProfile }) => {
  const [form, setForm] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
    gender: user?.gender || 'male',
    profilePhoto: user?.profilePhoto || '',
    phone: user?.phone || '',
    identityId: user?.identityId || user?.studentId || '',
    department: user?.department || (user?.role === 'admin' ? 'Administration Office' : 'Student Affairs'),
    course: user?.course || courseOptions[0],
    yearLevel: user?.yearLevel || '1',
  }));
  const [message, setMessage] = useState('Keep your account and identity information accurate.');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      gender: user?.gender || 'male',
      profilePhoto: user?.profilePhoto || '',
      phone: user?.phone || '',
      identityId: user?.identityId || user?.studentId || '',
      department: user?.department || (user?.role === 'admin' ? 'Administration Office' : 'Student Affairs'),
      course: user?.course || courseOptions[0],
      yearLevel: user?.yearLevel || '1',
    });
  }, [user]);

  const initials = useMemo(() => {
    const parts = (form.name || 'User').trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase()).join('') || 'U';
  }, [form.name]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Please choose a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      handleChange('profilePhoto', reader.result);
      setMessage('Profile picture selected. Save profile to apply it.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setMessage('Name and email are required.');
      return;
    }

    onUpdateProfile?.({
      ...form,
      identityId: form.identityId.trim(),
      studentId: isAdmin ? user?.studentId : form.identityId.trim(),
      role: user?.role || 'student',
    });
    setMessage('Profile updated successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-panel/70 bg-gradient-to-br from-brand to-panel p-6 shadow-[0_30px_70px_rgba(7,26,47,0.35)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">User Info Panel</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Profile & Identity</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Edit your profile, identity details, and contact information used across AttendancePro.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-[28px] border border-panel/60 bg-panel/60 p-4">
            {form.profilePhoto ? (
              <img src={form.profilePhoto} alt={form.name || 'Profile'} className="h-16 w-16 rounded-3xl object-cover shadow-lg shadow-sky-950/30" />
              ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent text-xl font-bold text-white shadow-lg shadow-sky-950/30">
                {initials}
              </div>
            )}
            <div>
              <p className="font-semibold text-white">{form.name || 'Unnamed User'}</p>
              <p className="mt-1 text-sm capitalize text-slate-400">{user?.role || 'student'} account</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[32px] border border-panel/70 bg-panel/70 p-6 shadow-[0_24px_60px_rgba(7,26,47,0.25)]">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <BadgeCheck className="h-5 w-5 text-sky-300" />
            Account Summary
          </h2>
          <div className="mt-6 space-y-4">
            <SummaryCard icon={<UserCircle2 className="h-5 w-5" />} label="Display Name" value={form.name || 'Not set'} />
            <SummaryCard icon={<Mail className="h-5 w-5" />} label="Email" value={form.email || 'Not set'} />
            <SummaryCard icon={<BadgeCheck className="h-5 w-5" />} label="Gender" value={form.gender || 'Not set'} />
            <SummaryCard icon={<ShieldCheck className="h-5 w-5" />} label="Role" value={user?.role || 'student'} />
            <SummaryCard icon={<CreditCard className="h-5 w-5" />} label={isAdmin ? 'Admin Identity' : 'Student ID'} value={form.identityId || 'Not set'} />
          </div>
          <div className="mt-6 rounded-[28px] border border-accent/20 bg-accent/10 p-4 text-sm leading-6 text-accent">
            {message}
          </div>
        </section>

        <form onSubmit={handleSubmit} className="rounded-[32px] border border-panel/70 bg-panel/70 p-6 shadow-[0_24px_60px_rgba(7,26,47,0.25)]">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Edit Profile</h2>
              <p className="mt-2 text-sm text-slate-400">Changes are saved locally and reflected in the topbar/dashboard immediately.</p>
            </div>
            <span className="rounded-full bg-panel/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {isAdmin ? 'Admin Profile' : 'Student Profile'}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <span className="text-sky-300"><Camera className="h-4 w-4" /></span>
                  Profile Picture
                </span>
                <div className="mt-2 flex flex-wrap items-center gap-4 rounded-[28px] border border-slate-800/70 bg-slate-900/80 p-4">
                  {form.profilePhoto ? (
                    <img src={form.profilePhoto} alt="Profile preview" className="h-20 w-20 rounded-3xl object-cover" />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-500 text-xl font-bold text-white">{initials}</div>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="max-w-full text-sm text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
                    {form.profilePhoto && (
                      <button type="button" onClick={() => handleChange('profilePhoto', '')} className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-200">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </label>
            </div>

            <Field label="Full Name" icon={<UserCircle2 className="h-4 w-4" />}>
              <input
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                className="field-input"
                placeholder="Your full name"
              />
            </Field>

            <Field label="Email Address" icon={<Mail className="h-4 w-4" />}>
              <input
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                className="field-input"
                placeholder="name@example.com"
              />
            </Field>

            <Field label="Gender" icon={<BadgeCheck className="h-4 w-4" />}>
              <select value={form.gender} onChange={(event) => handleChange('gender', event.target.value)} className="field-input">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </Field>

            <Field label="Phone Number" icon={<Phone className="h-4 w-4" />}>
              <input
                value={form.phone}
                onChange={(event) => handleChange('phone', event.target.value)}
                className="field-input"
                placeholder="Optional contact number"
              />
            </Field>

            <Field label={isAdmin ? 'Admin Identity No.' : 'Student ID'} icon={<CreditCard className="h-4 w-4" />}>
              <input
                value={form.identityId}
                onChange={(event) => handleChange('identityId', event.target.value)}
                className="field-input"
                placeholder={isAdmin ? 'e.g. ADM-001' : 'e.g. S1001'}
              />
            </Field>

            <Field label="Department / Office" icon={<ShieldCheck className="h-4 w-4" />}>
              <input
                value={form.department}
                onChange={(event) => handleChange('department', event.target.value)}
                className="field-input"
                placeholder="Department or office"
              />
            </Field>

            {!isAdmin && (
              <>
                <Field label="Course" icon={<BadgeCheck className="h-4 w-4" />}>
                  <select
                    value={form.course}
                    onChange={(event) => handleChange('course', event.target.value)}
                    className="field-input"
                  >
                    {courseOptions.map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Year Level" icon={<BadgeCheck className="h-4 w-4" />}>
                  <select
                    value={form.yearLevel}
                    onChange={(event) => handleChange('yearLevel', event.target.value)}
                    className="field-input"
                  >
                    {['1', '2', '3', '4'].map((year) => (
                      <option key={year} value={year}>Year {year}</option>
                    ))}
                  </select>
                </Field>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">Your role is protected and cannot be changed here.</p>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95"
            >
              <Save className="h-4 w-4" />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-[28px] border border-panel/70 bg-panel/70 p-4">
    <div className="rounded-2xl bg-accent/10 p-3 text-accent">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-100">{value}</p>
    </div>
  </div>
);

const Field = ({ label, icon, children }) => (
  <label className="block text-sm font-medium text-slate-300">
    <span className="inline-flex items-center gap-2">
      <span className="text-accent">{icon}</span>
      {label}
    </span>
    {children}
  </label>
);

export default SettingsPage;
