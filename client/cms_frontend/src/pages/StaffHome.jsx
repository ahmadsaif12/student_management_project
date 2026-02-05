import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const StaffHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchStaffStats = async () => {
      try {
        // This endpoint links to StaffAttendanceStats in your views.py
        const res = await axiosInstance.get('attendance/staff-stats/');
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching staff stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaffStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#f4f6f9] text-gray-400 font-bold tracking-widest">LOADING STAFF DASHBOARD...</div>;

  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#343a40] fixed h-full text-[#c2c7d0] shadow-lg z-20">
        <div className="p-4 border-b border-[#4b545c] flex items-center gap-3 text-white text-lg font-bold">JECRC</div>
        <nav className="py-2">
          {[
            { name: 'Home', path: '/staff-home', icon: 'fas fa-tachometer-alt' },
            { name: 'Take Attendance', path: '/take-attendance', icon: 'fas fa-calendar-check' },
            { name: 'View Attendance', path: '/view-attendance', icon: 'fas fa-calendar-alt' },
            { name: 'Feedback', path: '/student-feedback', icon: 'fas fa-comment-dots' },
          ].map((item, i) => (
            <button key={i} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${location.pathname === item.path ? 'bg-[#007bff] text-white shadow-md' : 'hover:bg-[#494e53] hover:text-white'}`}>
              <i className={`${item.icon} w-5 text-center`}></i>
              <span className="font-light">{item.name}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-4 mt-10 text-sm text-red-400 hover:bg-red-500 hover:text-white border-t border-[#4b545c]">
            <i className="fas fa-sign-out-alt w-5 text-center"></i> Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1">
        <header className="bg-white p-4 shadow-sm border-b sticky top-0 z-10 flex justify-between items-center text-sm font-medium uppercase text-gray-500">
           Staff Management System
        </header>

        <div className="p-6">
          <h1 className="text-2xl font-light text-gray-800 mb-6">Staff Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            <StatBox title="Total Sessions Conducted" count={stats?.total_sessions || 0} color="bg-[#17a2b8]" icon="fas fa-chalkboard-teacher" onViewMore={() => navigate('/view-attendance')} />
            <StatBox title="Assigned Subjects" count={stats?.chart_data?.length || 0} color="bg-[#28a745]" icon="fas fa-book" onViewMore={() => navigate('/view-attendance')} />
          </div>

          <ChartCard title="Sessions per Subject" headerColor="bg-[#343a40]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.chart_data || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="subject_name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Bar dataKey="count" name="Sessions Taken" fill="#007bff" barSize={50} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>
    </div>
  );
};

const StatBox = ({ title, count, color, icon, onViewMore }) => (
  <div className={`${color} text-white rounded shadow-md relative overflow-hidden transition-transform hover:scale-[1.01]`}>
    <div className="p-6">
      <h3 className="text-4xl font-bold mb-1">{count}</h3>
      <p className="text-sm uppercase font-medium opacity-80">{title}</p>
      <i className={`${icon} text-6xl opacity-10 absolute right-4 top-4`}></i>
    </div>
    <button onClick={onViewMore} className="bg-black/10 w-full py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-black/20">More info</button>
  </div>
);

const ChartCard = ({ title, headerColor, children }) => (
  <div className="bg-white rounded border border-gray-200 shadow-sm">
    <div className={`${headerColor} px-4 py-2 text-white text-xs font-bold uppercase tracking-widest`}>{title}</div>
    <div className="h-80 p-6">{children}</div>
  </div>
);

export default StaffHome;