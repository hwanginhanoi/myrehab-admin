import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear token and user data from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');

      // Remove auth cookie
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

      // Redirect to login page
      window.location.href = '/auth/login';

      // Return a rejected promise with a custom message
      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    return Promise.reject(error);
  }
);

export default apiClient;