const API_URL = 'http://localhost:8000/api/curriculum';

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// --- COURSE OPERATIONS ---
export const getCourses = async () => {
  const response = await fetch(`${API_URL}/courses/`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch courses');
  return await response.json();
};

export const addCourse = async (courseName) => {
  const response = await fetch(`${API_URL}/courses/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ course_name: courseName }),
  });
  if (!response.ok) throw new Error('Failed to add course');
  return await response.json();
};

export const deleteCourse = async (courseId) => {
  const response = await fetch(`${API_URL}/courses/${courseId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  // FIX: Django returns 204 for successful deletes. We check response.ok 
  // and DON'T try to parse JSON because a 204 body is empty.
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Delete failed');
  }
  return true;
};

// --- SUBJECT OPERATIONS ---
export const getSubjects = async () => {
  const response = await fetch(`${API_URL}/subjects/`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch subjects');
  return await response.json();
};

export const addSubject = async (subjectData) => {
  const response = await fetch(`${API_URL}/subjects/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(subjectData),
  });
  if (!response.ok) throw new Error('Failed to add subject');
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
  const response = await fetch(`${API_URL}/sessions/`, { headers: getHeaders() });
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

export const deleteSession = async (sessionId) => {
  const response = await fetch(`${API_URL}/sessions/${sessionId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete session');
  return true;
};

// --- BUNDLED EXPORT (Satisfies ManageSession.jsx) ---
export const curriculumService = {
  getCourses, addCourse, deleteCourse,
  getSubjects, addSubject, deleteSubject,
  getSessions, addSession, deleteSession 
};