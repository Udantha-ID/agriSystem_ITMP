import axios from 'axios';

// Create an instance of axios with a base URL
const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log(`Adding auth token to ${config.url}: ${token.substring(0, 10)}...`);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn(`No token found for request to ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}: Status ${response.status}`);
    return response;
  },
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      console.error('Authentication error:', error.response.data);
      // Optionally clear token on 401 errors
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    console.error('API request failed:', error.message, error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient; 