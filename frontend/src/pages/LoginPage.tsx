import { useState } from 'react';
import { CheckCircle, ShieldCheck, Zap, LayoutDashboard } from 'lucide-react';
import { authAPI } from '../services/api';
import { authService } from '../services/auth';

interface LoginPageProps {
  onLogin: (email: string, user: any) => void;
  onSwitchToRegister: () => void;
}

const features = [
  { icon: LayoutDashboard, label: 'Kanban Board', desc: 'Drag & drop tasks across columns' },
  { icon: Zap, label: 'Instant Sync', desc: 'Changes reflect in real-time' },
  { icon: ShieldCheck, label: 'Secure Auth', desc: 'JWT-based protected sessions' },
];

export default function LoginPage({ onLogin, onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      setError('');
      try {
        const response = await authAPI.login(email, password);
        authService.setToken(response.token);
        onLogin(email, response.user);
      } catch (err: any) {
        setError(err.message || 'Login failed. Please try again.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex transition-colors duration-300">

      {/* ── Left branding panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden
                      bg-gradient-to-br from-primary-600 via-primary-500 to-violet-600
                      dark:from-gray-900 dark:via-primary-900 dark:to-violet-950">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-violet-400/20 blur-2xl" />

        <div className="relative z-10 px-16 text-white max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">Securask</span>
          </div>

          <h2 className="text-4xl font-bold leading-tight mb-4">
            Organize your work,<br />achieve your goals.
          </h2>
          <p className="text-primary-100 dark:text-gray-400 mb-10 text-lg">
            A minimal, powerful task manager built for focused teams.
          </p>

          {/* Feature highlights */}
          <ul className="space-y-5">
            {features.map(({ icon: Icon, label, desc }) => (
              <li key={label} className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-white/15 rounded-lg p-2 backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-sm text-primary-200 dark:text-gray-400">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8
                      bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="w-full max-w-md">

          {/* Logo (mobile only) */}
          <div className="flex lg:hidden justify-center mb-8">
            <div className="bg-primary-500 p-3 rounded-xl shadow-lg shadow-primary-500/30">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your Securask account</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 shadow-lg shadow-primary-500/30"
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold hover:underline transition"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
