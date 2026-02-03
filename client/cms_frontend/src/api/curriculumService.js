const API_URL = 'http://localhost:8000/api/curriculum';

/**
 * Helper to get fresh headers for every request.
 * This ensures the latest token from localStorage is always used.
 */
const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// --- COURSE OPERATIONS ---

export const getCourses = async () => {
  try {
    const response = await fetch(`${API_URL}/courses/`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    if (response.status === 403 || response.status === 401) {
      throw new Error("Your session has expired. Please log out and log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch courses');
    }
    return await response.json();
  } catch (error) {
    console.error("getCourses Error:", error);
    throw error;
  }
};

export const addCourse = async (courseName) => {
  const response = await fetch(`${API_URL}/courses/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ course_name: courseName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Django often returns errors as objects, e.g., { course_name: ["This field is required"] }
    const errorMsg = typeof errorData === 'object' 
      ? Object.values(errorData).flat().join(', ') 
      : 'Failed to add course';
    throw new Error(errorMsg);
  }
  return await response.json();
};

export const deleteCourse = async (courseId) => {
  const response = await fetch(`${API_URL}/courses/${courseId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete course');
  return true;
};

// --- SUBJECT OPERATIONS ---

export const getSubjects = async () => {
  const response = await fetch(`${API_URL}/subjects/`, { // Added /
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch subjects');
  return await response.json();
};

export const addSubject = async (subjectData) => {
  const response = await fetch(`${API_URL}/subjects/`, { // Added /
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(subjectData),
  });

  // Check if response is JSON before parsing
  const contentType = response.headers.get("content-type");
  if (!response.ok) {
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const errorData = await response.json();
      throw new Error(Object.values(errorData).flat().join(', '));
    } else {
      // This catches the HTML error and gives you a hint
      const text = await response.text();
      console.error("Server returned HTML instead of JSON:", text);
      throw new Error(`Server Error: ${response.status}. Check backend logs.`);
    }
  }
  return await response.json();
};
export const deleteSubject = async (subjectId) => {
  const response = await fetch(`${API_URL}/subjects/${subjectId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete subject');
  return true;
};

// --- SESSION OPERATIONS ---

export const getSessions = async () => {
  const response = await fetch(`${API_URL}/sessions/`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch sessions');
  return await response.json();
};

export const addSession = async (sessionData) => {
  const response = await fetch(`${API_URL}/sessions/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(sessionData),
  });
  if (!response.ok) throw new Error('Failed to add session');
  return await response.json();
};

// --- BUNDLED EXPORT ---
export const curriculumService = {
  addCourse,
  getCourses,
  deleteCourse,
  addSubject,
  getSubjects,
  deleteSubject,
  getSessions,
  addSession
};