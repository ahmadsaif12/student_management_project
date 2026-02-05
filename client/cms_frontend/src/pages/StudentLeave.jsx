import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { applyStudentLeave, getStudentLeaveHistory } from '../api/authService'; 

const StudentLeave = () => {
  const navigate = useNavigate(); // 2. Initialize navigate
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveMessage, setLeaveMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch History on Load
  const fetchHistory = async () => {
    try {
      const data = await getStudentLeaveHistory();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        leave_date: leaveDate,
        leave_message: leaveMessage
      };
      
      await applyStudentLeave(payload);
      
      alert("Leave Request Submitted successfully!");
      
      // 3. Redirect to the appropriate homepage based on user role
      const role = localStorage.getItem('user_role');
      if (role === '3') {
        navigate('/student-home');
      } else if (role === '2') {
        navigate('/staff-home');
      } else {
        navigate('/'); // Fallback
      }

    } catch (err) {
      console.error("Submission error:", err);
      alert(err.error || "Submission failed. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-64 p-10 bg-[#f8fafc] min-h-screen">
      {/* ... rest of your component UI stays exactly the same ... */}
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
              Operations
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Leave Application</h1>
          <p className="text-slate-500 font-medium mt-1">Request time off and monitor your approval status.</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 h-fit sticky top-24">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <i className="fas fa-paper-plane text-blue-500"></i> New Request
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Select Date</label>
                <input 
                  type="date" 
                  required 
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 ring-blue-500/5 focus:bg-white focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Reason for Absence</label>
                <textarea 
                  required 
                  value={leaveMessage}
                  onChange={(e) => setLeaveMessage(e.target.value)}
                  placeholder="Explain your reason for leave..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 ring-blue-500/5 focus:bg-white focus:border-blue-500 min-h-[160px] transition-all resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-[#1e293b] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Submit Request <i className="fas fa-arrow-right text-[10px]"></i></>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
             <div className="p-6 border-b border-slate-50 bg-slate-50/50 font-black text-[10px] text-slate-400 uppercase tracking-widest flex justify-between items-center">
                <span>Recent History</span>
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[9px]">{history.length} Records</span>
             </div>
             <div className="p-6 space-y-4 overflow-y-auto max-h-[600px]">
                {history.map((item, idx) => (
                    <div key={idx} className="group p-6 border border-slate-100 rounded-[2rem] border-l-4" style={{ borderLeftColor: getStatusColor(item.leave_status) }}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                            <i className="fas fa-calendar-alt text-slate-400 text-xs"></i>
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Application Date</p>
                            <span className="text-sm font-black text-slate-800 tracking-tight">{item.leave_date}</span>
                          </div>
                        </div>
                        <StatusBadge status={item.leave_status} />
                      </div>
                      <div className="bg-white/50 p-4 rounded-2xl border border-slate-50">
                        <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.leave_message}</p>
                      </div>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const getStatusColor = (status) => {
  const colors = ['#f59e0b', '#10b981', '#f43f5e']; 
  return colors[status] || colors[0];
};

const StatusBadge = ({ status }) => {
  const styles = [
    { label: 'Pending', bg: 'bg-amber-50 text-amber-600 border-amber-100', icon: 'fa-clock' },
    { label: 'Approved', bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: 'fa-check-circle' },
    { label: 'Rejected', bg: 'bg-rose-50 text-rose-600 border-rose-100', icon: 'fa-times-circle' }
  ];
  const s = styles[status] || styles[0];
  return (
    <span className={`${s.bg} border px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2`}>
      <i className={`fas ${s.icon}`}></i>
      {s.label}
    </span>
  );
};

export default StudentLeave;