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
    <div className="p-8 bg-[#f1f5f9] min-h-screen font-sans ml-64">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Subject Management</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Curriculum Registry / <span className="text-blue-600">Total: {subjects.length}</span>
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
            className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md transition-all flex items-center gap-2"
          >
            + New Subject
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-20">REF</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attached Course</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lecturer</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-20 text-center font-bold text-slate-400 animate-pulse tracking-widest">
                  SYNCING WITH SERVER...
                </td>
              </tr>
            ) : subjects.length > 0 ? (
              subjects.map((sub, idx) => (
                <tr key={sub.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-[10px] font-bold text-slate-300">
                    { (idx + 1).toString().padStart(3, '0') }
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-black text-slate-900 uppercase text-xs">{sub.subject_name}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">DB-ID: {sub.id}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase border border-slate-200">
                      {sub.course_name || "Unassigned"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-xs font-black text-slate-900 uppercase">
                      {/* FIXED: Uses the flattened name from the updated Serializer */}
                      {sub.staff_name || "Pending Assignment"}
                    </div>
                    <div className="text-[10px] text-blue-600 font-bold italic lowercase">
                      {sub.staff_email}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4">
                      <button 
                        onClick={() => navigate(`/edit-subject/${sub.id}`)}
                        className="text-slate-900 font-black text-[10px] uppercase underline decoration-2 underline-offset-4 hover:text-blue-600"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(sub.id)} 
                        className="text-red-600 font-black text-[10px] uppercase underline decoration-2 underline-offset-4 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
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