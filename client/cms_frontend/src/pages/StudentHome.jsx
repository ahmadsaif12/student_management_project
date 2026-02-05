import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts';

const StudentHome = () => {
  const [stats, setStats] = useState({ overview: {}, breakdown: [] });
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  const userName = localStorage.getItem('user_name') || 'Student';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('attendance/student-stats/');
        setStats(res.data);
      } catch (err) { 
        console.error("Failed to fetch stats:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('accounts/logout/');
    } finally {
      localStorage.clear();
      navigate('/login');
    }
  };

  const breakdown = stats?.breakdown || [];
  const overview = stats?.overview || {};

  const pieData = [
    { name: 'Present', value: overview.present || 0, color: '#10b981' },
    { name: 'Absent', value: overview.absent || 0, color: '#f43f5e' },
  ];

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold animate-pulse text-xs tracking-[0.2em] uppercase">Initializing Dashboard</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside className="w-64 bg-[#1e293b] fixed h-full text-slate-300 shadow-2xl z-20">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
              <i className="fas fa-university text-white text-lg"></i>
           </div>
           <span className="text-white font-black text-xl tracking-tight">JECRC</span>
        </div>
        
        <div className="p-6 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-slate-600 text-white font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Authenticated</p>
              <p className="text-sm font-bold text-white truncate">{userName}</p>
            </div>
          </div>
        </div>

        <nav className="mt-4 px-2">
          <SidebarItem icon="fas fa-grid-2" label="Dashboard" active={true} onClick={() => navigate('/student-home')} />
          <SidebarItem icon="fas fa-calendar-check" label="My Attendance" onClick={() => navigate('/view-attendance')} />
          <SidebarItem icon="fas fa-book-open" label="My Results" onClick={() => navigate('/my-results')} />
          {/* FIXED: Added onClick to Leave Application */}
          <SidebarItem icon="fas fa-file-signature" label="Leave Application" onClick={() => navigate('/apply-leave')} />
          {/* ADDED: Feedback link */}
          <SidebarItem icon="fas fa-comment-dots" label="Feedback" onClick={() => navigate('/feedback')} />
        </nav>
      </aside>

      <main className="ml-64 flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <i className="fas fa-outdent text-slate-400 cursor-pointer hover:text-blue-600 transition-colors"></i>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Student Portal v2.0</span>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-50 rounded-full transition-all border border-transparent hover:border-slate-200"
            >
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <i className="fas fa-user-circle text-slate-500"></i>
              </div>
              <i className={`fas fa-chevron-down text-[10px] text-slate-400 transition-transform ${showSettings ? 'rotate-180' : ''}`}></i>
            </button>

            {showSettings && (
              <div className="absolute right-0 mt-3 w-52 bg-white border border-slate-200 shadow-2xl rounded-2xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                >
                  <i className="fas fa-id-badge text-slate-400"></i> My Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-3"
                >
                  <i className="fas fa-sign-out-alt"></i> Logout System
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Academic Overview</h1>
            <p className="text-slate-500 font-medium mt-1">Hello, {userName}. Here is your current attendance standing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <HomeCard title="Total Lectures" count={overview.total} color="bg-indigo-600" icon="fas fa-layer-group" onMoreInfo={() => navigate('/view-attendance')} />
            <HomeCard title="Present Count" count={overview.present} color="bg-emerald-500" icon="fas fa-user-check" onMoreInfo={() => navigate('/view-attendance')} />
            <HomeCard title="Absent Count" count={overview.absent} color="bg-rose-500" icon="fas fa-user-times" onMoreInfo={() => navigate('/view-attendance')} />
            <HomeCard title="Avg Percentage" count={`${overview.percent}%`} color="bg-amber-500" icon="fas fa-chart-line" onMoreInfo={() => navigate('/view-attendance')} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 lg:col-span-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Attendance Ratio</h3>
                <i className="fas fa-chart-pie text-slate-300"></i>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      cx="50%" cy="50%" innerRadius={70} outerRadius={90} 
                      paddingAngle={8} dataKey="value" stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Subject Performance</h3>
                <i className="fas fa-chart-bar text-slate-300"></i>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdown}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="subject" tick={{fontSize: 10, fontWeight: 700}} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="percent" fill="#6366f1" radius={[8, 8, 8, 8]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all mb-1 ${
      active 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <i className={`${icon} w-5 text-center`}></i>
    <span>{label}</span>
  </button>
);

const HomeCard = ({ title, count, color, icon, onMoreInfo }) => (
  <div className={`${color} rounded-[2rem] shadow-xl text-white p-2 relative overflow-hidden group transition-transform hover:-translate-y-1`}>
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-4xl font-black mb-1">{count}</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">{title}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <i className={`${icon} text-xl`}></i>
        </div>
      </div>
    </div>
    <button onClick={onMoreInfo} className="w-full py-4 text-[10px] font-black uppercase tracking-widest bg-black/10 hover:bg-black/20 transition-colors rounded-b-[1.8rem] flex items-center justify-center gap-2">
      View Detailed Analysis <i className="fas fa-arrow-right text-[8px]"></i>
    </button>
  </div>
);

export default StudentHome;