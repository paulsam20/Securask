import { useState } from 'react';
import { CheckCircle, UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/api';

import ShuffleText from '../components/ShuffleText';

interface RegisterPageProps {
    onSwitchToLogin: () => void;
}

const marqueeText = "Securask • Task Management • Secure • Efficient • Organized • Productive • ";

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

export default function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
            <div className="hidden lg:flex lg:w-1/2 relative flex-col overflow-hidden
                      bg-gradient-to-br from-violet-600 via-primary-500 to-primary-600
                      dark:from-gray-900 dark:via-violet-900 dark:to-primary-950">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-primary-400/20 blur-2xl"
                />

                {/* Top marquee */}
                <div className="relative z-10 overflow-hidden border-b border-white/10">
                    <div className="marquee-container">
                        <div className="marquee-content">
                            {marqueeText.repeat(5)}
                        </div>
                        <div className="marquee-content" aria-hidden="true">
                            {marqueeText.repeat(5)}
                        </div>
                    </div>
                </div>

                {/* Center logo and tagline */}
                <div className="relative z-10 flex-1 flex items-center justify-center px-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-white text-center max-w-md"
                    >
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <motion.div
                                whileHover={{ rotate: -10, scale: 1.1 }}
                                className="bg-white/20 p-3 rounded-xl backdrop-blur-sm shadow-xl"
                            >
                                <CheckCircle className="w-8 h-8 text-white" />
                            </motion.div>
                            <ShuffleText text="Securask" className="text-3xl font-extrabold tracking-tight" />
                        </div>
                        <ShuffleText
                            text="Create a free account and take control of your tasks in seconds."
                            className="text-primary-100 dark:text-gray-400 text-lg block mt-2"
                        />
                    </motion.div>
                </div>

                {/* Bottom marquee */}
                <div className="relative z-10 overflow-hidden border-t border-white/10">
                    <div className="marquee-container marquee-reverse">
                        <div className="marquee-content">
                            {marqueeText.repeat(5)}
                        </div>
                        <div className="marquee-content" aria-hidden="true">
                            {marqueeText.repeat(5)}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8
                      bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md"
                >

                    {/* Logo mobile */}
                    <div className="flex lg:hidden justify-center mb-8">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="bg-primary-500 p-3 rounded-xl shadow-lg shadow-primary-500/30"
                        >
                            <CheckCircle className="w-8 h-8 text-white" />
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Join Securask — it's free</p>
                    </motion.div>

                    <motion.form
                        variants={itemVariants}
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                    >

                        <motion.div variants={itemVariants} className="mb-5">
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
                        </motion.div>

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

                        <motion.div variants={itemVariants} className="mb-6 relative">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
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

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg overflow-hidden"
                                >
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </motion.div>
                            )}

                            {successMessage && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg overflow-hidden"
                                >
                                    <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30"
                        >
                            {isLoading ? 'Creating Account…' : <><UserPlus size={20} /> Sign Up</>}
                        </motion.button>

                        <motion.div variants={itemVariants} className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={onSwitchToLogin}
                                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center justify-center gap-2 mx-auto transition group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Login
                            </button>
                        </motion.div>
                    </motion.form>
                </motion.div>
            </div>

        </div>
    );
}
