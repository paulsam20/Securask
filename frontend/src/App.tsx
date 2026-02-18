import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { authService } from './services/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      // You could fetch user info here if needed
      setIsLoggedIn(true);
      // For now, we'll use a placeholder email
      setUserEmail('user@example.com');
    }
  }, []);

  const handleLogin = (email: string, userData: any) => {
    setUserEmail(email);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authService.removeToken();
    setIsLoggedIn(false);
    setUserEmail('');
    setUser(null);
  };

  return (
    <>
      {isLoggedIn ? (
        <DashboardPage userEmail={userEmail} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
