// Auth service to manage authentication state
export const authService = {
  // Save token to localStorage
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  // Get token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
