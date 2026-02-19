import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { authService } from './services/auth';

import RegisterPage from './pages/RegisterPage';
import ThemeToggle from './components/ThemeToggle';
import ParticleBackground from './components/ParticleBackground';
import StickyNotes from './components/StickyNotes';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentPage, setCurrentPage] = useState<'login' | 'register'>('login');
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      // You could fetch user info here if needed
      setIsLoggedIn(true);
      // For now, we'll use a placeholder email
      setUserEmail('user@example.com');
    }
  }, []);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authService.removeToken();
    setIsLoggedIn(false);
    setUserEmail('');
    setCurrentPage('login');
  };

  return (
    <>
      {!isNotesOpen && <ThemeToggle />}
      {isLoggedIn && (
        <StickyNotes isOpen={isNotesOpen} onOpenChange={setIsNotesOpen} />
      )}
      <ParticleBackground />
      <div className="relative z-10 w-full min-h-screen">
        {isLoggedIn ? (
          <DashboardPage userEmail={userEmail} onLogout={handleLogout} isNotesOpen={isNotesOpen} />
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
