import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser, getUserProfile, getStaffList } from '../api/authService';
import { getCourses, getSubjects } from '../api/curriculumService';
import { Pie, Doughnut, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, Tooltip, Legend, 
  CategoryScale, LinearScale, BarElement 
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userProfile, setUserProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // viewMode handles: 'dashboard', 'staff_list', 'course_list', 'student_list', 'subject_list'
  const [viewMode, setViewMode] = useState('dashboard'); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, courseData, subjectData, staffData] = await Promise.all([
          getUserProfile(),
          getCourses(),
          getSubjects(),
          getStaffList()
        ]);

        setUserProfile(profileData);
        setCourses(Array.isArray(courseData) ? courseData : []);
        setSubjects(Array.isArray(subjectData) ? subjectData : []);
        setStaff(Array.isArray(staffData) ? staffData : []);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    localStorage.clear();
    navigate('/login');
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#64748b', font: { weight: '700', size: 10 }, usePointStyle: true } }
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase">Syncing Records</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0f172a] fixed h-full text-slate-400 shadow-2xl z-30 hidden lg:block border-r border-slate-800 overflow-y-auto">
        <div className="p-8 flex items-center gap-4 bg-[#1e293b]/20 sticky top-0 bg-[#0f172a] z-10">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-shield-alt text-white"></i>
           </div>
           <span className="text-white font-black text-lg">CORE <span className="text-indigo-500">CMS</span></span>
        </div>
        
        <nav className="py-6 px-4 space-y-1">
          <SectionTitle title="Overview" />
          <SidebarLink active={viewMode === 'dashboard'} onClick={() => setViewMode('dashboard')} icon="fas fa-th-large" label="Dashboard" />
          
          <SectionTitle title="Management" />
          <SidebarLink onClick={() => navigate('/manage-staff')} icon="fas fa-user-tie" label="Staff" />
          <SidebarLink onClick={() => navigate('/manage-student')} icon="fas fa-user-graduate" label="Students" />
          <SidebarLink onClick={() => navigate('/manage-course')} icon="fas fa-layer-group" label="Courses" />
          <SidebarLink onClick={() => navigate('/manage-subject')} icon="fas fa-book" label="Subjects" />
          <SidebarLink onClick={() => navigate('/manage-session')} icon="fas fa-calendar-alt" label="Sessions" />
          
          <SectionTitle title="Requests" />
          <SidebarLink onClick={() => navigate('/manage-staff-leaves')} icon="fas fa-calendar-minus" label="Staff Leaves" />
          <SidebarLink onClick={() => navigate('/manage-student-leaves')} icon="fas fa-envelope-open-text" label="Student Leaves" />
          <SidebarLink onClick={() => navigate('/feedback')} icon="fas fa-comment-dots" label="Feedback" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="lg:ml-72 flex-1">
        <header className="bg-white/80 backdrop-blur-md h-20 flex items-center justify-between px-10 border-b border-slate-200 sticky top-0 z-20">
          <div>
            <h2 className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">System Control</h2>
            <p className="text-slate-800 font-black text-sm uppercase">{userProfile?.first_name} Admin</p>
          </div>

          {/* RIGHT TOP PROFILE SETTINGS */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-2xl transition-all"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-800 leading-none">{userProfile?.first_name} {userProfile?.last_name}</p>
                <p className="text-[9px] font-bold text-indigo-500 uppercase">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">
                {userProfile?.first_name?.charAt(0).toUpperCase()}
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <button onClick={() => navigate('/profile')} className="w-full text-left px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3">
                  <i className="fas fa-user-cog text-indigo-500"></i> Profile Settings
                </button>
                <button onClick={() => navigate('/profile')} className="w-full text-left px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3">
                  <i className="fas fa-sync text-emerald-500"></i> Update Records
                </button>
                <div className="h-px bg-slate-100 my-2"></div>
                <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-3">
                  <i className="fas fa-power-off"></i> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto">
          {viewMode === 'dashboard' ? (
            <>
              {/* STAT CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <StatBox title="Active Students" count={userProfile?.dashboard_stats?.total_students || 0} icon="fas fa-user-graduate" color="from-blue-600 to-indigo-500" onMore={() => setViewMode('student_list')} />
                <StatBox title="Total Staff" count={staff.length} icon="fas fa-user-tie" color="from-rose-500 to-pink-600" onMore={() => setViewMode('staff_list')} />
                <StatBox title="Live Courses" count={courses.length} icon="fas fa-university" color="from-amber-500 to-orange-600" onMore={() => setViewMode('course_list')} />
                <StatBox title="Subjects" count={subjects.length} icon="fas fa-book" color="from-emerald-500 to-teal-600" onMore={() => setViewMode('subject_list')} />
              </div>

              {/* CHARTS ROW 1 */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mb-10">
                <ChartCard title="Workforce Composition">
                   <Pie data={{ labels: ['Students', 'Staffs'], datasets: [{ data: [userProfile?.dashboard_stats?.total_students || 0, staff.length], backgroundColor: ['#6366f1', '#10b981'], borderWidth: 0 }] }} options={chartOptions} />
                </ChartCard>
                <ChartCard title="Subject Distribution">
                   <Doughnut data={{ labels: courses.map(c => c.course_name || c.name), datasets: [{ data: courses.map(c => subjects.filter(s => String(s.course_id) === String(c.id)).length), backgroundColor: ['#8b5cf6', '#ec4899', '#f59e0b', '#3b82f6'], borderWidth: 0 }] }} options={chartOptions} />
                </ChartCard>
              </div>

              {/* CHARTS ROW 2 - Bar Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <ChartCard title="Students per Course">
                   <Bar 
                    data={{
                      labels: courses.map(c => c.course_name || c.name),
                      datasets: [{ label: 'Students', data: courses.map(() => Math.floor(Math.random() * 50) + 10), backgroundColor: '#6366f1', borderRadius: 8 }]
                    }} 
                    options={chartOptions} 
                   />
                </ChartCard>
                <ChartCard title="Subject Engagement">
                   <Bar 
                    data={{
                      labels: subjects.slice(0, 6).map(s => s.subject_name),
                      datasets: [{ label: 'Enrollment', data: subjects.slice(0, 6).map(() => Math.floor(Math.random() * 30) + 5), backgroundColor: '#10b981', borderRadius: 8 }]
                    }} 
                    options={chartOptions} 
                   />
                </ChartCard>
              </div>
            </>
          ) : (
            <DataList 
              title={viewMode.replace('_', ' ').toUpperCase()} 
              data={viewMode === 'staff_list' ? staff : viewMode === 'course_list' ? courses : viewMode === 'subject_list' ? subjects : []} 
              type={viewMode.split('_')[0]} 
              onBack={() => setViewMode('dashboard')} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

/* --- UI HELPERS --- */

const SectionTitle = ({ title }) => (
  <p className="px-4 mt-8 mb-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</p>
);

const SidebarLink = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[13px] font-bold transition-all duration-300 mb-1 ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
    <i className={`${icon} w-5 text-center text-lg`}></i>
    <span className="tracking-tight">{label}</span>
  </button>
);

const StatBox = ({ title, count, icon, color, onMore }) => (
  <div className={`bg-gradient-to-br ${color} rounded-[2.5rem] p-8 text-white shadow-xl relative group hover:scale-[1.02] transition-transform duration-300`}>
    <div className="flex justify-between items-start mb-6">
      <h3 className="text-5xl font-black tracking-tighter">{count}</h3>
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30">
        <i className={`${icon} text-xl`}></i>
      </div>
    </div>
    <div className="flex justify-between items-end">
      <p className="text-[11px] font-black uppercase tracking-widest opacity-80">{title}</p>
      {onMore && (
        <button onClick={onMore} className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-lg hover:shadow-white/20 transition-all">
          View List
        </button>
      )}
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-10 border-b border-slate-50 pb-6">{title}</h3>
    <div className="h-72">{children}</div>
  </div>
);

const DataList = ({ title, data, type, onBack }) => (
  <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
    <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
      <button onClick={onBack} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">← Back Home</button>
    </div>
    <table className="w-full text-left">
      <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <tr>
          <th className="px-10 py-6">Record Name</th>
          <th className="px-10 py-6">Identity/Email</th>
          <th className="px-10 py-6">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.length > 0 ? data.map((item, idx) => (
          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-10 py-6 font-black text-slate-700">
                {item.first_name ? `${item.first_name} ${item.last_name}` : (item.course_name || item.subject_name)}
            </td>
            <td className="px-10 py-6 text-sm text-slate-500 font-medium">{item.email || `#${item.id}`}</td>
            <td className="px-10 py-6"><span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Active</span></td>
          </tr>
        )) : (
          <tr><td colSpan="3" className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">No Records Found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

export default AdminDashboard;