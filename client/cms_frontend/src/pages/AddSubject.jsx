import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, addSubject } from '../api/curriculumService';

const AddSubject = () => {
  const [subjectName, setSubjectName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [courses, setCourses] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Fetch Courses
        const courseData = await getCourses();
        setCourses(courseData);

        // 2. Fetch Staff Members
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/accounts/staff/', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const staffData = await response.json();
          setStaffMembers(staffData); // API returns full_name
        } else {
          console.error("Failed to fetch staff: ", response.status);
        }
      } catch (err) {
        console.error("Failed to load dropdown data:", err);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseId || !staffId) {
      alert("Please select both a Course and a Staff member.");
      return;
    }

    setLoading(true);

    const payload = { 
      subject_name: subjectName, 
      course_id: parseInt(courseId), 
      staff_id: parseInt(staffId)    
    };

    console.log("Submitting Payload to Django:", payload);

    try {
      await addSubject(payload);
      alert("Subject created successfully!");
      navigate('/manage-subject');
    } catch (err) {
      console.error("Full Error Object:", err);
      const errorMsg = err.response?.data 
        ? JSON.stringify(err.response.data) 
        : err.message;
      alert("Error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#f4f6f9] min-h-screen flex items-center justify-center font-sans">
      <div className="bg-white rounded shadow-md border-t-4 border-[#007bff] w-full max-w-md overflow-hidden">
        <div className="bg-white p-4 border-b">
          <h3 className="text-lg font-normal text-gray-700">Add New Subject</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Subject Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Subject Name</label>
            <input 
              type="text" 
              required 
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Enter Subject Name"
              className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          {/* Course Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Course</label>
            <select 
              required 
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.course_name}
                </option>
              ))}
            </select>
          </div>

          {/* Staff Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Staff</label>
            <select 
              required 
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm bg-green-50 text-black"
            >
              <option value="">Select Staff</option>
              {staffMembers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.full_name} {/* <-- use full_name from API */}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full py-2 rounded text-white text-sm font-normal transition-all ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-[#007bff] hover:bg-[#0069d9]"
              }`}
            >
              {loading ? "Adding..." : "Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubject;