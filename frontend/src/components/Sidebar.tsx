import { useState } from 'react';
import { Menu, X, CheckCircle, LogOut } from 'lucide-react';

interface SidebarProps {
  userEmail: string;
  onLogout: () => void;
}

export default function Sidebar({ userEmail, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'active', label: 'Active Tasks' },
    { id: 'progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 z-50 bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition ${
          isOpen ? 'left-[292px]' : 'left-4'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '280px' }}
      >
        <div className="flex flex-col h-full p-6 overflow-hidden">
          <div className="mb-8 flex items-center gap-3">
            <div className="bg-primary-500 p-2 rounded-lg flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            {isOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">Securask</h1>
              </div>
            )}
          </div>

          {isOpen && (
            <>
              <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition font-medium">
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-gray-200 pt-4 flex-shrink-0">
                <div className="mb-4 px-4">
                  <p className="text-sm text-gray-600 font-medium mb-1">Account</p>
                  <p className="text-sm text-gray-500 truncate">{userEmail}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition font-medium"
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
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
