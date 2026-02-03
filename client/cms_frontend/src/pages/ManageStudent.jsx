import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents, deleteStudent } from '../api/authService';

const ManageStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getStudents();
        setStudents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("ARE YOU SURE? This will permanently delete this student.")) {
      try {
        await deleteStudent(id);
        setStudents(prev => prev.filter(s => s.id !== id));
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] ml-64 p-8 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Student Database</h1>
          <p className="text-slate-500 text-sm">Total Records: {students.length}</p>
        </div>
        
        <div className="flex gap-3">
          {/* HOME BUTTON */}
          <button 
            onClick={() => navigate('/admin-home')}
            className="bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 px-6 py-2.5 rounded-lg text-[10px] font-black tracking-widest transition-all shadow-sm flex items-center gap-2"
          >
            🏠 HOME
          </button>

          {/* ADD STUDENT BUTTON */}
          <button 
            onClick={() => navigate('/add-student')}
            className="bg-[#007bff] hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-[10px] font-black tracking-widest transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
          >
            + ADD STUDENT
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Student Information</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Assigned Course</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="3" className="p-20 text-center font-black text-slate-400">SYNCING DATA...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan="3" className="p-20 text-center font-black text-slate-400">NO RECORDS FOUND</td></tr>
            ) : (
              students.map(s => {
                // Better name handling
                const displayName = (s.first_name && s.first_name !== 'N/A') 
                  ? `${s.first_name} ${s.last_name || ''}` 
                  : s.email.split('@')[0];

                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 leading-none">{displayName}</div>
                          <div className="text-[11px] text-blue-600 font-medium mt-1">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md text-[10px] font-black uppercase border border-emerald-100">
                        {s.course_name || 'GENERAL'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {/* High Visibility Buttons */}
                        <button 
                          onClick={() => alert('Edit feature active')}
                          className="bg-amber-400 hover:bg-amber-500 text-amber-950 text-[10px] font-black px-4 py-2 rounded shadow-sm transition"
                        >
                          EDIT
                        </button>
                        <button 
                          onClick={() => handleDelete(s.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-4 py-2 rounded shadow-sm transition"
                        >
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudent;