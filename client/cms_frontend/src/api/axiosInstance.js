import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/accounts/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Token to headers
axiosInstance.interceptors.request.use((config) => {
  // Changed from 'token' to 'access_token' to match your authService
  const token = localStorage.getItem('access_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: Add a response interceptor to handle expired tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expires, clear storage and send to login
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;