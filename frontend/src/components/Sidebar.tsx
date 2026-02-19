import { Menu, X, CheckCircle, LogOut } from 'lucide-react';

interface SidebarProps {
  userEmail: string;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ userEmail, onLogout, isOpen, onToggle }: SidebarProps) {

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'active', label: 'Active Tasks' },
    { id: 'progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <>
      <button
        onClick={onToggle}
        className={`fixed top-4 z-50 bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition ${isOpen ? 'left-[292px]' : 'left-4'
          }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div
        className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{ width: '280px' }}
      >
        <div className="flex flex-col h-full p-6 overflow-hidden">
          <div className="mb-8 flex items-center gap-3">
            <div className="bg-primary-500 p-2 rounded-lg flex-shrink-0 shadow-lg shadow-primary-500/30">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            {isOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Securask</h1>
              </div>
            )}
          </div>

          {isOpen && (
            <>
              <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
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
