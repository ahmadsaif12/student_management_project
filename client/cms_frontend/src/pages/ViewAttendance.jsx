import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const ViewAttendance = () => {
  const navigate = useNavigate();
  const userRole = String(localStorage.getItem('user_role')); 

  // --- Form States ---
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('overview'); // 'overview' (Stats) or 'history' (Daily)

  // --- Data & UI States ---
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMetadata, setFetchingMetadata] = useState(true);
  const [message, setMessage] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // --- Initial Metadata Load ---
  useEffect(() => {
    const fetchMetadata = async () => {
      if (userRole === '3') {
        fetchStudentOwnStats();
        return;
      }
      setFetchingMetadata(true);
      try {
        const [subRes, sessRes] = await Promise.all([
          axiosInstance.get('attendance/staff-subjects/'),
          axiosInstance.get('attendance/sessions/')
        ]);
        setSubjects(subRes.data || []);
        setSessions(sessRes.data || []);
      } catch (err) {
        setMessage("Unable to load selection filters.");
      } finally {
        setFetchingMetadata(false);
      }
    };
    fetchMetadata();
  }, [userRole]);

  const fetchStudentOwnStats = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('attendance/student-stats/');
      setAttendanceData(res.data.breakdown || []);
    } catch (err) {
      setMessage("Failed to load your attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('accounts/logout/');
    } finally {
      localStorage.clear();
      navigate('/login');
    }
  };

  // --- Fetch Logic for Admin/Staff ---
  const handleFetchAttendance = async (e) => {
    if (e) e.preventDefault();
    if (!selectedSubject || !selectedSession) {
      alert("Please select Subject and Session");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        subject_id: parseInt(selectedSubject),
        session_year_id: parseInt(selectedSession),
        attendance_date: viewMode === 'history' ? attendanceDate : null
      };

      const res = await axiosInstance.post('attendance/fetch-data/', payload);
      const data = Array.isArray(res.data) ? res.data : (res.data.attendance_list || []);
      
      setAttendanceData(data);
      if (data.length === 0) setMessage(`No ${viewMode} records found.`);
    } catch (err) {
      setAttendanceData([]);
      setMessage("Error fetching records from server.");
    } finally {
      setLoading(false);
    }
  };

  // Helper Calculations for "How Many"
  const totalPresenceMarks = attendanceData.reduce((acc, row) => acc + (row.present || 0), 0);
  const totalClassesConducted = attendanceData.length > 0 ? (attendanceData[0].total || 0) : 0;

  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      {/* Sidebar - JECRC Style */}
      <aside className="w-64 bg-[#343a40] fixed h-full text-[#c2c7d0] shadow-xl z-20">
        <div className="p-4 border-b border-gray-700 flex items-center gap-3 bg-[#343a40]">
           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <i className="fas fa-university text-gray-800"></i>
           </div>
           <span className="text-white font-bold text-lg">JECRC</span>
        </div>
        <nav className="mt-4">
          <SidebarItem icon="fas fa-home" label="Dashboard" onClick={() => navigate(userRole === '3' ? '/student-home' : '/admin-home')} />
          <SidebarItem icon="fas fa-calendar-check" label="View Attendance" active={true} />
          {userRole === '3' && (
            <>
              <SidebarItem icon="fas fa-poll-h" label="View Result" />
              <SidebarItem icon="fas fa-envelope" label="Apply for Leave" />
            </>
          )}
        </nav>
      </aside>

      {/* Main Container */}
      <main className="ml-64 flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-14 bg-white shadow-sm flex justify-between items-center px-6 sticky top-0 z-10">
          <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <i className="fas fa-bars mr-2"></i> Attendance System | {userRole === '3' ? 'Student' : 'Admin'}
          </div>
          <div className="relative">
            <button onClick={() => setShowSettings(!showSettings)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full">
              <i className="fas fa-cog text-gray-600"></i>
            </button>
            {showSettings && (
              <div className="absolute right-0 mt-2 w-48 bg-white border shadow-xl rounded-md py-2 z-50 border-gray-100">
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold">
                  <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 uppercase italic tracking-tighter">
                {viewMode === 'history' ? 'Daily Records' : 'Subject Statistics'}
            </h1>
            
            {userRole !== '3' && (
                <div className="flex bg-gray-200 p-1 rounded-lg">
                    <button onClick={() => { setViewMode('overview'); setAttendanceData([]); }} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${viewMode === 'overview' ? 'bg-white text-blue-600 shadow' : 'text-gray-500'}`}>Stats View</button>
                    <button onClick={() => { setViewMode('history'); setAttendanceData([]); }} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${viewMode === 'history' ? 'bg-white text-blue-600 shadow' : 'text-gray-500'}`}>Daily View</button>
                </div>
            )}
          </div>

          {/* Filters - Only for Admin/Staff */}
          {userRole !== '3' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
              <form onSubmit={handleFetchAttendance} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</label>
                  <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg text-sm font-semibold outline-none focus:border-blue-500">
                    <option value="">Select Subject</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Session</label>
                  <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)} className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-lg text-sm font-semibold outline-none focus:border-blue-500">
                    <option value="">Select Session</option>
                    {sessions.map(s => <option key={s.id} value={s.id}>{s.session_start_year} - {s.session_end_year}</option>)}
                  </select>
                </div>

                {viewMode === 'history' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Date</label>
                    <input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} className="w-full bg-gray-50 border border-gray-300 p-2 rounded-lg text-sm font-semibold outline-none focus:border-blue-500" />
                  </div>
                )}

                <button type="submit" className={`bg-[#007bff] hover:bg-blue-700 text-white font-bold h-[42px] rounded-lg text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 ${viewMode === 'overview' ? 'md:col-span-2' : ''}`}>
                  {loading ? 'Searching...' : '🔍 Fetch Records'}
                </button>
              </form>
            </div>
          )}

          {/* Statistics Summary Cards */}
          {viewMode === 'overview' && attendanceData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <i className="fas fa-chalkboard-teacher text-xl"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Sessions Held</p>
                  <h3 className="text-2xl font-black text-gray-800">{String(totalClassesConducted).padStart(2, '0')} Classes</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                  <i className="fas fa-users text-xl"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Combined Presence Count</p>
                  <h3 className="text-2xl font-black text-gray-800">{String(totalPresenceMarks).padStart(2, '0')} Total Marks</h3>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    {userRole === '3' ? 'Course Name' : 'Student Name'}
                  </th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    {viewMode === 'history' ? 'Status' : 'Attendance Count'}
                  </th>
                  <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendanceData.length > 0 ? (
                  attendanceData.map((row, i) => (
                    <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">
                        {userRole === '3' ? row.subject : (row.name || row.student_name)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {viewMode === 'history' ? (
                          <span className={`px-4 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${row.status ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            {row.status ? 'Present' : 'Absent'}
                          </span>
                        ) : (
                          <div className="inline-flex flex-col">
                            <span className="font-mono font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-full text-xs">
                              {row.present} <span className="text-gray-400 font-normal">/ {row.total}</span>
                            </span>
                            <span className="text-[8px] uppercase font-bold text-gray-400 mt-1">Total Marks</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                            <span className={`text-sm font-black ${row.percent < 75 ? 'text-red-600' : 'text-blue-600'}`}>
                                {row.percent}%
                            </span>
                            <div className="w-24 bg-gray-100 h-1.5 rounded-full mt-1 overflow-hidden border border-gray-50">
                                <div className={`h-full transition-all duration-700 ${row.percent < 75 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${row.percent}%` }}></div>
                            </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-20 text-center text-gray-400 font-medium italic uppercase text-xs tracking-widest">
                      {message || "Please select filters to view attendance data."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sidebar Helper Component
const SidebarItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 px-6 py-4 text-sm font-medium cursor-pointer transition-colors ${active ? 'bg-[#007bff] text-white shadow-inner' : 'hover:bg-gray-700 hover:text-white'}`}>
    <i className={`${icon} w-5 text-center`}></i>
    <span>{label}</span>
  </div>
);

export default ViewAttendance;