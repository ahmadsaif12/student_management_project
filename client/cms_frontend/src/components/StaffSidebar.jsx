import React from 'react';
import { useNavigate } from 'react-router-dom';

const StaffSidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-slate-900 fixed h-full text-slate-300 shadow-xl z-20">
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
         <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-chalkboard-teacher text-white"></i>
         </div>
         <span className="text-white font-bold text-lg">Staff CMS</span>
      </div>
      <nav className="mt-4">
        <div onClick={() => navigate('/staff-home')} className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800 cursor-pointer">
          <i className="fas fa-home w-5"></i>
          <span>Dashboard</span>
        </div>
        <div onClick={() => navigate('/staff-view-attendance')} className="flex items-center gap-3 px-6 py-4 bg-indigo-600 text-white shadow-inner cursor-pointer">
          <i className="fas fa-calendar-check w-5"></i>
          <span>Attendance Records</span>
        </div>
        <div onClick={() => navigate('/add-result')} className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800 cursor-pointer">
          <i className="fas fa-plus-circle w-5"></i>
          <span>Add Results</span>
        </div>
      </nav>
    </aside>
  );
};

export default StaffSidebar;