import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, deleteCourse } from '../api/curriculumService';

const ManageCourse = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCourse(id);
      setCourses(prev => prev.filter(course => course.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Could not delete the course.");
    }
  };

  const filtered = courses.filter(c => 
    c.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#f1f5f9] min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 uppercase tracking-tighter leading-none">Manage Course</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Registry / Course Management
          </p>
        </div>

        <div className="flex gap-3">
         
          <button 
            onClick={() => navigate('/admin-home')}
            className="bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all shadow-sm flex items-center gap-2"
          >
            🏠 HOME
          </button>
          
          <button 
            onClick={() => navigate('/add-course')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all shadow-sm"
          >
            + ADD NEW
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <input 
            type="text" 
            placeholder="FILTER BY NOMENCLATURE..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-semibold outline-none focus:border-blue-500 transition-all uppercase placeholder:text-slate-300"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-20">Index</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course Nomenclature</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="3" className="p-10 text-center font-medium text-slate-400 italic">Synchronizing data...</td></tr>
            ) : filtered.length > 0 ? (
              filtered.map((course, idx) => (
                <tr key={course.id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-300 group-hover:text-blue-500">
                    { (idx + 1).toString().padStart(3, '0') }
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-base font-bold text-slate-700 uppercase">{course.course_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => navigate(`/edit-course/${course.id}`)}
                        className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition-all" 
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(course.id)} 
                        className="text-rose-500 hover:text-rose-700 p-2 rounded hover:bg-rose-50 transition-all" 
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" className="p-10 text-center text-slate-400 text-sm italic">No records found matching your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCourse;