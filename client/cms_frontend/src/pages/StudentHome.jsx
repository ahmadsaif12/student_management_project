import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, LabelList
} from 'recharts';

const StudentHome = () => {
  const [stats, setStats] = useState({ overview: {}, breakdown: [] });
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get user info from localStorage (populated during login)
  const userName = localStorage.getItem('user_name') || 'Student User';
  const userEmail = localStorage.getItem('user_email') || 'student@portal.com';

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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Logic for Sidebar Branding and Profile Initials
  const brandName = useMemo(() => userName.split(' ')[0].toUpperCase(), [userName]);
  const initials = useMemo(() => userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2), [userName]);

  const overview = stats?.overview || {};
  const breakdown = stats?.breakdown || [];

  const pieData = [
    { name: 'Present', value: overview.present || 0, color: '#6366f1' }, // Indigo
    { name: 'Absent', value: overview.absent || 0, color: '#f1f5f9' },   // Slate 100
  ];

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em]">Syncing Academic Records</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0f172a] fixed h-full shadow-2xl z-30 hidden lg:flex flex-col">
        <div className="p-8 flex items-center gap-4 border-b border-slate-800/50">
           <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fas fa-graduation-cap text-white text-xl"></i>
           </div>
           <span className="text-white font-black text-xl tracking-tighter uppercase">
             {brandName} <span className="text-indigo-500">HUB</span>
           </span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1">
          <SectionTitle title="Academic Life" />
          <SidebarLink active={location.pathname === '/student-home'} onClick={() => navigate('/student-home')} icon="fas fa-grid-2" label="Overview" />
          <SidebarLink active={location.pathname === '/student-view-attendance'} onClick={() => navigate('/student-view-attendance')} icon="fas fa-calendar-check" label="Attendance" />
          <SidebarLink active={location.pathname === '/student-view-results'} onClick={() => navigate('/student-view-results')} icon="fas fa-medal" label="Grades" />
          
          <SectionTitle title="Support" />
          <SidebarLink active={location.pathname === '/apply-leave'} onClick={() => navigate('/apply-leave')} icon="fas fa-file-signature" label="Leave Forms" />
          <SidebarLink active={location.pathname === '/student-feedback'} onClick={() => navigate('/student-feedback')} icon="fas fa-heart" label="Feedback" />
        </nav>

        <div className="p-6">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 transition-all border border-rose-500/20">
             <i className="fas fa-power-off"></i> <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="lg:ml-72 flex-1 flex flex-col">
        
        {/* TOP NAVBAR */}
        {/* TOP NAVBAR */}
         {/* TOP NAVBAR */}
<header className="h-24 bg-white/70 backdrop-blur-2xl flex items-center justify-between px-12 border-b border-slate-200 sticky top-0 z-20">
  <div>
    <h2 className="text-indigo-600 font-black text-[9px] uppercase tracking-[0.4em] mb-1">
      Student Dashboard
    </h2>
    {/* Displays Full Name without "Welcome Back" */}
    <p className="text-slate-900 font-black text-2xl tracking-tight italic">
      {userName !== 'Student User' ? userName : 'Guest Student'}
    </p>
  </div>

  <div className="relative">
    <button 
      onClick={() => setShowProfileMenu(!showProfileMenu)} 
      className="flex items-center gap-4 bg-white hover:bg-slate-50 p-1.5 pr-6 rounded-2xl transition-all border border-slate-200 shadow-sm group"
    >
      <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
          {initials}
      </div>
      <div className="text-left hidden sm:block">
          <p className="text-xs font-black text-slate-800 leading-none">{userName}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 italic">Verified Student</p>
      </div>
    </button>
    
    {showProfileMenu && (
      <div className="absolute right-0 mt-4 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-4">
          <button onClick={() => navigate('/profile')} className="w-full text-left px-6 py-4 text-xs font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl flex items-center gap-3 transition-colors">
            <i className="fas fa-id-badge text-lg text-indigo-500"></i> Account Profile
          </button>
          <div className="h-px bg-slate-100 my-2 mx-4"></div>
          <button onClick={handleLogout} className="w-full text-left px-6 py-4 text-xs font-black text-rose-500 hover:bg-rose-50 rounded-2xl flex items-center gap-3 transition-colors">
            <i className="fas fa-power-off text-lg"></i> Sign Out Portal
          </button>
      </div>
    )}
  </div>
