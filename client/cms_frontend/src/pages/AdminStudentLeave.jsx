import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAdminStudentLeaves, updateLeaveStatus, logoutUser, getUserProfile } from '../api/authService';

const AdminStudentLeave = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaveData, profileData] = await Promise.all([
          getAdminStudentLeaves(),
          getUserProfile()
        ]);
        setLeaves(Array.isArray(leaveData) ? leaveData : []);
        setUserProfile(profileData);
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await updateLeaveStatus(id, 'student', status);
      alert(`Leave ${status === 1 ? 'Approved' : 'Rejected'} successfully!`);
      navigate('/admin-home'); 
    } catch (err) {
      alert("Failed to update leave status.");
    }
  };

  const filteredLeaves = leaves.filter(item => {
    const s = parseInt(item.leave_status);
    if (filter === 'all') return true;
    if (filter === 'pending') return s === 0;
    if (filter === 'approved') return s === 1;
    if (filter === 'rejected') return s === 2;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar - Consistent with Dashboard */}
      <aside className="w-64 bg-[#1e293b] fixed h-full text-slate-300 shadow-2xl z-20 hidden lg:block">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-user-shield text-white"></i>
           </div>
           <span className="text-white font-black text-sm uppercase truncate">
             {userProfile?.first_name || "ADMIN"}
           </span>
        </div>
        <nav className="py-4 px-3">
          <SidebarLink onClick={() => navigate('/admin-home')} icon="fas fa-home" label="Dashboard Home" />
          <p className="px-4 mt-8 mb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Operations</p>
          <SidebarLink active={true} icon="fas fa-envelope-open-text" label="Student Leaves" />
          <SidebarLink onClick={() => navigate('/manage-staff-leaves')} icon="fas fa-calendar-minus" label="Staff Leaves" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 flex-1">
        <header className="bg-white/90 backdrop-blur-lg h-16 flex items-center justify-between px-8 shadow-sm border-b sticky top-0 z-10">
          <h2 className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Management Console / Leaves</h2>
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black">
            {userProfile?.first_name?.charAt(0) || 'A'}
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <header className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">Student Leaves</h1>
              <p className="text-slate-500 font-medium mt-1">Review and manage student absence requests.</p>
            </div>
            
            <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              {['all', 'pending', 'approved', 'rejected'].map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === f ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </header>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Information</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Leave Date</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="5" className="p-20 text-center">Loading...</td></tr>
                ) : filteredLeaves.length === 0 ? (
                  <tr><td colSpan="5" className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">No requests found</td></tr>
                ) : (
                  filteredLeaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                        <p className="text-sm font-black text-slate-800">{leave.student_name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Applied on {leave.applied_on}</p>
                      </td>
                      <td className="p-6 text-center">
                        <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600">{leave.leave_date}</span>
                      </td>
                      <td className="p-6 text-xs text-slate-500 font-medium max-w-xs">{leave.leave_message}</td>
                      <td className="p-6"><StatusBadge status={leave.leave_status} /></td>
                      <td className="p-6 text-right">
                        {parseInt(leave.leave_status) === 0 ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleAction(leave.id, 1)} className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center">
                              <i className="fas fa-check"></i>
                            </button>
                            <button onClick={() => handleAction(leave.id, 2)} className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center">
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ) : <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mr-4">Complete</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

/* Helper Components */
const SidebarLink = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold mb-1 transition-all ${active ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-500'}`}>
    <i className={`${icon} w-5 text-center`}></i>
    <span>{label}</span>
  </button>
);

const StatusBadge = ({ status }) => {
    const s = parseInt(status);
    const styles = [
        { label: 'Pending', color: 'bg-amber-100 text-amber-600 border-amber-200' },
        { label: 'Approved', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
        { label: 'Rejected', color: 'bg-rose-100 text-rose-600 border-rose-200' }
    ];
    const current = styles[s] || styles[0];
    return <span className={`${current.color} border px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest`}>{current.label}</span>;
};

export default AdminStudentLeave;