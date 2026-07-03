import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api';

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
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      onLogin(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
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
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-900">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[36px] bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden bg-gradient-to-br from-slate-800 via-indigo-700 to-blue-600 p-10 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.15),_transparent_40%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-300">AttendancePro</p>
              <h2 className="mt-8 text-4xl font-semibold">Professional attendance for students and staff</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-200/85">
                Fast, secure access to attendance dashboards, event check-ins, and student records.
              </p>
            </div>
            <div className="mt-10 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">Secure & reliable</p>
                <p className="mt-1 text-sm text-slate-200/85">All sign-ins are protected with encrypted authentication.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">Designed for education</p>
                <p className="mt-1 text-sm text-slate-200/85">Supports both admins and students with tailored dashboards.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-blue-600">{roleName} Portal</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h1>
            </div>
            <div className="text-sm text-slate-500">
              New here?{' '}
              <Link to={`/signup/${normalizedRole}`} className="font-semibold text-slate-900 hover:text-slate-700">
                Create account
              </Link>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">{description}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-28 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center rounded-full bg-slate-100 px-3 text-sm text-slate-600 transition hover:bg-slate-200"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {error && <div className="rounded-3xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>}
            <button className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Sign In
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Need a different login?{' '}
              <Link to={altRoute} className="font-semibold text-slate-900 hover:text-slate-700">
                {altRouteLabel}
              </Link>
            </span>
            <span className="text-slate-400">Secure access powered by AttendancePro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
