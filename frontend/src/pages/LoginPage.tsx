import { useState } from 'react';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { authService } from '../services/auth';
import ShuffleText from '../components/ShuffleText';

/**
 * LoginPage Component
 * Handles user authentication.
 * Features:
 * - High-end branding panel with CSS Marquees
 * - Shuffle text animations for headlines
 * - Form validation and error handlng
 * - Interactive Framer Motion transitions
 */
interface LoginPageProps {
  onLogin: (email: string, user: any) => void;
  onSwitchToRegister: () => void;
}

const marqueeText = "Securask • Task Management • Secure • Efficient • Organized • Productive • ";

// Staggered entry animation for the form items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function LoginPage({ onLogin, onSwitchToRegister }: LoginPageProps) {
  // Local Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggles password visibility
  const [isLoading, setIsLoading] = useState(false); // Controls loading indicators and button disabling
  const [error, setError] = useState(''); // Stores validation/API errors

  /**
   * Submission: Validates credentials against the backend API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      setError('');
      try {
        // API Call to register/login route
        const response = await authAPI.login(email, password);
        // Persist token in localStorage
        authService.setToken(response.token);
        // Inform App.tsx of successful login
        onLogin(email, response.user);
      } catch (err: any) {
        // Feedback on failure
        setError(err.message || 'Login failed. Please try again.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex transition-colors duration-300">

      {/* ── Left Branding Panel: Visual identity, marquees, and blobs ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col overflow-hidden
                      bg-gradient-to-br from-primary-600 via-primary-500 to-violet-600
                      dark:from-gray-900 dark:via-primary-900 dark:to-violet-950">

        {/* Animated Background Orbs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-violet-400/20 blur-2xl"
        />

        {/* Top Scrolling Marquee */}
        <div className="relative z-10 overflow-hidden border-b border-white/10">
          <div className="marquee-container">
            <div className="marquee-content">{marqueeText.repeat(5)}</div>
            <div className="marquee-content" aria-hidden="true">{marqueeText.repeat(5)}</div>
          </div>
        </div>

        {/* Hero Content with Shuffle Animation */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white text-center max-w-md"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="bg-white/20 p-3 rounded-xl backdrop-blur-sm shadow-xl"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              <ShuffleText text="Securask" className="text-3xl font-extrabold tracking-tight" />
            </div>
            <ShuffleText
              text="A minimal, powerful task manager built for focused individuals."
              className="text-primary-100 dark:text-gray-400 text-lg block mt-2"
            />
          </motion.div>
        </div>

        {/* Bottom Scrolling Marquee (Reverse direction) */}
        <div className="relative z-10 overflow-hidden border-t border-white/10">
          <div className="marquee-container marquee-reverse">
            <div className="marquee-content">{marqueeText.repeat(5)}</div>
            <div className="marquee-content" aria-hidden="true">{marqueeText.repeat(5)}</div>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel: User input and validation ── */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8
                      bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >

          {/* Logo (Visible only on mobile/tablet) */}
          <div className="flex lg:hidden justify-center mb-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-primary-500 p-3 rounded-xl shadow-lg shadow-primary-500/30"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mb-8 font-manrope">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your Securask account</p>
          </motion.div>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
          >
            {/* Email Input */}
            <motion.div variants={itemVariants} className="mb-5">
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
            </motion.div>

            {/* Password Input with Visibility Toggle */}
            <motion.div variants={itemVariants} className="mb-6 relative">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Error Message Feedback */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 shadow-lg shadow-primary-500/30"
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </motion.button>

            {/* Switch to Registration Link */}
            <motion.div variants={itemVariants} className="mt-6 text-center">
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
            </motion.div>
          </motion.form>
        </motion.div>
      </div>

    </div>
  );
}
