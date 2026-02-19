import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import { authService } from './services/auth';

import RegisterPage from './pages/RegisterPage';
import ThemeToggle from './components/ThemeToggle';
import ParticleBackground from './components/ParticleBackground';
import StickyNotes from './components/StickyNotes';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'dashboard' | 'calendar'>('login');
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      // You could fetch user info here if needed
      setIsLoggedIn(true);
      // For now, we'll use a placeholder email
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

  const handleNavigate = (page: string) => {
    setCurrentPage(page as 'dashboard' | 'calendar');
  };

  return (
    <>
      {/* Fixed Header with Theme Toggle and Sticky Notes */}
      {isLoggedIn && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          {!isNotesOpen && <ThemeToggle />}
          <StickyNotes isOpen={isNotesOpen} onOpenChange={setIsNotesOpen} />
        </div>
      )}
      {!isLoggedIn && <ThemeToggle />}
      
      <ParticleBackground />
      <div className="relative z-10 w-full min-h-screen">
        {isLoggedIn ? (
          currentPage === 'calendar' ? (
            <CalendarPage userEmail={userEmail} onLogout={handleLogout} onNavigate={handleNavigate} />
          ) : (
            <DashboardPage 
              userEmail={userEmail} 
              onLogout={handleLogout} 
              isNotesOpen={isNotesOpen}
              onNavigate={handleNavigate}
              currentPage={currentPage}
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
      </div>
    </>
  );
}

export default App;
