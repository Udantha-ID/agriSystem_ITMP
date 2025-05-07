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
    console.log('Attempting login for:', email);
    
    // Clean up any old tokens
    localStorage.removeItem('demo_mode');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    const response = await api.post('/login', { email, password });
    
    // Check if we have a valid response with token and user
    if (response.data && response.data.token && response.data.user) {
      console.log('Login successful, token received:', response.data.token.substring(0, 10) + '...');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } else {
      console.error('Invalid server response:', response.data);
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Login error:', error.message || 'Unknown error');
    
    // Clean up on error
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
  
  if (!token || !user) {
    return false;
  }
  
  // Check token format - at minimum should be a non-empty string
  if (typeof token !== 'string' || token.trim() === '') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
  
  return true;
};

const updateProfile = async (userData) => {
  try {
    const response = await api.patch('/update', userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please check your connection.' };
  }
};

const updatePassword = async (oldPassword, newPassword) => {
  try {
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
