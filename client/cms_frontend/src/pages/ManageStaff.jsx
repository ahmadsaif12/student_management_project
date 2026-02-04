import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStaffList, deleteStaff } from '../api/authService'; // Use the service!

const ManageStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStaff = async () => {
    try {
      // This now calls /api/accounts/staff/ via the service
      const data = await getStaffList();
      setStaff(data);
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this staff profile?")) {
      try {
        // Updated to use the correct prefixed path via service
        await deleteStaff(id); 
        setStaff(staff.filter(s => s.id !== id));
      } catch (err) { 
        alert("Delete failed: Check console for details"); 
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 ml-64 p-8 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-sm border border-slate-300">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase">Staff Directory</h1>
          <p className="text-slate-500 text-[10px] font-bold tracking-widest">ADMINISTRATION PANEL</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/admin-home')}
            className="bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all shadow-sm flex items-center gap-2"
          >
            🏠 HOME
          </button>
          
          <button 
            onClick={() => navigate('/add-staff')} 
            className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-xs font-black tracking-widest hover:bg-black transition shadow-lg shadow-slate-200"
          >
            + ADD STAFF
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-4 text-[10px] font-bold uppercase border-b border-slate-700">Staff Details</th>
              <th className="p-4 text-[10px] font-bold uppercase border-b border-slate-700">Email Address</th>
              <th className="p-4 text-[10px] font-bold uppercase border-b border-slate-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr><td colSpan="3" className="p-20 text-center font-bold text-slate-900 italic tracking-[0.5em]">SYNCING...</td></tr>
            ) : staff.length === 0 ? (
              <tr><td colSpan="3" className="p-20 text-center font-bold text-slate-900">NO STAFF RECORDS FOUND</td></tr>
            ) : (
              staff.map(s => (
                <tr key={s.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-slate-900 flex items-center justify-center font-bold text-white text-xs">
                        {s.full_name ? s.full_name[0] : 'S'}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">
                          {s.full_name || "Unknown Name"}
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold">ID: #{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-blue-700 font-bold italic">
                    {s.email || "No Email"}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-4">
                      <button onClick={() => navigate(`/edit-staff/${s.id}`)} className="text-slate-900 hover:text-blue-600 text-[10px] font-black uppercase underline decoration-2 underline-offset-4">Edit</button>
                      <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800 text-[10px] font-black uppercase underline decoration-2 underline-offset-4">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStaff;