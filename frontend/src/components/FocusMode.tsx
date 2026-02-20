import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Target, CheckCircle2, ChevronRight, Clock } from 'lucide-react';

interface FocusModeProps {
    task: {
        id: string;
        title: string;
        description?: string;
    };
    onComplete: (taskId: string) => void;
    onCancel: () => void;
}

const DURATIONS = [
    { label: '15m', minutes: 15 },
    { label: '25m', minutes: 25 },
    { label: '45m', minutes: 45 },
    { label: '60m', minutes: 60 },
];

export default function FocusMode({ task, onComplete, onCancel }: FocusModeProps) {
    const [isSettingUp, setIsSettingUp] = useState(true);
    const [selectedMinutes, setSelectedMinutes] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    const startFocus = () => {
        setTimeLeft(selectedMinutes * 60);
        setIsSettingUp(false);
        setIsActive(true);
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = useCallback(() => {
        setIsActive(false);
        setTimeLeft(isBreak ? 5 * 60 : selectedMinutes * 60);
    }, [isBreak, selectedMinutes]);

    useEffect(() => {
        if (!isActive || isSettingUp) return;

        const startTime = Date.now();
        const startLeft = timeLeft;

        const interval = window.setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const newTimeLeft = Math.max(0, startLeft - elapsed);

            setTimeLeft(newTimeLeft);

            if (newTimeLeft === 0) {
                window.clearInterval(interval);
            }
        }, 100); // Check more frequently for responsiveness

        return () => window.clearInterval(interval);
    }, [isActive, isSettingUp]);

    useEffect(() => {
        if (timeLeft === 0 && isActive && !isSettingUp) {
            setIsActive(false);
            if (!isBreak) {
                setSessionsCompleted((prev) => prev + 1);
                setIsBreak(true);
                setTimeLeft(5 * 60);
                // Call onComplete when the focus session ends
                onComplete(task.id);
            } else {
                setIsBreak(false);
                setTimeLeft(selectedMinutes * 60);
            }
        }
    }, [timeLeft, isActive, isBreak, isSettingUp, task.id, onComplete, selectedMinutes]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = isBreak
        ? (timeLeft / (5 * 60)) * 100
        : (timeLeft / (selectedMinutes * 60)) * 100;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/95 backdrop-blur-2xl p-4 sm:p-6"
        >
            <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onCancel}
                className="absolute top-6 left-6 p-3 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors z-10"
            >
                <X className="w-6 h-6" />
            </motion.button>

            <div className="w-full max-w-2xl text-center">
                <AnimatePresence mode="wait">
                    {isSettingUp ? (
                        <motion.div
                            key="setup"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="space-y-12"
                        >
                            <div>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-6"
                                >
                                    <Target className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Setup Focus Session</span>
                                </motion.div>
                                <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tighter">
                                    {task.title}
                                </h2>
                                <p className="text-gray-500 text-lg">How long do you want to focus?</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4">
                                {DURATIONS.map((d) => (
                                    <motion.button
                                        key={d.minutes}
                                        whileHover={{ scale: 1.05, y: -4 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedMinutes(d.minutes)}
                                        className={`
                      px-8 py-6 rounded-3xl border-2 transition-all duration-300
                      ${selectedMinutes === d.minutes
                                                ? 'bg-primary-500 border-primary-400 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)]'
                                                : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10 hover:bg-white/10'}
                    `}
                                    >
                                        <span className="text-2xl font-black">{d.label}</span>
                                    </motion.button>
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startFocus}
                                className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-gray-950 font-black text-xl hover:bg-primary-50 transition-colors"
                            >
                                Start Session
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="timer"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div className="mb-12">
                                <h2 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight">
                                    {task.title}
                                </h2>
                                <div className="flex items-center justify-center gap-4 text-gray-500 font-bold uppercase tracking-widest text-sm">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        {selectedMinutes}m Goal
                                    </span>
                                    <span>•</span>
                                    <span>Session {sessionsCompleted + 1}</span>
                                </div>
                            </div>

                            <div className="relative inline-flex items-center justify-center mb-12 group">
                                {/* SVG Ring with Gradient */}
                                <svg viewBox="0 0 100 100" className="w-64 h-64 sm:w-80 sm:h-80 transform -rotate-90 drop-shadow-[0_0_25px_rgba(59,130,246,0.2)]">
                                    <defs>
                                        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor={isBreak ? "#34d399" : "#60a5fa"} />
                                            <stop offset="100%" stopColor={isBreak ? "#059669" : "#2563eb"} />
                                        </linearGradient>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="2" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                    </defs>

                                    {/* Background Track */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        className="stroke-white/5 fill-none"
                                        strokeWidth="2"
                                    />

                                    {/* Progress Ring */}
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="url(#ringGradient)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeDasharray="282.7"
                                        initial={{ strokeDashoffset: 282.7 }}
                                        animate={{ strokeDashoffset: 282.7 - (282.7 * progress) / 100 }}
                                        transition={{ duration: isActive ? 1 : 0.5, ease: "linear" }}
                                        filter="url(#glow)"
                                    />
                                </svg>

                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.span
                                        key={timeLeft}
                                        initial={{ opacity: 0.8, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`text-6xl sm:text-8xl font-black tabular-nums tracking-tighter ${isBreak ? 'text-emerald-400' : 'text-white'
                                            }`}
                                    >
                                        {formatTime(timeLeft)}
                                    </motion.span>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs mt-2 flex items-center gap-2"
                                    >
                                        {isBreak ? (
                                            <>
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Short Break
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                                                Focusing
                                            </>
                                        )}
                                    </motion.div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-6 sm:gap-8">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={resetTimer}
                                    className="p-4 rounded-2xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                                    title="Reset timer"
                                >
                                    <RotateCcw className="w-6 h-6" />
                                </motion.button>

                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: isBreak ? "0 0 20px rgba(16, 185, 129, 0.3)" : "0 0 20px rgba(59, 130, 246, 0.3)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleTimer}
                                    className={`
                    w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl transition-all
                    ${isBreak
                                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                            : 'bg-primary-500 hover:bg-primary-600 text-white'}
                  `}
                                >
                                    {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 ml-1 fill-current" />}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onComplete(task.id)}
                                    className="p-4 rounded-2xl bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-white/10 transition-all border border-white/5"
                                    title="Mark as completed & exit"
                                >
                                    <CheckCircle2 className="w-6 h-6" />
                                </motion.button>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-12 flex items-center justify-center gap-2"
                            >
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-3 h-3 rounded-full transition-colors duration-500 ${i < sessionsCompleted ? 'bg-primary-500 shadow-lg shadow-primary-500/50' : 'bg-white/10'
                                            }`}
                                    />
                                ))}
                                <span className="ml-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    {sessionsCompleted}/4 Sessions
                                </span>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
