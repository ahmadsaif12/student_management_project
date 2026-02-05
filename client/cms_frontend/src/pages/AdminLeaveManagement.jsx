import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AdminLeaveManagement = ({ type }) => { // type = 'staff' or 'student'
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    // Assuming you created a GET endpoint for Admin to see all pending leaves
    const res = await axiosInstance.get(`operations/admin-leaves/?type=${type}`);
    setLeaves(res.data);
  };

  const handleAction = async (id, status) => {
    await axiosInstance.post('operations/admin-leave-action/', {
      leave_id: id,
      type: type,
      status: status // 1 for Approve, 2 for Reject
    });
    fetchLeaves();
  };

  useEffect(() => { fetchLeaves(); }, [type]);

  return (
    <div className="p-8 ml-64">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-5">Applicant</th>
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5 w-1/2">Reason</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                <td className="px-8 py-6 font-black text-slate-700 text-sm">{l.name}</td>
                <td className="px-8 py-6 font-bold text-slate-400 text-xs uppercase">{l.leave_date}</td>
                <td className="px-8 py-6 text-sm font-medium text-slate-600">{l.leave_message}</td>
                <td className="px-8 py-6 text-right">
                  {l.leave_status === 0 ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleAction(l.id, 1)} className="p-2 w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><i className="fas fa-check"></i></button>
                      <button onClick={() => handleAction(l.id, 2)} className="p-2 w-10 h-10 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><i className="fas fa-times"></i></button>
                    </div>
                  ) : (
                    <StatusBadge status={l.leave_status} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminLeaveManagement