import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // Your backend URL
  withCredentials: true, // Important for cookies
});

// Request Interceptor: Attach the correct token
api.interceptors.request.use(
  (config) => {
    // 1. Try to get the Admin token first
    const adminToken = localStorage.getItem('adminToken');
    
    // 2. If no admin token, try to get the Table token
    const tableToken = localStorage.getItem('tableToken');

    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (tableToken) {
      config.headers.Authorization = `Bearer ${tableToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 (Unauthorized) errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear all tokens and force a re-login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('tableToken');
      
      // Redirect to the appropriate login page
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login'; // Or your table login page
      }
    }
    return Promise.reject(error);
  }
);

export default api;