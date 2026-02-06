import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, AreaChart, Area, LabelList
} from 'recharts';

const StaffHome = () => {
  const [stats, setStats] = useState({ 
    total_sessions: 0, 
    total_leaves: 0,
    total_subjects: 0,
    total_students: 0,
    chart_data: [] 
  });
  
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [staffName, setStaffName] = useState(localStorage.getItem('user_name') || "Geeta");
  
  const navigate = useNavigate();
  const location = useLocation();
  const userType = localStorage.getItem('user_role');

  useEffect(() => {
    if (userType !== '2') {
      localStorage.clear();
      navigate('/login');
      return;
    }

    const loadPortalData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          axiosInstance.get('accounts/profile/'),
          axiosInstance.get('attendance/staff-stats/')
        ]);
        
        const profile = profileRes.data.my_profile || {};
        const admin = profile.admin || profile; 
        const cards = profileRes.data.cards || {};
        const attendanceData = statsRes.data || {};

        const firstName = admin.first_name || "";
        const lastName = admin.last_name || "";
        const fullName = firstName ? `${firstName} ${lastName}`.trim() : admin.username || "Geeta";

        setStaffName(fullName);
        localStorage.setItem('user_name', fullName);

        setStats({
          total_sessions: attendanceData.total_sessions || 0,
          chart_data: attendanceData.chart_data || [],
          total_leaves: cards.total_leave_taken || 0,
          total_subjects: cards.total_subjects || 0,
          total_students: cards.students_under_me || 0
        });

      } catch (err) {
        console.error("Portal Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPortalData();
  }, [userType, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const brandName = useMemo(() => staffName.split(' ')[0].toUpperCase(), [staffName]);
  const initials = useMemo(() => staffName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2), [staffName]);
  
  const pieData = useMemo(() => [
    { name: 'Completed', value: stats.total_sessions || 0, color: '#6366f1' },
    { name: 'Planned', value: Math.max(0, 100 - stats.total_sessions), color: '#f1f5f9' }
  ], [stats.total_sessions]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.4em]">Syncing {brandName}'s Workspace</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0f172a] fixed h-full shadow-2xl z-30 hidden lg:flex flex-col">
        <div className="p-8 flex items-center gap-4 border-b border-slate-800/50">
           <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fas fa-shield-check text-white text-xl"></i>
           </div>
           <span className="text-white font-black text-xl tracking-tighter uppercase">
             {brandName} <span className="text-indigo-500">STAFF</span>
           </span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <SectionTitle title="Core" />
          <SidebarLink active={location.pathname === '/staff-home'} onClick={() => navigate('/staff-home')} icon="fas fa-th-large" label="Dashboard" />
          
          <SectionTitle title="Academic" />
          <SidebarLink active={location.pathname === '/take-attendance'} onClick={() => navigate('/take-attendance')} icon="fas fa-user-check" label="Attendance" />
          <SidebarLink active={location.pathname === '/staff-add-result'} onClick={() => navigate('/staff-add-result')} icon="fas fa-poll-h" label="Results" />
          
          <SectionTitle title="Communication" />
          <SidebarLink active={location.pathname === '/staff-feedback'} onClick={() => navigate('/staff-feedback')} icon="fas fa-comment-alt-edit" label="My Feedback" badge="View" />
          <SidebarLink active={location.pathname === '/staff-leave'} onClick={() => navigate('/staff-leave')} icon="fas fa-calendar-minus" label="Leave App" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[13px] font-bold text-rose-400 hover:bg-rose-500/10 transition-all">
             <i className="fas fa-power-off"></i> <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="lg:ml-72 flex-1 flex flex-col">
        <header className="h-24 bg-white/80 backdrop-blur-xl flex items-center justify-between px-12 border-b border-slate-200 sticky top-0 z-20">
          <div>
            <h2 className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Faculty Access</h2>
            <p className="text-slate-900 font-black text-2xl tracking-tight italic">Welcome back, {staffName}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-4 bg-slate-50 hover:bg-slate-100 p-2 pr-6 rounded-3xl transition-all border border-slate-200">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200">
                    {initials}
                </div>
                <div className="text-left hidden sm:block">
                    <p className="text-sm font-black text-slate-800 leading-none">{staffName}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Department Head</p>
                </div>
                </button>
                {showProfileMenu && (
                <div className="absolute right-0 mt-4 w-60 bg-white rounded-[2rem] shadow-2xl border border-slate-100 py-3 z-50">
                    <button className="w-full text-left px-6 py-4 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3">
                    <i className="fas fa-user-circle text-indigo-500"></i> My Profile
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-6 py-4 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-3">
                    <i className="fas fa-sign-out-alt"></i> Sign Out
                    </button>
                </div>
                )}
            </div>
          </div>
        </header>

        <div className="p-12 max-w-[1600px] mx-auto w-full space-y-10">
          {/* STAT CARDS WITH "READ MORE" ACTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatBox 
                title="Total Subjects" 
                count={stats.total_subjects} 
                icon="fas fa-book-open" 
                color="from-indigo-600 to-blue-500" 
                onReadMore={() => navigate('/staff-view-attendance')}
            />
            <StatBox 
                title="Completed Sessions" 
                count={stats.total_sessions} 
                icon="fas fa-check-double" 
                color="from-emerald-500 to-teal-400" 
                onReadMore={() => navigate('/staff-view-attendance')}
            />
            <StatBox 
                title="Leave Balance" 
                count={stats.total_leaves} 
                icon="fas fa-calendar-day" 
                color="from-rose-500 to-orange-400" 
                onReadMore={() => navigate('/staff-leave')}
            />
            <StatBox 
                title="Total Students" 
                count={stats.total_students} 
                icon="fas fa-user-graduate" 
                color="from-slate-800 to-slate-700" 
                onReadMore={() => navigate('/take-attendance')}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* PROGRESS CHART */}
            <ChartCard title="Syllabus Progress" span="xl:col-span-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={75} outerRadius={100} paddingAngle={10} dataKey="value" cornerRadius={15}>
                            {pieData.map((e, i) => (<Cell key={i} fill={e.color} stroke="none" />))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                   <p className="text-3xl font-black text-slate-800">{stats.total_sessions}%</p>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Efficiency</p>
                </div>
            </ChartCard>

            {/* AREA CHART */}
            <ChartCard title="Weekly Attendance Flow" span="xl:col-span-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.chart_data}>
                        <defs>
                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="subject_name" tick={{fontSize: 10, fontWeight: 700}} axisLine={false} />
                        <YAxis tick={{fontSize: 10}} axisLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} fill="url(#areaGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* BAR CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            <ChartCard title="Subject-wise Analytics">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chart_data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="subject_name" tick={{fontSize: 10, fontWeight: 700}} axisLine={false} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="count" radius={[15, 15, 0, 0]} barSize={45}>
                        {stats.chart_data.map((_, i) => (<Cell key={i} fill={i % 2 === 0 ? '#6366f1' : '#f43f5e'} />))}
                        <LabelList dataKey="count" position="top" style={{fontSize: '11px', fontWeight:'900', fill:'#1e293b'}} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Distribution Metrics">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chart_data} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="subject_name" tick={{fontSize: 10, fontWeight: 700}} width={90} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0f172a" radius={[0, 20, 20, 0]} barSize={22} />
                  </BarChart>
                </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- REUSABLE COMPONENTS --- */
const SectionTitle = ({ title }) => (
    <p className="px-6 mt-10 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{title}</p>
);

const SidebarLink = ({ icon, label, active, onClick, badge }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[13px] font-bold transition-all mb-1 ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
    <div className="flex items-center gap-4">
        <i className={`${icon} w-5 text-center text-lg`}></i>
        <span>{label}</span>
    </div>
    {badge && <span className="bg-indigo-500/20 text-indigo-400 text-[9px] px-2 py-1 rounded-lg uppercase tracking-tighter">{badge}</span>}
  </button>
);

const StatBox = ({ title, count, icon, color, onReadMore }) => (
  <div className={`bg-gradient-to-br ${color} rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.02]`}>
    <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">{title}</p>
        <h3 className="text-5xl font-black tracking-tighter mb-6">{count}</h3>
        <button onClick={onReadMore} className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
            Read More <i className="fas fa-arrow-right ml-2"></i>
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

export default StaffHome;