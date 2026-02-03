import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser, getUserProfile } from '../api/authService';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUserProfile(data);
      } catch (err) {
        console.error("Auth failed", err);
        localStorage.clear();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try { await logoutUser(); } 
    catch (err) { console.error(err); } 
    finally { 
      localStorage.clear(); 
      navigate('/login'); 
    }
  };

  // --- DATA PREPARATION (Matching your screenshots) ---

  // Top Left: Student and Staff Ratio
  const studentStaffData = [
    { name: 'Students', value: userProfile?.dashboard_stats?.total_students || 12 },
    { name: 'Staffs', value: userProfile?.dashboard_stats?.total_staffs || 17 },
  ];

  // Top Right: Total Subjects in Each Course (Donut Chart)
  const subjectCourseData = [
    { name: 'B.Tech', value: 12 }, { name: 'M.Tech', value: 8 },
    { name: 'B.Arch', value: 5 }, { name: 'BCA', value: 15 },
    { name: 'BDS', value: 10 }, { name: 'BPharma', value: 6 },
    { name: 'B.Sc', value: 9 }, { name: 'Diploma', value: 4 },
  ];

  // Bottom Left: Total Student in Each Course (Bar Chart)
  const studentsPerCourseData = [
    { name: 'B.Tech', students: 120, color: '#ff4d4d' },
    { name: 'M.Tech', students: 80, color: '#28a745' },
    { name: 'BCA', students: 150, color: '#17a2b8' },
    { name: 'B.Sc', students: 90, color: '#ffc107' },
    { name: 'Diploma', students: 60, color: '#6c757d' },
  ];

  // Bottom Right: Total Students in Each Subject (Bar Chart)
  const studentsPerSubjectData = [
    { name: 'DBMS', students: 40, color: '#007bff' },
    { name: 'Networking', students: 35, color: '#28a745' },
    { name: 'Theory', students: 50, color: '#ffc107' },
    { name: 'AI', students: 45, color: '#17a2b8' },
    { name: 'OS', students: 30, color: '#e83e8c' },
  ];

  const PIE_COLORS = ['#ff4d4d', '#28a745', '#ffc107', '#17a2b8', '#007bff', '#6c757d', '#e83e8c'];

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#f4f6f9]">Loading Dashboard...</div>;

  return (
    <div className="flex min-h-screen bg-[#f4f6f9] font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#343a40] text-[#c2c7d0] flex flex-col fixed h-full shadow-xl z-20 overflow-hidden">
        <div className="p-4 border-b border-[#4b545c] flex items-center gap-3 bg-[#343a40]">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold text-xs shadow-md shrink-0">JECRC</div>
          <span className="text-white font-semibold tracking-wide">Admin Panel</span>
        </div>
        
        {/* Profile */}
        <div className="p-4 flex items-center gap-3 border-b border-[#4b545c]">
          <div className="w-9 h-9 rounded-full bg-gray-600 overflow-hidden border border-gray-700 shrink-0">
             <img src={userProfile?.my_profile?.admin?.profile_pic || "https://via.placeholder.com/32"} alt="pfp" className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-medium text-white truncate">
            {userProfile?.my_profile?.admin ? `${userProfile.my_profile.admin.first_name} ${userProfile.my_profile.admin.last_name}` : "Sarah Jenkins"}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
            {[
              { name: 'Home', icon: '🏠' },
              { name: 'Manage Staff', icon: '👨‍🏫' },
              { name: 'Add Staff', icon: '➕' },
              { name: 'Manage Student', icon: '🎓' },
              { name: 'Add Student', icon: '➕' },
              { name: 'Manage Student', icon: '➕' },
              { name: 'Manage Course', icon: '📖' },
               { name: 'Add Course', icon: '📖' },
              { name: 'Manage Subject', icon: '📚' },
              { name: 'Manage Session', icon: '📅' },
              { name: 'Add Session', icon: '📋' },
              { name: 'View Attendance', icon: '📋' },
              { name: 'staff Feedback', icon: '📋' },
              { name: 'Student Feedback', icon: '📋' }
             
            ].map((item, i) => (
                <button key={i} className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#494e53] hover:text-white transition-all">
                    <span>{item.icon}</span> {item.name}
                </button>
            ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#4b545c] bg-[#343a40]">
            <button onClick={handleLogout} className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-bold shadow-md transition-colors">
                Logout
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center px-8 border-b sticky top-0 z-10">
          <h2 className="text-gray-800 font-bold text-sm">Student Management System | Admin Dashboard</h2>
          <span className="text-blue-500 text-sm cursor-pointer hover:underline" onClick={() => navigate('/')}>Home</span>
        </header>

        <div className="p-8">
          {/* STAT BOXES (Matching Color/Icon Logic) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatBox title="Total Students" count={userProfile?.dashboard_stats?.total_students || 12} color="bg-[#17a2b8]" />
            <StatBox title="Total Staffs" count={userProfile?.dashboard_stats?.total_staffs || 17} color="bg-[#dc3545]" />
            <StatBox title="Total Courses" count="11" color="bg-[#ffc107]" />
            <StatBox title="Total Subjects" count="22" color="bg-[#28a745]" />
          </div>

          {/* TOP ROW CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ChartCard title="Student and Staff Chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={studentStaffData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                    {studentStaffData.map((e, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip /><Legend verticalAlign="top" iconType="rect"/>
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Total Subjects in Each Course">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={subjectCourseData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={50}
                    outerRadius={80} 
                    dataKey="value"
                  >
                    {subjectCourseData.map((e, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip /><Legend verticalAlign="top" iconType="rect" wrapperStyle={{fontSize: '10px'}}/>
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* BOTTOM ROW CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title="Total Student in Each Course">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentsPerCourseData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" fontSize={10} tick={{fill: '#666'}} />
                  <YAxis fontSize={10} tick={{fill: '#666'}} />
                  <Tooltip cursor={{fill: '#f5f5f5'}} />
                  <Bar dataKey="students" radius={[4, 4, 0, 0]} barSize={35}>
                    {studentsPerCourseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Total Students in Each Subject">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentsPerSubjectData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" fontSize={10} tick={{fill: '#666'}} />
                  <YAxis fontSize={10} tick={{fill: '#666'}} />
                  <Tooltip cursor={{fill: '#f5f5f5'}} />
                  <Bar dataKey="students" radius={[4, 4, 0, 0]} barSize={35}>
                    {studentsPerSubjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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


const StatBox = ({ title, count, color }) => (
    <div className={`${color} text-white rounded shadow-md overflow-hidden flex flex-col min-h-[125px]`}>
      <div className="p-5 flex justify-between items-start flex-1">
        <div>
          <h4 className="text-3xl font-bold">{count}</h4>
          <p className="text-[10px] uppercase font-bold tracking-wider opacity-90">{title}</p>
        </div>
        <div className="text-3xl opacity-20 transform scale-125">📊</div>
      </div>
      <div className="bg-black/10 py-1.5 text-center text-[10px] font-bold uppercase cursor-pointer hover:bg-black/20">
        More info →
      </div>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-white rounded shadow-sm border-t-4 border-red-500 overflow-hidden">
       <div className="p-2.5 border-b bg-gray-50 flex justify-between items-center">
         <h3 className="font-bold text-gray-700 text-[11px] uppercase tracking-tighter">{title}</h3>
         <div className="flex gap-1">
           <span className="w-2 h-2 bg-gray-200 rounded-full"></span>
           <span className="w-2 h-2 bg-gray-200 rounded-full"></span>
         </div>
       </div>
       <div className="h-64 p-4">{children}</div>
    </div>
);

export default AdminDashboard;