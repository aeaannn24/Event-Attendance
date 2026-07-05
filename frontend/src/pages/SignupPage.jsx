import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AUTH_API_BASE_URL } from '../api';

const SignupPage = ({ onLogin }) => {
  const { role } = useParams();
  const normalizedRole = role === 'admin' ? 'admin' : 'student';
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('male');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${AUTH_API_BASE_URL}/signup`, {
        name,
        email: String(email).trim().toLowerCase(),
        gender,
        password,
        role: normalizedRole,
      });
      onLogin(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Signup failed. Please try again.');
    }
  };

  const roleName = normalizedRole === 'admin' ? 'Admin' : 'Student';
  const title = `Create a ${roleName} Account`;
  const description = normalizedRole === 'admin'
    ? 'Register as an admin to manage event attendance, student records, and system settings.'
    : 'Register as a student to track attendance, upcoming events, and your personal dashboard.';

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[36px] border border-panel/70 bg-panel/70 shadow-[0_28px_80px_rgba(7,26,47,0.45)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden bg-gradient-to-br from-brand to-panel p-10 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.16),_transparent_35%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-accent/80">AttendancePro</p>
              <h2 className="mt-8 text-4xl font-semibold text-white">Ready to streamline attendance?</h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-200/85">
                Build a secure account for {roleName.toLowerCase()} access, event check-ins, and personalized reports.
              </p>
            </div>
            <div className="mt-10 space-y-4">
              <div className="rounded-3xl border border-accent/10 bg-accent/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">Professional design</p>
                <p className="mt-1 text-sm text-slate-200/85">The interface is optimized for quick onboarding.</p>
              </div>
              <div className="rounded-3xl border border-accent/10 bg-accent/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">Fast setup</p>
                <p className="mt-1 text-sm text-slate-200/85">Create your account and start tracking attendance immediately.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-accent/80">{roleName} Registration</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">{title}</h1>
            </div>
            <div className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to={`/login/${normalizedRole}`} className="font-semibold text-accent hover:text-white">
                Sign In
              </Link>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">{description}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-3xl border border-panel/70 bg-panel/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-3xl border border-panel/70 bg-panel/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Gender</label>
              <div className="grid grid-cols-2 gap-3">
                {['male', 'female'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGender(option)}
                    className={`rounded-3xl border px-4 py-3 text-sm font-semibold capitalize transition ${
                      gender === option
                        ? 'border-accent bg-accent/10 text-accent ring-2 ring-accent/20'
                        : 'border-panel/70 bg-panel/60 text-slate-100 hover:bg-panel/80'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-3xl border border-panel/70 bg-panel/60 px-4 py-3 pr-28 text-sm text-slate-100 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center rounded-full bg-panel/70 px-3 text-sm text-slate-300 transition hover:bg-panel/80"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-3xl border border-panel/70 bg-panel/60 px-4 py-3 pr-28 text-sm text-slate-100 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center rounded-full bg-panel/70 px-3 text-sm text-slate-300 transition hover:bg-panel/80"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {error && <div className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
            <button className="w-full rounded-3xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95">
              Create Account
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-slate-500">Secure registration with AttendancePro</span>
            <span>
              Prefer admin login?{' '}
              <Link to="/login/admin" className="font-semibold text-accent hover:text-white">
                Admin Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
