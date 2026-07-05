import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AUTH_API_BASE_URL } from '../api';

const LoginPage = ({ onLogin }) => {
  const { role } = useParams();
  const normalizedRole = role === 'admin' ? 'admin' : 'student';
  const navigate = useNavigate();
  const [email, setEmail] = useState(normalizedRole === 'student' ? '' : 'admin@example.com');
  const [password, setPassword] = useState(normalizedRole === 'student' ? '' : 'Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${AUTH_API_BASE_URL}/login`, {
        email: String(email).trim().toLowerCase(),
        password,
      });
      onLogin(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials. Please try again.');
    }
  };

  const roleName = normalizedRole === 'admin' ? 'Admin' : 'Student';
  const title = `${roleName} Sign In`;
  const description = normalizedRole === 'admin'
    ? 'Sign in with your admin credentials to manage attendance, events, and student records.'
    : 'Sign in with your student account to view your attendance dashboard and event schedule.';
  const altRoute = normalizedRole === 'admin' ? '/login/student' : '/login/admin';
  const altRouteLabel = normalizedRole === 'admin' ? 'Student Login' : 'Admin Login';

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[36px] border border-panel/70 bg-panel/70 shadow-[0_28px_80px_rgba(7,26,47,0.45)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden bg-gradient-to-br from-brand to-panel p-10 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.16),_transparent_35%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-accent/80">AttendancePro</p>
              <h2 className="mt-8 text-4xl font-semibold text-white">Professional attendance for students and staff</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-200/85">
                Fast, secure access to attendance dashboards, event check-ins, and student records.
              </p>
            </div>
            <div className="mt-10 space-y-4">
              <div className="rounded-3xl border border-accent/10 bg-accent/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">Secure & reliable</p>
                <p className="mt-1 text-sm text-slate-200/85">All sign-ins are protected with encrypted authentication.</p>
              </div>
              <div className="rounded-3xl border border-accent/10 bg-accent/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">Designed for education</p>
                <p className="mt-1 text-sm text-slate-200/85">Supports both admins and students with tailored dashboards.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-accent/80">{roleName} Portal</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">{title}</h1>
            </div>
            <div className="text-sm text-slate-400">
              New here?{' '}
              <Link to={`/signup/${normalizedRole}`} className="font-semibold text-accent hover:text-white">
                Create account
              </Link>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">{description}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
            {error && <div className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
            <button className="w-full rounded-3xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95">
              Sign In
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Need a different login?{' '}
              <Link to={altRoute} className="font-semibold text-accent hover:text-white">
                {altRouteLabel}
              </Link>
            </span>
            <span className="text-slate-500">Secure access powered by AttendancePro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
