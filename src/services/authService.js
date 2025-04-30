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
    const response = await api.post('/login', { email, password });
    if (response.data && response.data.token && response.data.user) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    // Clear any existing auth data on error
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw error.response?.data || { message: 'Network error. Please check your connection.' };
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
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
