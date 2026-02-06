import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const ViewAttendance = () => {
  const navigate = useNavigate();
  const userRole = String(localStorage.getItem('user_role')); 

  // --- States ---
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('overview'); // 'overview' (Stats) or 'history' (Daily)

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Helper logic for routing and labeling
  const portalName = userRole === '1' ? 'Admin' : userRole === '2' ? 'Staff' : 'Student';
  const homePath = userRole === '1' ? '/admin-home' : userRole === '2' ? '/staff-home' : '/student-home';
  const userName = localStorage.getItem('user_name') || 'User';

  useEffect(() => {
    const fetchMetadata = async () => {
      if (userRole === '3') {
        fetchStudentOwnStats();
        return;
      }
      try {
        const [subRes, sessRes] = await Promise.all([
          axiosInstance.get('attendance/staff-subjects/'),
          axiosInstance.get('attendance/sessions/')
        ]);
        setSubjects(subRes.data || []);
        setSessions(sessRes.data || []);
      } catch (err) {
        setMessage("Unable to load selection filters.");
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
      setMessage("Failed to load your attendance data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAttendance = async (e) => {
    if (e) e.preventDefault();
    if (!selectedSubject || !selectedSession) return;

    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        subject_id: parseInt(selectedSubject),
        session_year_id: parseInt(selectedSession),
        attendance_date: viewMode === 'history' ? attendanceDate : null
      };

      const res = await axiosInstance.post('attendance/fetch-data/', payload);
      setAttendanceData(res.data || []);
      if (res.data.length === 0) setMessage(`No records found for this selection.`);
    } catch (err) {
      setAttendanceData([]);
      setMessage("Server error while fetching records.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-[#0f172a] fixed h-full text-slate-400 shadow-2xl z-30 hidden lg:block border-r border-slate-800">
        <div className="p-8 flex items-center gap-4">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-layer-group text-white"></i>
           </div>
           <span className="text-white font-black text-lg uppercase tracking-tighter">Portal <span className="text-indigo-500">View</span></span>
        </div>
        
        <nav className="mt-6 px-4 space-y-1">
          <SidebarItem icon="fas fa-th-large" label="Dashboard" onClick={() => navigate(homePath)} />
          <SidebarItem icon="fas fa-eye" label="Attendance Explorer" active={true} />
          {userRole === '2' && (
             <SidebarItem icon="fas fa-plus-square" label="Mark Presence" onClick={() => navigate('/take-attendance')} />
          )}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="lg:ml-72 flex-1">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md flex justify-between items-center px-10 border-b border-slate-200 sticky top-0 z-20">
          <div>
            <h2 className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">{portalName} Control Panel</h2>
            <p className="text-slate-800 font-black text-sm uppercase">Attendance Archive</p>
          </div>

          <div className="relative">
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-all">
              <i className="fas fa-user-circle text-slate-600 text-xl"></i>
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

        <div className="p-10 max-w-7xl mx-auto">
          {/* Header Title & Switcher */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
                    {viewMode === 'history' ? 'Daily Log' : 'Analytics Overview'}
                </h1>
                <p className="text-slate-400 font-medium text-sm">Detailed breakdown of student presence and performance</p>
            </div>
            
            {userRole !== '3' && (
                <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200">
                    <button 
                        onClick={() => { setViewMode('overview'); setAttendanceData([]); }} 
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === 'overview' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
                        <i className="fas fa-chart-pie mr-2"></i> Stats
                    </button>
                    <button 
                        onClick={() => { setViewMode('history'); setAttendanceData([]); }} 
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === 'history' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
                        <i className="fas fa-history mr-2"></i> Daily
                    </button>
                </div>
            )}
          </div>

          {/* Configuration Card */}
          {userRole !== '3' && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-white mb-10 transition-all">
              <form onSubmit={handleFetchAttendance} className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                  <select 
                    value={selectedSubject} 
                    onChange={(e) => setSelectedSubject(e.target.value)} 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                    <option value="">Select Subject</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Session</label>
                  <select 
                    value={selectedSession} 
                    onChange={(e) => setSelectedSession(e.target.value)} 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                    <option value="">Select Session</option>
                    {sessions.map(s => <option key={s.id} value={s.id}>{s.session_start_year} — {s.session_end_year}</option>)}
                  </select>
                </div>

                {viewMode === 'history' && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date Selection</label>
                    <input 
                        type="date" 
                        value={attendanceDate} 
                        onChange={(e) => setAttendanceDate(e.target.value)} 
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all" 
                    />
                  </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className={`bg-indigo-600 hover:bg-slate-900 text-white font-black h-[58px] rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-200 active:scale-95 disabled:opacity-50 ${viewMode === 'overview' ? 'md:col-span-2' : ''}`}>
                  {loading ? 'Initializing...' : 'Query Records'}
                </button>
              </form>
            </div>
          )}

          {/* Results Table */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden animate-in fade-in duration-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {userRole === '3' ? 'Course Domain' : 'Student Identity'}
                  </th>
                  <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {viewMode === 'history' ? 'Status' : 'Persistence'}
                  </th>
                  <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Performance Index
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {attendanceData.length > 0 ? (
                  attendanceData.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 font-black text-xs">
                                {i + 1}
                            </div>
                            <span className="text-sm font-black text-slate-700 uppercase truncate">
                                {userRole === '3' ? row.subject : (row.name || row.student_name)}
                            </span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        {viewMode === 'history' ? (
                          <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border-2 ${row.status ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                            {row.status ? 'Present' : 'Absent'}
                          </span>
                        ) : (
                          <span className="font-black text-slate-800 bg-slate-100 px-4 py-2 rounded-xl text-xs inline-block">
                            {row.present} <span className="text-slate-400 mx-1">/</span> {row.total}
                          </span>
                        )}
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-col items-end gap-2">
                            <span className={`text-sm font-black ${row.percent < 75 ? 'text-rose-500' : 'text-indigo-600'}`}>
                                {row.percent}%
                            </span>
                            <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${row.percent < 75 ? 'bg-rose-500' : 'bg-indigo-600'}`} 
                                    style={{ width: `${row.percent}%` }}>
                                </div>
                            </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <i className="fas fa-folder-open text-slate-200 text-5xl"></i>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                            {message || "Specify criteria to load analytics"}
                        </p>
                      </div>
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

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold transition-all mb-2 ${
        active 
        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
        : 'hover:bg-slate-800 text-slate-400 hover:text-white'
    }`}>
    <i className={`${icon} w-5 text-center`}></i>
    <span>{label}</span>
  </button>
);

export default ViewAttendance;