</header>
        {/* CONTENT */}
        <div className="p-12 max-w-[1600px] mx-auto w-full space-y-10">
          
          {/* TOP STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatBox title="Lectures Held" count={overview.total || 0} icon="fas fa-book-open" color="from-slate-900 to-slate-800" onReadMore={() => navigate('/student-view-attendance')} />
            <StatBox title="Present" count={overview.present || 0} icon="fas fa-check-circle" color="from-indigo-600 to-blue-500" onReadMore={() => navigate('/student-view-attendance')} />
            <StatBox title="Absent" count={overview.absent || 0} icon="fas fa-times-circle" color="from-rose-500 to-pink-500" onReadMore={() => navigate('/student-view-attendance')} />
            <StatBox title="Performance" count={`${overview.percent || 0}%`} icon="fas fa-rocket" color="from-emerald-600 to-teal-500" onReadMore={() => navigate('/student-view-attendance')} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* RATIO CHART */}
            <ChartCard title="Attendance Consistency" span="xl:col-span-1">
                <div className="relative h-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" cornerRadius={12}>
                              {pieData.map((e, i) => (<Cell key={i} fill={e.color} stroke="none" />))}
                          </Pie>
                          <Tooltip />
                      </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                     <p className="text-4xl font-black text-slate-800 tracking-tighter">{overview.percent || 0}%</p>
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Overall</p>
                  </div>
                </div>
            </ChartCard>

            {/* BAR CHART */}
            <ChartCard title="Performance by Subject" span="xl:col-span-2">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdown} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="subject" tick={{fontSize: 10, fontWeight: 800, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="percent" radius={[12, 12, 12, 12]} barSize={40}>
                        {breakdown.map((_, i) => (<Cell key={i} fill={i % 2 === 0 ? '#6366f1' : '#a855f7'} />))}
                        <LabelList dataKey="percent" position="top" formatter={(val) => `${val}%`} style={{fontSize: '10px', fontWeight:'900', fill:'#475569'}} offset={10} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- COMPONENTS --- */
const SectionTitle = ({ title }) => (
  <p className="px-8 mt-10 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">{title}</p>
);

const SidebarLink = ({ icon, label, active, onClick }) => (
<button onClick={onClick} className={`w-full flex items-center px-8 py-4 rounded-2xl text-[12px] font-bold transition-all mb-1 ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/40' : 'hover:bg-slate-800/50 text-slate-400 hover:text-white'}`}>
  <i className={`${icon} w-6 text-lg mr-4 ${active ? 'text-white' : 'text-slate-500'}`}></i>
  <span>{label}</span>
</button>
);

const StatBox = ({ title, count, icon, color, onReadMore }) => (
<div className={`bg-gradient-to-br ${color} rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500`}>
  <div className="relative z-10">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{title}</p>
      <h3 className="text-4xl font-black tracking-tighter mb-6">{count}</h3>
      <button onClick={onReadMore} className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all border border-white/10">
          View Stats <i className="fas fa-chevron-right ml-2 text-[8px]"></i>
      </button>
  </div>
  <i className={`${icon} absolute right-[-5%] bottom-[-5%] text-8xl opacity-10 group-hover:scale-110 transition-transform duration-700`}></i>
</div>
);

const ChartCard = ({ title, children, span = "" }) => (
<div className={`bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 relative ${span}`}>
  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">{title}</h3>
  <div className="h-72">{children}</div>
</div>
);

export default StudentHome;