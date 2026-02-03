import axiosInstance from './axiosInstance';

export const registerUser = (userData) => {
  return axiosInstance.post('register/', userData);
};

export const loginUser = async (credentials) => {
  // Django returns: { access, refresh, user, user_type, message }
  const response = await axiosInstance.post('login/', credentials);
  
  if (response.data.access) {
    // Store tokens
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    
    // Store user info and type for easy access in React components
    localStorage.setItem('user_type', response.data.user_type);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logoutUser = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  try {
    // If your backend blacklist is set up, this informs the server
    await axiosInstance.post('logout/', { refresh: refreshToken });
  } catch (error) {
    console.error("Logout error (likely token expired):", error);
  } finally {
    // Always clear local storage regardless of API success
    localStorage.clear();
    window.location.href = '/login'; // Force redirect to login
  }
};

export const getUserProfile = async () => {
  const response = await axiosInstance.get('profile/');
  return response.data;
};