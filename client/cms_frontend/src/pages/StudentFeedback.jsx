import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const StudentFeedback = () => {
  const [feedback, setFeedback] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get('operations/feedback/submit/');
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load feedback history");
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('operations/feedback/submit/', { feedback });
      setFeedback('');
      fetchHistory(); // Refresh list
      alert("Feedback sent!");
    } catch (err) {
      alert("Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 ml-64 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Feedback & Suggestions</h1>
        
        {/* Form Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <form onSubmit={handleSubmit}>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Your Message</label>
            <textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all h-32"
              placeholder="Tell us what's on your mind..."
              required
            />
            <button 
              disabled={loading}
              className="mt-4 bg-slate-900 text-white px-8 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Submit Feedback'}
            </button>
          </form>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 p-4">
            <h2 className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Previous Feedbacks</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {history.length === 0 ? (
              <p className="p-10 text-center text-slate-400 text-sm italic">No feedback history found.</p>
            ) : (
              history.map((f) => (
                <div key={f.id} className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-slate-800 font-medium">{f.feedback}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{new Date(f.date).toLocaleDateString()}</span>
                  </div>
                  {f.reply ? (
                    <div className="mt-3 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Admin Reply:</p>
                      <p className="text-sm text-blue-800">{f.reply}</p>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-500 uppercase italic">Pending Reply...</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeedback;