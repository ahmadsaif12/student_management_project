import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeedbackHistory, submitFeedback } from '../api/authService';

const StudentFeedback = () => {
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getFeedbackHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      await submitFeedback(message);
      setMessage("");
      
      alert("Feedback sent successfully!");
      navigate('/student-home'); 
      
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Failed to send feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center font-black uppercase text-slate-400">Syncing History...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
           <h2 className="text-2xl font-black text-slate-800 uppercase italic">Feedback Hub</h2>
           <button 
             onClick={() => navigate('/student-home')}
             className="bg-slate-800 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg"
           >
             Return to Dashboard
           </button>
        </div>

        {/* SUBMISSION FORM */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 mb-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you today?"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm outline-none focus:ring-4 ring-indigo-500/10 min-h-[150px] transition-all"
            />
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-indigo-600 text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Submit Message'}
            </button>
          </form>
        </div>

        {/* HISTORY LIST */}
        <div className="space-y-6">
          {history.length > 0 ? (
            history.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    ID: #{item.id} • {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-700 text-sm font-medium italic">"{item.feedback}"</p>
                {item.reply && (
                  <div className="mt-4 p-4 bg-indigo-50 rounded-2xl text-indigo-900 text-xs font-bold border border-indigo-100">
                    Admin: {item.reply}
                  </div>
                )}
              </div>
            ))
          ) : (
             <p className="text-center text-slate-300 font-black text-[10px] uppercase">No messages yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentFeedback;