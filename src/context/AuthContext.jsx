import React, { createContext, useContext, useState, useEffect } from 'react';
// Fix the import statement to use default import
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Only check auth status once on initial load
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is already logged in when the app loads
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear any invalid auth data
        authService.logout();
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      const data = await authService.updateProfile(userData);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    isLoading,
    isInitialized,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
