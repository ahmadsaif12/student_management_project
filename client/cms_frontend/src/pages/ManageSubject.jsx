import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubjects, deleteSubject } from '../api/curriculumService';

const ManageSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this subject?")) return;
    try {
      await deleteSubject(id);
      setSubjects(prev => prev.filter(sub => sub.id !== id));
    } catch (err) {
      alert("Failed to delete subject. " + (err.message || ""));
    }
  };

  return (
    <div className="p-8 bg-[#f1f5f9] min-h-screen font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Subject Management</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Total Active Subjects: <span className="text-blue-600">{subjects.length}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/admin-home')} 
            className="bg-white border border-slate-200 text-slate-500 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2"
          >
            🏠 Home
          </button>
          <button 
            onClick={() => navigate('/add-subject')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md transition-all flex items-center gap-2"
          >
            + New Subject
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-20">ID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attached Course</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lecturer</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-20 text-center font-bold text-slate-300 animate-pulse tracking-widest">
                  SYNCING WITH SERVER...
                </td>
              </tr>
            ) : subjects.length > 0 ? (
              subjects.map((sub, idx) => (
                <tr key={sub.id} className="hover:bg-blue-50/30 transition-colors group">
                  {/* Serial ID */}
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-300">
                    { (idx + 1).toString().padStart(3, '0') }
                  </td>

                  {/* Subject Title */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700 uppercase tracking-tight">{sub.subject_name}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">UID: {sub.id}</div>
                  </td>

                  {/* Course Relationship */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-tighter border border-blue-100">
                      {sub.course_name || (sub.course_details ? sub.course_details.course_name : `ID: ${sub.course}`)}
                    </span>
                  </td>

                  {/* Staff Relationship */}
                  <td className="px-6 py-4">
                    <div className="text-xs font-semibold text-slate-600">
                      {sub.staff_name || (sub.staff_details ? `${sub.staff_details.first_name} ${sub.staff_details.last_name}` : `Staff ID: ${sub.staff}`)}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-5">
                      <button 
                        onClick={() => navigate(`/edit-subject/${sub.id}`)}
                        className="text-slate-300 hover:text-blue-500 transition-colors transform hover:scale-125"
                        title="Edit Subject"
                      >
                        <span className="text-base">✏️</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(sub.id)} 
                        className="text-slate-300 hover:text-rose-500 transition-colors transform hover:scale-125"
                        title="Delete Subject"
                      >
                        <span className="text-base">🗑️</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                  No subjects found in curriculum records.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSubject;