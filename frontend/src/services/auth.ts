/**
 * authService
 * Utility module for local session management.
 * Interfaces with the browser's localStorage to persist the authentication token.
 */
export const authService = {
  /**
   * Persist the JWT to local storage.
   */
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  /**
   * Retrieve the current session token.
   */
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  /**
   * Clear the session (used on Logout).
   */
  removeToken: () => {
    localStorage.removeItem('token');
  },

  /**
   * Quick check for current auth status.
   * Note: This only checks for the presence of a token, not its validity.
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
