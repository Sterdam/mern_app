import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios defaults
  axios.defaults.baseURL = '/api';
  axios.defaults.withCredentials = true; // Important for cookies

  // Set up CSRF token fetch
  const fetchCsrfToken = async () => {
    try {
      const res = await axios.get('/auth/csrf-token');
      // The token is set in cookies automatically by the server
      // and will be sent with subsequent requests
    } catch (err) {
      console.error('Error fetching CSRF token:', err);
    }
  };

  // Load user on initial app load
  useEffect(() => {
    const loadUser = async () => {
      try {
        // First get CSRF token
        await fetchCsrfToken();
        
        // Then try to get user data
        const res = await axios.get('/auth/user');
        setUser(res.data);
      } catch (err) {
        // Don't show error if just not logged in
        if (err.response?.status !== 401) {
          setError(err.response?.data?.message || 'Authentication failed');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post('/auth/register', userData);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const res = await axios.post('/auth/login', userData);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};