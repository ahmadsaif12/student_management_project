import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applyStaffLeave, getStaffLeaveHistory } from '../api/authService';

const StaffLeave = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    leave_date: '',
    leave_message: ''
  });

  // Fetch history on load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getStaffLeaveHistory();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await applyStaffLeave(formData);
      alert("Leave application sent successfully!");
      setFormData({ leave_date: '', leave_message: '' }); // Reset form
      fetchHistory(); // Refresh history list
    } catch (err) {
      alert(err.error || "Failed to submit leave.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 1: return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 2: return 'bg-rose-100 text-rose-600 border-rose-200';
      default: return 'bg-amber-100 text-amber-600 border-amber-200';
    }
  };

  const getStatusText = (status) => {
    if (status === 1) return 'Approved';
    if (status === 2) return 'Rejected';
    return 'Pending';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-10 lg:ml-72">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
              Staff Leave Portal
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">Manage your time-off requests</p>
          </div>
          <button 
            onClick={() => navigate('/staff-home')}
            className="px-6 py-3 bg-white text-slate-700 font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
          >
            Back to Dashboard
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Application Form */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-white sticky top-10">
              <h2 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-6">New Request</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Leave Date</label>
                  <input 
                    type="date"
                    required
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all"
                    value={formData.leave_date}
                    onChange={(e) => setFormData({...formData, leave_date: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Reason / Message</label>
                  <textarea 
                    required
                    rows="4"
                    placeholder="Briefly explain the reason for leave..."
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all resize-none"
                    value={formData.leave_message}
                    onChange={(e) => setFormData({...formData, leave_message: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-lg hover:bg-indigo-600 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>

          {/* History List */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-white min-h-[500px]">
              <h2 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-8">Request History</h2>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading History...</p>
                </div>
              ) : history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="group p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-200 transition-all">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-black text-slate-800 uppercase">{item.leave_date}</span>
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${getStatusStyle(item.leave_status)}`}>
                            {getStatusText(item.leave_status)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-500 italic leading-relaxed">
                          "{item.leave_message}"
                        </p>
                      </div>
                      <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-slate-200">
                         <span className="block text-[8px] font-black text-slate-300 uppercase tracking-widest">Requested On</span>
                         <span className="text-[10px] font-bold text-slate-500 uppercase">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                    <i className="fas fa-calendar-alt text-slate-200"></i>
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No history found</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StaffLeave;