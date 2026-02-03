import axiosInstance from './axiosInstance';

/**
 * Register a new user
 * @param {Object} userData - { email, password, first_name, last_name }
 */
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('register/', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Registration failed" };
  }
};

/**
 * Login user and initialize the session
 */
export const loginUser = async (credentials) => {
  // Django returns: { access, refresh, user, user_type, message }
  const response = await axiosInstance.post('login/', credentials);
  
  if (response.data.access) {
    // Store tokens
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    
    // Store user info for UI display
    localStorage.setItem('user_type', response.data.user_type);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

/**
 * Logout and wipe local session
 */
export const logoutUser = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  try {
    // Attempt to blacklist the token on the server
    await axiosInstance.post('logout/', { refresh: refreshToken });
  } catch (error) {
    console.error("Logout error (likely token already expired):", error);
  } finally {
    // Safety first: always clear local storage even if network fails
    localStorage.clear();
    window.location.href = '/login'; 
  }
};

/**
 * Fetches user profile and dashboard stats
 * This is usually what powers the Admin Dashboard numbers
 */
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('profile/');
    return response.data;
  } catch (error) {
    // If we get a 403/401 here, the token is likely invalid
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.warn("Session expired. Logging out...");
      // Optional: auto-logout on expired token
      // logoutUser(); 
    }
    throw error.response?.data || { error: "Failed to load profile" };
  }
};