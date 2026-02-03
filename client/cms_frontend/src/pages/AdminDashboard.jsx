import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser, getUserProfile } from '../api/authService';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
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
        console.error("Failed to fetch profile", err);
        // If profile fetch fails, the token is likely invalid
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.clear();
      navigate('/login');
    }
  };

  // Prepare Dynamic Chart Data from API
  const pieData = [
    { name: 'Students', value: userProfile?.dashboard_stats?.total_students || 0 },
    { name: 'Staffs', value: userProfile?.dashboard_stats?.total_staffs || 0 },
  ];
  const PIE_COLORS = ['#ef4444', '#28a745'];

  // Bar Chart Data (Update these keys if your backend sends different course names)
  const barData = [
    { name: 'B.Tech', subjects: 12 },
    { name: 'M.Tech', subjects: 8 },
    { name: 'BCA', subjects: 15 },
    { name: 'B.Sc', subjects: 10 },
    { name: 'Diploma', subjects: 5 },
  ];

  const menuItems = [
    { name: 'Home', icon: '🏠', path: '/admin-home' },
    { name: 'Manage Staff', icon: '👨‍🏫', path: '/manage-staff' },
    { name: 'Add Staff', icon: '➕', path: '/add-staff' },
    { name: 'Manage Student', icon: '🎓', path: '/manage-student' },
    { name: 'Add Student', icon: '➕', path: '/add-student' },
    { name: 'Manage Course', icon: '📖', path: '/manage-course' },
    { name: 'Add Course', icon: '➕', path: '/add-course' },
    { name: 'Manage Subject', icon: '📚', path: '/manage-subject' },
    { name: 'Add Subject', icon: '➕', path: '/add-subject' },
    { name: 'Manage Session', icon: '📅', path: '/manage-session' },
    { name: 'View Attendance', icon: '📋', path: '/view-attendance' },
  ];

  // Helper for Profile Display
  const adminInfo = userProfile?.my_profile?.admin;

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f4f6f9]">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6f9] font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#343a40] text-[#c2c7d0] flex flex-col fixed h-full shadow-xl z-20 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#4b545c] flex items-center gap-3 bg-[#343a40]">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold text-xs shadow-md shrink-0">JECRC</div>
          <span className="text-white font-semibold tracking-wide">Admin Panel</span>
        </div>
        
        {/* Profile Section - Sarah Jenkins Dynamic Data */}
        <div className="p-4 flex items-center gap-3 border-b border-[#4b545c]">
          <div className="w-9 h-9 rounded-full bg-gray-600 overflow-hidden border border-gray-700 shrink-0">
             <img 
               src={adminInfo?.profile_pic || "https://via.placeholder.com/32"} 
               alt="admin" 
               className="w-full h-full object-cover" 
             />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-medium text-white truncate">
              {adminInfo ? `${adminInfo.first_name} ${adminInfo.last_name}` : "Sarah Jenkins"}
            </span>
            <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">● Online</span>
          </div>
        </div>

        {/* Scrollable Nav Items */}
        <nav className="flex-1 overflow-y-auto py-2 scrollbar-hide">
          {menuItems.map((item, index) => (
            <button 
              key={index} 
              onClick={() => navigate(item.path)} 
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#494e53] hover:text-white transition-all group"
            >
              <span className="opacity-70 group-hover:opacity-100">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* LOGOUT BUTTON - FIXED AT BOTTOM */}
        <div className="p-4 border-t border-[#4b545c] bg-[#343a40]">
            <button 
              onClick={handleLogout} 
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2"
            >
                <span>🚪</span> Logout
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="ml-64 flex-1">
        {/* Top Navbar */}
        <header className="bg-white p-4 shadow-sm flex justify-between items-center px-8 border-b sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xl cursor-pointer">☰</span>
            <h2 className="text-gray-800 font-bold">Student Management System | Admin Dashboard</h2>
          </div>
          <span 
            className="text-blue-500 text-sm cursor-pointer hover:underline" 
            onClick={() => navigate('/')}
          >
            Home
          </span>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* STAT BOXES (LARGER DESIGN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatBox title="Total Students" count={userProfile?.dashboard_stats?.total_students || 0} color="bg-[#17a2b8]" nav="/manage-student" />
            <StatBox title="Total Staffs" count={userProfile?.dashboard_stats?.total_staffs || 0} color="bg-[#dc3545]" nav="/manage-staff" />
            <StatBox title="Total Courses" count="11" color="bg-[#ffc107]" nav="/manage-course" />
            <StatBox title="Total Subjects" count="22" color="bg-[#28a745]" nav="/manage-subject" />
          </div>

          {/* CHARTS (ADJUSTED LAYOUT) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Pie Chart Card */}
            <div className="bg-white rounded shadow-md border-t-4 border-red-500 overflow-hidden">
               <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                 <h3 className="font-bold text-gray-700">Student and Staff Chart</h3>
                 <div className="text-xs text-gray-400">− ×</div>
               </div>
               <div className="h-80 p-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={pieData} innerRadius={0} outerRadius={100} dataKey="value" label>
                       {pieData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                       ))}
                     </Pie>
                     <Tooltip />
                     <Legend verticalAlign="bottom" height={36}/>
                   </PieChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Bar Chart Card */}
            <div className="bg-white rounded shadow-md border-t-4 border-red-500 overflow-hidden">
               <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                 <h3 className="font-bold text-gray-700">Total Subjects in Each Course</h3>
                 <div className="text-xs text-gray-400">− ×</div>
               </div>
               <div className="h-80 p-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={barData} margin={{top: 20, right: 30, left: 0, bottom: 0}}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                     <XAxis dataKey="name" fontSize={12} tick={{fill: '#666'}} />
                     <YAxis fontSize={12} tick={{fill: '#666'}} />
                     <Tooltip cursor={{fill: '#f5f5f5'}} />
                     <Bar dataKey="subjects" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
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

// HELPER: LARGER STAT BOX COMPONENT
const StatBox = ({ title, count, color, nav }) => {
  const navigate = useNavigate();
  return (
    <div className={`${color} text-white rounded shadow-lg overflow-hidden flex flex-col group min-h-[140px]`}>
      <div className="p-6 flex justify-between items-start flex-1">
        <div>
          <h4 className="text-4xl font-black mb-1 drop-shadow-md">{count}</h4>
          <p className="text-sm font-bold uppercase tracking-wide opacity-90">{title}</p>
        </div>
        <div className="opacity-20 transform group-hover:scale-110 transition-transform pt-1">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                <path d="M5 19h2v-7H5v7zm4 0h2V5H9v14zm4 0h2v-9h-2v9zm4 0h2v-12h-2v12z"/>
            </svg>
        </div>
      </div>
      <button 
        onClick={() => navigate(nav)}
        className="bg-black/15 py-2 text-center text-xs font-bold uppercase hover:bg-black/25 transition-all border-t border-white/5"
      >
        More info <span className="ml-1 inline-block bg-white text-black rounded-full w-4 h-4 text-[10px] leading-4 text-center">→</span>
      </button>
    </div>
  );
};

export default AdminDashboard;