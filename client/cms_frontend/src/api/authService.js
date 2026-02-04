import axiosInstance from './axiosInstance';



export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('accounts/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user_type', response.data.user_type);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('accounts/register/', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Registration failed" };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('accounts/profile/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to load profile" };
  }
};

export const logoutUser = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await axiosInstance.post('accounts/logout/', { refresh: refreshToken });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.clear();
    window.location.href = '/login'; 
  }
};

/**
 * STUDENT MANAGEMENT (Admin Only)
 * Base Path: /api/accounts/students/
 */

export const getStudents = async () => {
  try {
    const response = await axiosInstance.get('accounts/students/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch students list" };
  }
};

export const addStudent = async (studentFormData) => {
  try {
    // Corrected to include 'accounts/' prefix
    const response = await axiosInstance.post('accounts/students/', studentFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to create student profile" };
  }
};

export const deleteStudent = async (studentId) => {
  try {
    // Corrected to include 'accounts/' prefix
    const response = await axiosInstance.delete(`accounts/students/${studentId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete student" };
  }
};



export const getStaffList = async () => {
  try {
    const response = await axiosInstance.get('accounts/staff/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to load staff list" };
  }
};



export const deleteStaff = async (staffId) => {
  try {
    const response = await axiosInstance.post(`accounts/staff-delete/${staffId}/`); 
   
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete staff" };
  }
};
//feedback
export const submitFeedback = async (feedbackText) => {
  try {
    const response = await axiosInstance.post('operations/feedback/submit/', {
      feedback: feedbackText
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to submit feedback" };
  }
};