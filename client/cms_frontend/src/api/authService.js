import axiosInstance from './axiosInstance';

/**
 * AUTHENTICATION COMPONENTS
 */

// Login user and initialize the session
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('login/', credentials);
    
    if (response.data.access) {
      // Store tokens for axios interceptors
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Store user info for UI/Role-based routing
      localStorage.setItem('user_type', response.data.user_type);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};

// General user registration (HOD/Staff/Student via email domain)
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('register/', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Registration failed" };
  }
};

// Logout and wipe local session
export const logoutUser = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await axiosInstance.post('logout/', { refresh: refreshToken });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.clear();
    window.location.href = '/login'; 
  }
};

// Fetch user profile and dashboard statistics
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('profile/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to load profile" };
  }
};

/**
 * STUDENT MANAGEMENT COMPONENTS (Admin Only)
 */

// Add a new student (Uses FormData for profile_pic support)
export const addStudent = async (studentFormData) => {
  try {
    const response = await axiosInstance.post('students/', studentFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to create student profile" };
  }
};

// Get list of all students
export const getStudents = async () => {
  try {
    const response = await axiosInstance.get('students/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch students list" };
  }
};

// Delete a student (and their user account)
export const deleteStudent = async (studentId) => {
  try {
    const response = await axiosInstance.delete(`students/${studentId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete student" };
  }
};

/**
 * STAFF MANAGEMENT COMPONENTS
 */

// Get list of all staff members
export const getStaffList = async () => {
  try {
    const response = await axiosInstance.get('staff/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to load staff list" };
  }
};