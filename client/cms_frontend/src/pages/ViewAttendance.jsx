import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const ViewAttendance = () => {
  const navigate = useNavigate();
  
  // Form States
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Data States
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMetadata, setFetchingMetadata] = useState(true);
  const [message, setMessage] = useState(null);

  // Initial Load: Fetch Subjects and Sessions
  useEffect(() => {
    const fetchMetadata = async () => {
      setFetchingMetadata(true);
      try {
        const [subRes, sessRes] = await Promise.all([
          axiosInstance.get('curriculum/subjects/'), 
          axiosInstance.get('curriculum/sessions/') 
        ]);
        setSubjects(subRes.data);
        setSessions(sessRes.data);
      } catch (err) {
        console.error("Metadata fetch failed:", err);
        setMessage("Unable to reach curriculum server.");
      } finally {
        setFetchingMetadata(false);
      }
    };
    fetchMetadata();
  }, []);

  const handleFetchAttendance = async (e) => {
    e.preventDefault();
    if (!selectedSubject || !selectedSession || !attendanceDate) {
      alert("Please select Subject, Session, and Date");
      return;
    }

    setLoading(true);
    setMessage(null);

    // DEBUG: Look at your Browser Console to see these values!
    console.log("Searching for:", {
        subject_id: selectedSubject,
        session_year_id: selectedSession,
        attendance_date: attendanceDate
    });

    try {
      const res = await axiosInstance.post('attendance/fetch-data/', {
        subject_id: selectedSubject,
        session_year_id: selectedSession,
        attendance_date: attendanceDate
      });

      console.log("Server Response:", res.data);

      if (res.data.length === 0) {
        setMessage("No records found for this specific date and session.");
        setAttendanceData([]);
      } else {
        setAttendanceData(res.data);
      }
    } catch (err) {
      console.error("Search Error:", err);
      setAttendanceData([]);
      setMessage(err.response?.data?.error || "Error fetching attendance records.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] ml-64 p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase italic">Attendance History</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Verify student records</p>
        </div>
        <button 
            onClick={() => navigate('/admin-home')} 
            className="bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
            🏠 Home
        </button>
      </div>

      {/* Filters Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <form onSubmit={handleFetchAttendance} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-3">Subject</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900"
              disabled={fetchingMetadata}
            >
              <option value="">{fetchingMetadata ? "Loading..." : "Select Subject"}</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-3">Academic Session</label>
            <select 
              value={selectedSession} 
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900"
              disabled={fetchingMetadata}
            >
              <option value="">{fetchingMetadata ? "Loading..." : "Select Session"}</option>
              {sessions.map(s => (
                <option key={s.id} value={s.id}>{s.session_start_year} TO {s.session_end_year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-3">Date</label>
            <input 
                type="date" 
                value={attendanceDate} 
                onChange={(e) => setAttendanceDate(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase py-4 rounded-xl tracking-widest transition-all shadow-lg active:scale-95 disabled:bg-slate-400"
          >
            {loading ? "SEARCHING..." : "🔍 SEARCH RECORDS"}
          </button>
        </form>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Student Identity</th>
              <th className="px-8 py-5 text-center">Attendance Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="2" className="p-20 text-center text-slate-300 font-black uppercase animate-pulse">
                    Querying Database...
                </td>
              </tr>
            ) : attendanceData.length > 0 ? (
              attendanceData.map((record) => (
                <tr key={record.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-8 py-5 font-black text-slate-800 uppercase text-xs">
                    {record.name}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      record.status 
                        ? "bg-green-50 text-green-600 border-green-100" 
                        : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}>
                        {record.status ? "Present" : "Absent"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-20 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest">
                    {message || "Select filters above to view historical data"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAttendance;