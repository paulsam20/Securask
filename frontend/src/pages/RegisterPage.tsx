import { useState } from 'react';
import { CheckCircle, UserPlus, ArrowLeft, Star, Users, Lock } from 'lucide-react';
import { authAPI } from '../services/api';

interface RegisterPageProps {
    onSwitchToLogin: () => void;
}

const perks = [
    { icon: Star, label: 'Free Forever', desc: 'No credit card required' },
    { icon: Users, label: 'Team Friendly', desc: 'Collaborate with your whole team' },
    { icon: Lock, label: 'Private & Secure', desc: 'Your data stays yours' },
];

export default function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username && email && password) {
            setIsLoading(true);
            setError('');
            setSuccessMessage('');
            try {
                await authAPI.register(username, email, password);
                setSuccessMessage('Registration successful! Redirecting to login…');
                setTimeout(() => onSwitchToLogin(), 1500);
            } catch (err: any) {
                setError(err.message || 'Registration failed. Please try again.');
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex transition-colors duration-300">

            {/* ── Left branding panel ── */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden
                      bg-gradient-to-br from-violet-600 via-primary-500 to-primary-600
                      dark:from-gray-900 dark:via-violet-900 dark:to-primary-950">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-primary-400/20 blur-2xl" />

                <div className="relative z-10 px-16 text-white max-w-md">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-3xl font-extrabold tracking-tight">Securask</span>
                    </div>

                    <h2 className="text-4xl font-bold leading-tight mb-4">
                        Start your journey<br />with us today.
                    </h2>
                    <p className="text-primary-100 dark:text-gray-400 mb-10 text-lg">
                        Create a free account and take control of your tasks in seconds.
                    </p>

                    <ul className="space-y-5">
                        {perks.map(({ icon: Icon, label, desc }) => (
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

                    {/* Logo mobile */}
                    <div className="flex lg:hidden justify-center mb-8">
                        <div className="bg-primary-500 p-3 rounded-xl shadow-lg shadow-primary-500/30">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Join Securask — it's free</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">

                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Your username"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                required
                            />
                        </div>

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
                                placeholder="Create a password"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                required
                            />
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {successMessage && (
                            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                                <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30"
                        >
                            {isLoading ? 'Creating Account…' : <><UserPlus size={20} /> Sign Up</>}
                        </button>

                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={onSwitchToLogin}
                                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center justify-center gap-2 mx-auto transition"
                            >
                                <ArrowLeft size={16} />
                                Back to Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
}
