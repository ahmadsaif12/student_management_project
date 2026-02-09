import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid, LabelList
} from 'recharts';

const StudentHome = () => {
  const [stats, setStats] = useState({ overview: {}, breakdown: [] });
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const brandName = useMemo(() => userName.split(' ')[0].toUpperCase(), [userName]);
  const initials = useMemo(() => userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2), [userName]);

  const overview = stats?.overview || {};
  const breakdown = stats?.breakdown || [];

  const pieData = [
    { name: 'Present', value: overview.present || 0, color: '#10b981' },
    { name: 'Absent', value: overview.absent || 0, color: '#f1f5f9' }, // Using slate for "empty" feel
  ];

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.4em]">Initializing Student Workspace</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-900">
      {/* SIDEBAR - Styled like StaffHome */}
      <aside className="w-72 bg-[#0f172a] fixed h-full shadow-2xl z-30 hidden lg:flex flex-col">
        <div className="p-8 flex items-center gap-4 border-b border-slate-800/50">
           <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <i className="fas fa-user-graduate text-white text-xl"></i>
           </div>
           <span className="text-white font-black text-xl tracking-tighter uppercase">
             {brandName} <span className="text-blue-500">PORTAL</span>
           </span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <SectionTitle title="Learning" />
          <SidebarLink active={location.pathname === '/student-home'} onClick={() => navigate('/student-home')} icon="fas fa-th-large" label="Dashboard" />
          <SidebarLink active={location.pathname === '/student-view-attendance'} onClick={() => navigate('/student-view-attendance')} icon="fas fa-calendar-check" label="My Attendance" />
          <SidebarLink active={location.pathname === '/student-view-results'} onClick={() => navigate('/student-view-results')} icon="fas fa-award" label="Academic Results" />
          
          <SectionTitle title="Self Service" />
          <SidebarLink active={location.pathname === '/apply-leave'} onClick={() => navigate('/apply-leave')} icon="fas fa-envelope-open-text" label="Leave Request" />
          <SidebarLink active={location.pathname === '/student-feedback'} onClick={() => navigate('/student-feedback')} icon="fas fa-comment-alt-heart" label="Feedback" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[13px] font-bold text-rose-400 hover:bg-rose-500/10 transition-all">
             <i className="fas fa-power-off"></i> <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="lg:ml-72 flex-1 flex flex-col">
        <header className="h-24 bg-white/80 backdrop-blur-xl flex items-center justify-between px-12 border-b border-slate-200 sticky top-0 z-20">
          <div>
            <h2 className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Student Access</h2>
            <p className="text-slate-900 font-black text-2xl tracking-tight italic">Greetings, {userName}</p>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-4 bg-slate-50 hover:bg-slate-100 p-2 pr-6 rounded-3xl transition-all border border-slate-200">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">
                  {initials}
              </div>
              <div className="text-left hidden sm:block">
                  <p className="text-sm font-black text-slate-800 leading-none">{userName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Undergraduate</p>
              </div>
            </button>
            {showProfileMenu && (
              <div className="absolute right-12 mt-48 w-60 bg-white rounded-[2rem] shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <button onClick={() => navigate('/profile')} className="w-full text-left px-6 py-4 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3">
                    <i className="fas fa-id-card text-blue-500"></i> View Profile
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-6 py-4 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-3">
                    <i className="fas fa-sign-out-alt"></i> Sign Out
                  </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-12 max-w-[1600px] mx-auto w-full space-y-10">
          {/* STAT BOXES - Gradient Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatBox title="Total Lectures" count={overview.total || 0} icon="fas fa-layer-group" color="from-indigo-600 to-blue-500" onReadMore={() => navigate('/student-view-attendance')} />
            <StatBox title="Present Days" count={overview.present || 0} icon="fas fa-user-check" color="from-emerald-500 to-teal-400" onReadMore={() => navigate('/student-view-attendance')} />
            <StatBox title="Absent Days" count={overview.absent || 0} icon="fas fa-user-times" color="from-rose-500 to-orange-400" onReadMore={() => navigate('/student-view-attendance')} />
            <StatBox title="Avg Percentage" count={`${overview.percent || 0}%`} icon="fas fa-chart-line" color="from-slate-800 to-slate-700" onReadMore={() => navigate('/student-view-attendance')} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* PIE CHART */}
            <ChartCard title="Attendance Ratio" span="xl:col-span-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={75} outerRadius={100} paddingAngle={10} dataKey="value" cornerRadius={15}>
                            {pieData.map((e, i) => (<Cell key={i} fill={e.color} stroke="none" />))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                   <p className="text-3xl font-black text-slate-800">{overview.percent || 0}%</p>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Attendance</p>
                </div>
            </ChartCard>

            {/* BAR CHART */}
            <ChartCard title="Subject-wise Standing" span="xl:col-span-2">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdown}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="subject" tick={{fontSize: 10, fontWeight: 700}} axisLine={false} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="percent" radius={[15, 15, 0, 0]} barSize={45}>
                        {breakdown.map((_, i) => (<Cell key={i} fill={i % 2 === 0 ? '#6366f1' : '#3b82f6'} />))}
                        <LabelList dataKey="percent" position="top" formatter={(val) => `${val}%`} style={{fontSize: '11px', fontWeight:'900', fill:'#1e293b'}} />
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

/* --- SHARED COMPONENTS (Mirrored from StaffHome) --- */
const SectionTitle = ({ title }) => (
  <p className="px-6 mt-10 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{title}</p>
);

const SidebarLink = ({ icon, label, active, onClick, badge }) => (
<button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[13px] font-bold transition-all mb-1 ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
  <div className="flex items-center gap-4">
      <i className={`${icon} w-5 text-center text-lg`}></i>
      <span>{label}</span>
  </div>
  {badge && <span className="bg-blue-500/20 text-blue-400 text-[9px] px-2 py-1 rounded-lg uppercase tracking-tighter">{badge}</span>}
</button>
);

const StatBox = ({ title, count, icon, color, onReadMore }) => (
<div className={`bg-gradient-to-br ${color} rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.02]`}>
  <div className="relative z-10">
      <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">{title}</p>
      <h3 className="text-5xl font-black tracking-tighter mb-6">{count}</h3>
      <button onClick={onReadMore} className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
          Details <i className="fas fa-arrow-right ml-2"></i>
      </button>
  </div>
  <div className="absolute right-[-10%] bottom-[-10%] opacity-20 group-hover:scale-125 transition-transform duration-700">
      <i className={`${icon} text-[8rem]`}></i>
  </div>
</div>
);

const ChartCard = ({ title, children, span = "" }) => (
<div className={`bg-white rounded-[3.5rem] shadow-sm border border-slate-100 p-12 relative ${span} hover:shadow-lg transition-all`}>
  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 border-b border-slate-50 pb-6">{title}</h3>
  <div className="h-72">{children}</div>
</div>
);

export default StudentHome;