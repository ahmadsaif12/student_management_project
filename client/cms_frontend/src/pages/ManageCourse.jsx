import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, deleteCourse } from '../api/curriculumService';

const ManageCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getCourses();
      // Added check: if data is null, set empty array to prevent crash
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    // Safety check: Don't proceed if id is missing
    if (!id) {
      alert("Error: Course ID is missing.");
      return;
    }

    const confirmDelete = window.confirm(`Permanently delete "${name}"?`);
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      const success = await deleteCourse(id);
      
      if (success) {
        // This updates the UI without a refresh
        setCourses(prev => prev.filter(course => course.id !== id));
      }
    } catch (err) {
      console.error("Delete UI Error:", err);
      alert(`DELETE FAILED: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-black text-slate-900 uppercase">Manage Courses</h1>
        <button 
          onClick={() => navigate('/add-course')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
        >
          + ADD NEW
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase">ID</th>
              <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase">Course Name</th>
              <th className="px-8 py-4 text-center text-xs font-black text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && courses.map((course) => (
              <tr key={course.id || Math.random()} className={deletingId === course.id ? 'opacity-50' : ''}>
                <td className="px-8 py-4 font-mono text-sm">#{course.id}</td>
                <td className="px-8 py-4 font-bold uppercase">{course.course_name}</td>
                <td className="px-8 py-4 text-center">
                  <button 
                    onClick={() => handleDelete(course.id, course.course_name)}
                    disabled={deletingId === course.id}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition-all text-xs font-bold"
                  >
                    {deletingId === course.id ? '⌛' : 'DELETE'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && courses.length === 0 && (
          <p className="p-10 text-center text-slate-400">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageCourse;