import axiosInstance from './axiosInstance';

/**
 * --- AUTHENTICATION ---
 * Handles login, registration, profile, and logout.
 */

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('accounts/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user_role', response.data.user_type);
      localStorage.setItem('user_name', response.data.user.full_name);
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
 * --- STUDENT MANAGEMENT (Admin Only) ---
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
    const response = await axiosInstance.delete(`accounts/students/${studentId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete student" };
  }
};

/**
 * --- STAFF MANAGEMENT (Admin Only) ---
 */

export const getStaffList = async () => {
  try {
    const response = await axiosInstance.get('accounts/staff/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to load staff list" };
  }
};

export const addStaff = async (staffFormData) => {
  try {
    const response = await axiosInstance.post('accounts/staff/', staffFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to create staff profile" };
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

/**
 * --- FEEDBACK MANAGEMENT ---
 */

export const submitFeedback = async (feedbackText) => {
  try {
    const response = await axiosInstance.post('operations/feedback/', {
      feedback: feedbackText
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to submit feedback" };
  }
};

export const getFeedbackHistory = async () => {
  try {
    const response = await axiosInstance.get('operations/feedback/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to load feedback history" };
  }
};

export const getAdminFeedback = async () => {
  try {
    const response = await axiosInstance.get('operations/admin-feedback/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to load admin feedback" };
  }
};

export const replyToFeedback = async (feedbackId, replyMessage, type) => {
  try {
    const response = await axiosInstance.post('operations/admin-feedback/', {
      feedback_id: feedbackId,
      reply: replyMessage,
      type: type // 'Student' or 'Staff'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to reply to feedback" };
  }
};

/**
 * --- LEAVE MANAGEMENT (STUDENT) ---
 */

export const applyStudentLeave = async (leaveData) => {
  try {
    const response = await axiosInstance.post('operations/leave/student/', leaveData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Submission failed" };
  }
};

export const getStudentLeaveHistory = async () => {
  try {
    const response = await axiosInstance.get('operations/leave/student/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to load history" };
  }
};

/**
 * --- LEAVE MANAGEMENT (STAFF) ---
 */

export const applyStaffLeave = async (leaveData) => {
  try {
    const response = await axiosInstance.post('operations/leave/staff/', leaveData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Staff leave submission failed" };
  }
};

export const getStaffLeaveHistory = async () => {
  try {
    const response = await axiosInstance.get('operations/leave/staff/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to load staff history" };
  }
};

/**
 * --- ADMIN LEAVE ACTIONS ---
 */

export const getAdminStudentLeaves = async () => {
  try {
    const response = await axiosInstance.get('operations/admin/student-leaves/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch student leave list" };
  }
};

export const getAdminStaffLeaves = async () => {
  try {
    const response = await axiosInstance.get('operations/admin/staff-leaves/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch staff leave list" };
  }
};

export const updateLeaveStatus = async (leaveId, type, status) => {
  try {
    const response = await axiosInstance.post('operations/leave/action/', {
      leave_id: leaveId,
      type: type, // 'staff' or 'student'
      status: status // 1: Approve, 2: Reject
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update leave status" };
  }
};