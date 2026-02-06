import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const StaffHome = () => {
  const [stats, setStats] = useState({ 
    total_sessions: 0, 
    total_students: 0, 
    total_leaves: 0, 
    total_subjects: 0, 
    chart_data: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const userName = localStorage.getItem('user_name') || 'Staff Member';
  const userType = localStorage.getItem('user_role'); 
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  useEffect(() => {
    // SECURITY GUARD: Ensure only Staff (Role 2) can see this
    if (userType !== '2') {
        localStorage.clear();
        navigate('/login');
        return;
    }

    const fetchStaffStats = async () => {
      try {
        const res = await axiosInstance.get('attendance/staff-stats/');
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
        setError("Could not retrieve faculty records.");
      } finally {
        setLoading(false);
      }
    };
    fetchStaffStats();
  }, [userType, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase">Initializing Portal</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0f172a] fixed h-full text-slate-400 shadow-2xl z-30 hidden lg:block border-r border-slate-800 overflow-y-auto">
        <div className="p-8 flex items-center gap-4 sticky top-0 bg-[#0f172a] z-10">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-chalkboard-teacher text-white"></i>
           </div>
           <span className="text-white font-black text-lg uppercase tracking-tighter">Staff <span className="text-indigo-500">Dash</span></span>
        </div>
        
        <nav className="py-6 px-4 space-y-1">
          <SectionTitle title="Main" />
          <SidebarLink active={location.pathname === '/staff-home'} onClick={() => navigate('/staff-home')} icon="fas fa-th-large" label="Dashboard" />
          
          <SectionTitle title="Attendance" />
          <SidebarLink active={location.pathname === '/take-attendance'} onClick={() => navigate('/take-attendance')} icon="fas fa-calendar-check" label="Take Attendance" />
          <SidebarLink active={location.pathname === '/staff-view-attendance'} onClick={() => navigate('/staff-view-attendance')} icon="fas fa-eye" label="View Attendance" />
          
          <SectionTitle title="Results" />
          <SidebarLink active={location.pathname === '/staff-add-result'} onClick={() => navigate('/staff-add-result')} icon="fas fa-plus-circle" label="Add Result" />
          <SidebarLink active={location.pathname === '/staff-view-results'} onClick={() => navigate('/staff-view-results')} icon="fas fa-poll" label="View Results" />

          <SectionTitle title="Personal" />
          <SidebarLink active={location.pathname === '/staff-leave'} onClick={() => navigate('/staff-leave')} icon="fas fa-envelope-open-text" label="Apply Leave" />
          <SidebarLink active={location.pathname === '/staff-feedback'} onClick={() => navigate('/staff-feedback')} icon="fas fa-comment-dots" label="Feedback" />
          
          <div className="pt-10 pb-10 border-t border-slate-800 mt-10">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[13px] font-bold text-rose-400 hover:bg-rose-500/10 transition-all">
               <i className="fas fa-power-off w-5 text-center"></i> <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="lg:ml-72 flex-1">
        <header className="bg-white/80 backdrop-blur-md h-20 flex items-center justify-between px-10 border-b border-slate-200 sticky top-0 z-20">
          <div>
            <h2 className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Faculty System</h2>
            <p className="text-slate-800 font-black text-sm uppercase">Welcome, {userName}</p>
          </div>

          <div className="relative">
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-2xl transition-all">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-800 leading-none">{userName}</p>
                <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Teaching Staff</p>
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">
                {userInitials}
              </div>
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50">
                <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-3">
                  <i className="fas fa-power-off"></i> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-500 text-xs font-bold rounded-2xl flex items-center gap-3">
              <i className="fas fa-exclamation-triangle"></i> {error}
            </div>
          )}

          {/* STAT CARDS - Pointing to Staff Routes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatBox 
                title="Students Under Me" 
                count={stats.total_students} 
                icon="fas fa-users" 
                color="from-blue-600 to-indigo-500" 
                onMore={() => navigate('/staff-view-attendance')} 
            />
            <StatBox 
                title="Sessions Taken" 
                count={stats.total_sessions} 
                icon="fas fa-check-double" 
                color="from-emerald-500 to-teal-600" 
                onMore={() => navigate('/staff-view-attendance')} 
            />
            <StatBox 
                title="Leaves Taken" 
                count={stats.total_leaves} 
                icon="fas fa-calendar-minus" 
                color="from-rose-500 to-pink-600" 
                onMore={() => navigate('/staff-leave')} 
            />
            <StatBox 
                title="Total Subjects" 
                count={stats.total_subjects || stats.chart_data?.length || 0} 
                icon="fas fa-book" 
                color="from-amber-500 to-orange-600" 
                onMore={() => navigate('/staff-view-results')} 
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            <ChartCard title="Leave vs Attendance Ratio">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{name: 'Stats', attendance: stats.total_sessions, leave: stats.total_leaves}]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" hide />
                        <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="attendance" fill="#6366f1" radius={[10, 10, 0, 0]} name="Attendance" barSize={60} />
                        <Bar dataKey="leave" fill="#f43f5e" radius={[10, 10, 0, 0]} name="Leave" barSize={60} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Subject Load Analysis">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chart_data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="subject_name" tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                        {stats.chart_data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#f59e0b'} />
                        ))}
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

/* --- SHARED STYLING COMPONENTS --- */

const SectionTitle = ({ title }) => (
    <p className="px-5 mt-8 mb-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</p>
);

const SidebarLink = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[13px] font-bold transition-all mb-1 ${
      active 
      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
      : 'hover:bg-slate-800 text-slate-400 hover:text-white'
    }`}
  >
    <i className={`${icon} w-5 text-center`}></i>
    <span>{label}</span>
  </button>
);

const StatBox = ({ title, count, icon, color, onMore }) => (
  <div className={`bg-gradient-to-br ${color} rounded-[2rem] p-8 text-white shadow-xl group relative overflow-hidden transition-all hover:scale-[1.02]`}>
    <i className={`${icon} absolute -right-4 -top-4 text-9xl opacity-10 group-hover:scale-110 transition-transform duration-500`}></i>
    <div className="relative z-10">
        <h3 className="text-5xl font-black tracking-tighter mb-1">{count}</h3>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-6">{title}</p>
        <button 
            onClick={onMore} 
            className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase border border-white/30 hover:bg-white hover:text-slate-900 transition-all"
        >
            View Details
        </button>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10">
    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-10 border-b border-slate-50 pb-6">{title}</h3>
    <div className="h-72">{children}</div>
  </div>
);

export default StaffHome;