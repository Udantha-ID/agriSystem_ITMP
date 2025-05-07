import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register and automatically log in
const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    // If there's a network error (server down), set up demo mode
    if (error.message && error.message.includes('Network Error')) {
      // Create a demo user and token
      const demoToken = `demo_${Math.random().toString(36).substring(2)}`;
      const demoUser = {
        id: `demo_${Date.now()}`,
        fullName: userData.fullName || 'Demo User',
        email: userData.email,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('token', demoToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('demo_mode', 'true');
      
      return { user: demoUser, token: demoToken, success: true };
    }
    
    throw error.response?.data || { message: 'Network error. Please check your connection.' };
  }
};

// Register only without automatic login
const registerOnly = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    // Don't save token or user data
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please check your connection.' };
  }
};

const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    if (response.data && response.data.token && response.data.user) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.removeItem('demo_mode'); // Ensure we're not in demo mode
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    // If there's a network error (server down), set up demo mode
    if (error.message && error.message.includes('Network Error')) {
      console.log('Server unreachable, setting up demo mode');
      
      // Create a demo user and token
      const demoToken = `demo_${Math.random().toString(36).substring(2)}`;
      const demoUser = {
        id: 'demo_user_123',
        fullName: 'Demo User',
        email: email,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('token', demoToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('demo_mode', 'true');
      
      return { user: demoUser, token: demoToken, success: true };
    }
    
    // Other error handling
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw error.response?.data || { message: 'Network error. Please check your connection.' };
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('demo_mode');
};

const getCurrentUser = () => {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Invalid user data in localStorage', error);
    localStorage.removeItem('user');
    return null;
  }
};

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = getCurrentUser();
  return !!token && !!user;
};

const updateProfile = async (userData) => {
  try {
    // If we're in demo mode, just update locally
    if (localStorage.getItem('demo_mode') === 'true') {
      const currentUser = getCurrentUser() || {};
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    }
    
    // Otherwise, try to update via API
    const response = await api.patch('/update', userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    // If network error, fall back to local update
    if (error.message && error.message.includes('Network Error')) {
      const currentUser = getCurrentUser() || {};
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('demo_mode', 'true');
      return { success: true, user: updatedUser };
    }
    
    throw error.response?.data || { message: 'Network error. Please check your connection.' };
  }
};

const updatePassword = async (oldPassword, newPassword) => {
  try {
    // If in demo mode, pretend it worked
    if (localStorage.getItem('demo_mode') === 'true') {
      return { success: true, message: 'Password updated (demo mode)' };
    }
    
    const response = await api.patch('/update-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please check your connection.' };
  }
};

// Create a single authService object to export
const authService = {
  register,
  registerOnly,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  updateProfile,
  updatePassword,
};

// Export as default only - remove the named export to avoid duplicate exports
export default authService;
