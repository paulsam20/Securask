import { Menu, X, CheckCircle, LogOut, Calendar } from 'lucide-react';

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
      {!hideToggle && !isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{ width: '280px' }}
      >
        <div className="flex flex-col h-full p-6 overflow-hidden">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-primary-500 p-2 rounded-lg flex-shrink-0 shadow-lg shadow-primary-500/30">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              {isOpen && (
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Securask</h1>
                </div>
              )}
            </div>
            {isOpen && !hideToggle && (
              <button
                onClick={onToggle}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {isOpen && (
            <>
              <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button 
                        onClick={() => onNavigate?.(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 transition font-medium ${
                          currentPage === item.id
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400'
                        }`}
                      >
                        {item.icon === 'calendar' && <Calendar className="w-5 h-5 flex-shrink-0" />}
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>

                {counts && (
                  <div className="mt-6 px-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                      Overview
                    </p>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="rounded-lg border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-900/20 px-2 py-2">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Active</p>
                        <p className="text-lg font-bold text-blue-700 dark:text-blue-300 leading-tight">{counts.active}</p>
                      </div>
                      <div className="rounded-lg border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-900/20 px-2 py-2">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Progress</p>
                        <p className="text-lg font-bold text-amber-700 dark:text-amber-300 leading-tight">{counts.progress}</p>
                      </div>
                      <div className="rounded-lg border border-green-200/60 dark:border-green-900/40 bg-green-50/70 dark:bg-green-900/20 px-2 py-2">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Done</p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-300 leading-tight">{counts.completed}</p>
                      </div>
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                      Priority
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/60 dark:bg-gray-900/30 border border-gray-200/60 dark:border-gray-800/60">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">High</span>
                        <span className="text-xs font-semibold text-red-600 dark:text-red-400">{counts.priority.high}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/60 dark:bg-gray-900/30 border border-gray-200/60 dark:border-gray-800/60">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Medium</span>
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{counts.priority.medium}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/60 dark:bg-gray-900/30 border border-gray-200/60 dark:border-gray-800/60">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Low</span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{counts.priority.low}</span>
                      </div>
                    </div>
                  </div>
                )}
              </nav>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex-shrink-0">
                <div className="mb-4 px-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Account</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}
