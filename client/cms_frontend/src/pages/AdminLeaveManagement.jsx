import React, { useState, useEffect } from 'react';
import { 
  getAdminStudentLeaves, 
  getAdminStaffLeaves, 
  updateLeaveStatus 
} from '../api/authService';

const AdminLeaveManagement = ({ type = 'staff' }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      // Logic to call the correct function based on the 'type' prop
      const data = type === 'staff' 
        ? await getAdminStaffLeaves() 
        : await getAdminStudentLeaves();
      setLeaves(data);
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await updateLeaveStatus(id, type, status);
      // Refresh local state without a full page reload for better UX
      setLeaves(prev => prev.map(l => 
        l.id === id ? { ...l, leave_status: status } : l
      ));
    } catch (err) {
      alert("Failed to update status: " + (err.error || "Server Error"));
    }
  };

  useEffect(() => { 
    fetchLeaves(); 
  }, [type]);

  const StatusBadge = ({ status }) => {
    const styles = {
      1: "bg-emerald-100 text-emerald-600 border-emerald-200",
      2: "bg-rose-100 text-rose-600 border-rose-200",
      0: "bg-amber-100 text-amber-600 border-amber-200"
    };
    const labels = { 1: "Approved", 2: "Rejected", 0: "Pending" };
    
    return (
      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-10 lg:ml-72">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            {type === 'staff' ? 'Staff' : 'Student'} Leave Management
          </h1>
          <p className="text-slate-500 font-medium">Review and process absence requests</p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <th className="px-8 py-6">Applicant</th>
                <th className="px-8 py-6">Leave Date</th>
                <th className="px-8 py-6 w-1/3">Reason</th>
                <th className="px-8 py-6 text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Requests...</p>
                  </td>
                </tr>
              ) : leaves.length > 0 ? (
                leaves.map((l) => (
                  <tr key={l.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-7">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-sm uppercase tracking-tight">
                          {l.name || l.student_name || l.staff_name || "Unknown User"}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">ID: #{l.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg font-bold text-slate-600 text-[11px]">
                        {l.leave_date}
                      </span>
                    </td>
                    <td className="px-8 py-7">
                      <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                        "{l.leave_message}"
                      </p>
                    </td>
                    <td className="px-8 py-7 text-right">
                      {l.leave_status === 0 ? (
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => handleAction(l.id, 1)} 
                            className="group/btn flex items-center justify-center w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-90"
                            title="Approve"
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button 
                            onClick={() => handleAction(l.id, 2)} 
                            className="group/btn flex items-center justify-center w-11 h-11 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-200 transition-all active:scale-90"
                            title="Reject"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ) : (
                        <StatusBadge status={l.leave_status} />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-32 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-200">
                      <i className="fas fa-inbox text-slate-200 text-2xl"></i>
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No pending applications</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaveManagement;