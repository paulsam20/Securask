import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Calendar from '../components/Calendar';

/**
 * CalendarPage Component
 * Full-screen view for the calendar module.
 * Incorporates:
 * - Persistent sidebar for navigation
 * - Main calendar interface
 * - Real-time clock footer with glassmorphism styling
 */
interface CalendarPageProps {
  userEmail: string;
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

export default function CalendarPage({ userEmail, onLogout, onNavigate }: CalendarPageProps) {
  // Sidebar state (open by default on desktop)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary-600/8 via-gray-50/85 to-violet-600/8 dark:from-primary-900/15 dark:via-gray-900/85 dark:to-violet-900/15 transition-colors duration-300">
      {/* Shared Navigation Sidebar */}
      <Sidebar
        userEmail={userEmail}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        hideToggle={false}
        onNavigate={onNavigate}
        currentPage="calendar"
      />

      <main
        className={`flex-1 overflow-auto transition-[padding] duration-300 ${sidebarOpen ? 'lg:pl-[280px]' : 'lg:pl-14'
          }`}
      >
        <div className="pt-16 lg:pt-0 px-6 lg:px-8 py-8 pb-24">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                Calendar & Reminders
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
                Manage your events and reminders in one place
              </p>
            </div>

            {/* Core Calendar Component (handles its own data fetching/CRUD) */}
            <Calendar />
          </div>
        </div>

        {/* Global Footer: Displays live date and time with a blurred backdrop */}
        <footer className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
          <div
            className={`mx-auto max-w-6xl px-6 lg:px-8 pb-5 ${sidebarOpen ? 'lg:pl-[280px]' : 'lg:pl-14'
              } transition-[padding] duration-300`}
          >
            <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white/70 dark:bg-gray-900/45 border border-gray-200/70 dark:border-gray-800/70 backdrop-blur-md shadow-sm text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <span className="tabular-nums">
                {new Date().toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
