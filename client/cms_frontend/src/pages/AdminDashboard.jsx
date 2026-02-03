import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser, getUserProfile } from '../api/authService';
import { getCourses, getSubjects } from '../api/curriculumService';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userProfile, setUserProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [totalStaff, setTotalStaff] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');

        const [profileData, courseData, subjectData] = await Promise.all([
          getUserProfile(),
          getCourses(),
          getSubjects()
        ]);

        const staffRes = await fetch('http://localhost:8000/api/accounts/staff/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const staffData = await staffRes.json();

        setUserProfile(profileData);
        setCourses(Array.isArray(courseData) ? courseData : []);
        setSubjects(Array.isArray(subjectData) ? subjectData : []);
        setTotalStaff(staffData?.length || 0);
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await logoutUser();
    localStorage.clear();
    navigate('/login');
  };

  const staffStudentData = [
    { name: 'Students', value: userProfile?.dashboard_stats?.total_students || 0 },
    { name: 'Staffs', value: totalStaff }
  ];

  const subjectCourseData = courses.map(course => ({
    name: course.course_name || course.name,
    value: subjects.filter(sub => String(sub.course_id) === String(course.id)).length
  }));

  const studentCourseData = courses.map(course => ({
    name: course.course_name || course.name,
    count: Math.floor(Math.random() * 50) + 10
  }));

  const COLORS = ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#d2d6de'];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400 font-bold">
        LOADING DASHBOARD...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#343a40] fixed h-full text-[#c2c7d0] shadow-lg overflow-y-auto">
        <div className="p-4 border-b border-[#4b545c] text-white text-lg font-light">
          College Management
        </div>
        <nav className="py-2">
          {[
            { name: 'Home', path: '/admin-home', icon: 'fas fa-tachometer-alt' },
            { name: 'Manage Staff', path: '/manage-staff', icon: 'fas fa-chalkboard-teacher' },
            { name: 'Add Staff', path: '/add-staff', icon: 'fas fa-user-plus' },
            { name: 'Manage Student', path: '/manage-student', icon: 'fas fa-user-graduate' },
            { name: 'Add Student', path: '/add-student', icon: 'fas fa-user-plus' },
            { name: 'Manage Course', path: '/manage-course', icon: 'fas fa-th-list' },
            { name: 'Add Course', path: '/add-course', icon: 'fas fa-plus-square' },
            { name: 'Manage Subject', path: '/manage-subject', icon: 'fas fa-book' },
            { name: 'Add Subject', path: '/add-subject', icon: 'fas fa-book-medical' },
            { name: 'Manage Session', path: '/manage-session', icon: 'fas fa-calendar-alt' },
            { name: 'Add Session', path: '/add-session', icon: 'fas fa-calendar-plus' },
            { name: 'View Attendance', path: '/view-attendance', icon: 'fas fa-check-square' },
            { name: 'Student Feedback', path: '/student-feedback', icon: 'fas fa-comment-dots' },
            { name: 'Staff Feedback', path: '/staff-feedback', icon: 'fas fa-comments' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                location.pathname === item.path ? 'bg-[#007bff] text-white' : 'hover:bg-[#494e53] hover:text-white'
              }`}
            >
              <i className={`${item.icon} w-5 text-center text-xs`}></i>
              <span className="font-light">{item.name}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-sm text-red-400 hover:bg-red-500 hover:text-white border-t border-[#4b545c]"
          >
            <i className="fas fa-sign-out-alt w-5 text-center"></i>
            Logout
          </button>
        </nav>
      </aside>

      <main className="ml-64 flex-1">
        <header className="bg-white p-4 shadow-sm border-b sticky top-0 z-10">
          <h2 className="text-gray-700 text-lg">Admin Dashboard</h2>
        </header>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatBox
              title="Total Students"
              count={staffStudentData[0].value}
              color="bg-[#17a2b8]"
              onViewMore={() => navigate('/manage-student')}
            />
            <StatBox
              title="Total Staffs"
              count={totalStaff}
              color="bg-[#dd4b39]"
              onViewMore={() => navigate('/manage-staff')}
            />
            <StatBox
              title="Total Courses"
              count={courses.length}
              color="bg-[#f39c12]"
              onViewMore={() => navigate('/manage-course')}
            />
            <StatBox
              title="Total Subjects"
              count={subjects.length}
              color="bg-[#00a65a]"
              onViewMore={() => navigate('/manage-subject')}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Charts remain unchanged */}
            <ChartCard title="Student and Staff Chart" headerColor="bg-[#dd4b39]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={staffStudentData} cx="50%" cy="50%" outerRadius={85} dataKey="value">
                    <Cell fill="#00a65a" />
                    <Cell fill="#f56954" />
                  </Pie>
                  <Legend verticalAlign="bottom" />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Total Subjects in Each Course" headerColor="bg-[#00a65a]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={subjectCourseData} cx="50%" cy="50%" innerRadius={45} outerRadius={85} dataKey="value">
                    {subjectCourseData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Total Students in Each Course" headerColor="bg-[#3c8dbc]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentCourseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3c8dbc" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Total Students in Each Subject" headerColor="bg-[#00c0ef]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studentCourseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#00c0ef" fill="#00c0ef" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ================= CENTERED STAT BOX ================= */
const StatBox = ({ title, count, color, onViewMore }) => (
  <div className={`${color} text-white rounded shadow-lg flex flex-col overflow-hidden transition-transform hover:scale-[1.02]`}>
    <div className="p-10 flex flex-col items-center justify-center text-center">
      <span className="text-sm font-bold uppercase tracking-widest opacity-90 mb-2">
        {title}
      </span>
      <h3 className="text-6xl font-black">
        {count}
      </h3>
    </div>
    
    {onViewMore && (
      <button
        onClick={onViewMore}
        className="pb-4 text-xs font-semibold flex items-center justify-center gap-1.5"
      >
        More info <i className="fas fa-arrow-circle-right"></i>
      </button>
    )}
  </div>
);

const ChartCard = ({ title, headerColor, children }) => (
  <div className="bg-white rounded shadow border border-gray-200">
    <div className={`${headerColor} px-4 py-2 text-white text-xs uppercase font-bold`}>
      {title}
    </div>
    <div className="h-72 p-4">{children}</div>
  </div>
);

export default AdminDashboard;