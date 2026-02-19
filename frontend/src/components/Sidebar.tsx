import { Menu, X, CheckCircle, LogOut, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  userEmail: string;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
  hideToggle?: boolean;
  counts?: {
    active: number;
    progress: number;
    completed: number;
    priority: { high: number; medium: number; low: number };
  };
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

const navVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
    },
  }),
};

export default function Sidebar({ userEmail, onLogout, isOpen, onToggle, hideToggle = false, counts, onNavigate, currentPage }: SidebarProps) {

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'active', label: 'Active Tasks' },
    { id: 'progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  ];

  return (
    <>
      <AnimatePresence>
        {!hideToggle && !isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className="fixed top-4 left-4 z-50 bg-primary-500 text-white p-3 rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-[280px] shadow-2xl lg:shadow-none"
      >
        <div className="flex flex-col h-full p-6 overflow-hidden">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="bg-primary-500 p-2.5 rounded-xl flex-shrink-0 shadow-lg shadow-primary-500/30"
              >
                <CheckCircle className="w-6 h-6 text-white" />
              </motion.div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Securask</h1>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {isOpen && !hideToggle && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggle}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          {isOpen && (
            <>
              <nav className="flex-1 overflow-y-auto custom-scrollbar">
                <ul className="space-y-1.5">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.id}
                      custom={i}
                      variants={navVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.button
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate?.(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${currentPage === item.id
                            ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400'
                          }`}
                      >
                        {item.icon === 'calendar' && <Calendar className="w-5 h-5 flex-shrink-0" />}
                        {item.label}
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>

                {counts && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 px-2"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 px-2">
                      Overview
                    </p>

                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <motion.div whileHover={{ y: -2 }} className="rounded-xl border border-blue-100/60 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-900/10 px-2 py-3 text-center">
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">Active</p>
                        <p className="text-lg font-black text-blue-600 dark:text-blue-400 leading-tight">{counts.active}</p>
                      </motion.div>
                      <motion.div whileHover={{ y: -2 }} className="rounded-xl border border-amber-100/60 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-900/10 px-2 py-3 text-center">
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">Process</p>
                        <p className="text-lg font-black text-amber-600 dark:text-amber-400 leading-tight">{counts.progress}</p>
                      </motion.div>
                      <motion.div whileHover={{ y: -2 }} className="rounded-xl border border-emerald-100/60 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-900/10 px-2 py-3 text-center">
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">Done</p>
                        <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-tight">{counts.completed}</p>
                      </motion.div>
                    </div>

                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 px-2">
                      Priority
                    </p>
                    <div className="space-y-2">
                      {[
                        { label: 'High', count: counts.priority.high, color: 'text-red-500', bg: 'bg-red-500/5' },
                        { label: 'Medium', count: counts.priority.medium, color: 'text-amber-500', bg: 'bg-amber-500/5' },
                        { label: 'Low', count: counts.priority.low, color: 'text-emerald-500', bg: 'bg-emerald-500/5' }
                      ].map((p) => (
                        <motion.div
                          key={p.label}
                          whileHover={{ x: 2 }}
                          className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${p.bg} border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-colors`}
                        >
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{p.label}</span>
                          <span className={`text-sm font-black ${p.color}`}>{p.count}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-auto border-t border-gray-100 dark:border-gray-700 pt-6 flex-shrink-0"
              >
                <div className="mb-4 px-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Account</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-violet-500 flex items-center justify-center text-white text-xs font-black">
                      {userEmail[0].toUpperCase()}
                    </div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">{userEmail}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ backgroundColor: 'rgb(254 242 242)', color: 'rgb(220 38 38)' }}
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-xl transition-all font-bold group"
                >
                  <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Sign Out
                </motion.button>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>
    </>
  );
}
