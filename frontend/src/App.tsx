import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import { authService } from './services/auth';

import RegisterPage from './pages/RegisterPage';
import ThemeToggle from './components/ThemeToggle';
import ParticleBackground from './components/ParticleBackground';
import StickyNotes from './components/StickyNotes';

/**
 * pageVariants
 * Animation definitions for smooth page transitions using Framer Motion.
 * Features a modern blur-in and slide effect.
 */
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
} as const;

/**
 * App Component
 * The root container that manages global application state:
 * - Authentication status
 * - Routing/Navigation (Simulated via conditional rendering)
 * - Global UI elements (Particle background, Theme toggle, Sticky notes)
 */
function App() {
  // Global Application State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'dashboard' | 'calendar' | 'active' | 'progress' | 'completed'>('login');
  const [isNotesOpen, setIsNotesOpen] = useState(false); // Controls the slide-out sticky notes panel

  /**
   * Session Check: Verification of persistence on load
   */
  useEffect(() => {
    // If a valid JWT exists in localStorage, auto-login the user
    if (authService.isAuthenticated()) {
      setIsLoggedIn(true);
      setUserEmail('user@example.com');
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    authService.removeToken();
    setIsLoggedIn(false);
    setUserEmail('');
    setCurrentPage('login');
  };

  /**
   * Navigation Engine: Updates the current view based on sidebar/router events
   */
  const handleNavigate = (page: string) => {
    setCurrentPage(page as any);
  };

  return (
    <>
      {/* Global Header UI: Theme and Notes Toggle */}
      {isLoggedIn && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          {!isNotesOpen && <ThemeToggle />}
          <StickyNotes isOpen={isNotesOpen} onOpenChange={setIsNotesOpen} />
        </div>
      )}
      {!isLoggedIn && (
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
      )}

      {/* Persistent Visual Elements */}
      <ParticleBackground />

      {/* Content Wrapper with Page Transitions */}
      <div className="relative z-10 w-full min-h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (isLoggedIn ? '-auth' : '-guest')}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full min-h-screen"
          >
            {/* Conditional Route Rendering */}
            {isLoggedIn ? (
              currentPage === 'calendar' ? (
                <CalendarPage userEmail={userEmail} onLogout={handleLogout} onNavigate={handleNavigate} />
              ) : (
                <DashboardPage
                  userEmail={userEmail}
                  onLogout={handleLogout}
                  isNotesOpen={isNotesOpen}
                  onNavigate={handleNavigate}
                  currentPage={currentPage === 'dashboard' ? 'dashboard' : (currentPage as any)}
                />
              )
            ) : currentPage === 'login' ? (
              <LoginPage
                onLogin={handleLogin}
                onSwitchToRegister={() => setCurrentPage('register')}
              />
            ) : (
              <RegisterPage onSwitchToLogin={() => setCurrentPage('login')} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
