import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api';

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
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
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
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-900">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[36px] bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden bg-gradient-to-br from-slate-800 via-indigo-700 to-blue-600 p-10 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.15),_transparent_40%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-300">AttendancePro</p>
              <h2 className="mt-8 text-4xl font-semibold">Ready to streamline attendance?</h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-200/85">
                Build a secure account for {roleName.toLowerCase()} access, event check-ins, and personalized reports.
              </p>
            </div>
            <div className="mt-10 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">Professional design</p>
                <p className="mt-1 text-sm text-slate-200/85">The interface is optimized for quick onboarding.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">Fast setup</p>
                <p className="mt-1 text-sm text-slate-200/85">Create your account and start tracking attendance immediately.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-blue-600">{roleName} Registration</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h1>
            </div>
            <div className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to={`/login/${normalizedRole}`} className="font-semibold text-slate-900 hover:text-slate-700">
                Sign In
              </Link>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">{description}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
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
              <label className="mb-2 block text-sm font-medium text-slate-700">Gender</label>
              <div className="grid grid-cols-2 gap-3">
                {['male', 'female'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGender(option)}
                    className={`rounded-3xl border px-4 py-3 text-sm font-semibold capitalize transition ${
                      gender === option
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
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
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-28 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center rounded-full bg-slate-100 px-3 text-sm text-slate-600 transition hover:bg-slate-200"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {error && <div className="rounded-3xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>}
            <button className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Create Account
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-slate-400">Secure registration with AttendancePro</span>
            <span>
              Prefer admin login?{' '}
              <Link to="/login/admin" className="font-semibold text-slate-900 hover:text-slate-700">
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
