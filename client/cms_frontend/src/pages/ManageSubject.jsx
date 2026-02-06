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
      // Debugging: Check your console to see what the staff object is named
      console.log("Subject Data:", data);
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
      alert("Failed to delete subject.");
    }
  };

  return (
    <div className="p-8 bg-[#f1f5f9] min-h-screen font-sans ml-64">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase italic">Subject Management</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Curriculum Registry / <span className="text-blue-600">Total: {subjects.length}</span>
          </p>
        </div>
        <button 
          onClick={() => navigate('/add-subject')} 
          className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-black transition-all"
        >
          + New Subject
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ref</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-blue-400">Assigned Staff</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="5" className="p-10 text-center animate-pulse">Loading Records...</td></tr>
            ) : subjects.map((sub, idx) => (
              <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{(idx + 1).toString().padStart(3, '0')}</td>
                
                <td className="px-6 py-4">
                  <div className="font-black text-slate-900 uppercase text-xs">{sub.subject_name}</div>
                </td>

                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase">
                    {sub.course_name || "N/A"}
                  </span>
                </td>

                {/* STAFF NAME COLUMN - KEY FIX HERE */}
                <td className="px-6 py-4">
                  <div className="text-xs font-black text-indigo-600 uppercase">
                    {/* Check both common field names used in serializers */}
                    {sub.staff_name || sub.assigned_staff_name || "Unassigned"}
                  </div>
                  <div className="text-[9px] text-slate-400 italic">
                    {sub.staff_email || ""}
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-4">
                    <button onClick={() => navigate(`/edit-subject/${sub.id}`)} className="text-slate-900 font-black text-[10px] uppercase underline hover:text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(sub.id)} className="text-red-600 font-black text-[10px] uppercase underline hover:text-red-800">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSubject;