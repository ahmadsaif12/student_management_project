import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminFeedback, replyToFeedback } from '../api/authService'; 

const AdminFeedback = () => {
  const navigate = useNavigate();
  const [feedbackTab, setFeedbackTab] = useState('Student'); // Changed to match Django 'type'
  const [allFeedback, setAllFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [repliedItems, setRepliedItems] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminFeedback();
      setAllFeedback(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      if (err.status === 403 || err.response?.status === 403) {
        setError("Access Denied: Admin privileges required.");
      } else {
        setError("Could not load feedback. Check if backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  /** * CRITICAL FIX: Your Django view sends 'type': 'Student' or 'Staff'
   * We filter based on that key specifically.
   */
  const currentData = allFeedback.filter(f => f.type === feedbackTab);

  const handleReplySubmit = async (id) => {
    if (!replyText[id]) return alert("Please type a message first.");
    
    try {
      // Ensure your authService sends { feedback_id, reply, type: feedbackTab }
      await replyToFeedback(id, replyText[id], feedbackTab);
      setRepliedItems({ ...repliedItems, [id]: true });
      alert("Reply sent successfully!");
    } catch (err) {
      alert("Failed to send reply.");
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Syncing with server...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* HEADER */}
        <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">Admin Response Hub</h1>
            <div className="flex gap-4 mt-6">
              <TabButton active={feedbackTab === 'Student'} label="Student Inbox" onClick={() => setFeedbackTab('Student')} />
              <TabButton active={feedbackTab === 'Staff'} label="Staff Inbox" onClick={() => setFeedbackTab('Staff')} />
            </div>
          </div>
          <button onClick={() => navigate('/admin-home')} className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all">
            Back to Dashboard
          </button>
        </div>

        {error && <div className="m-10 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold uppercase">{error}</div>}

        {/* LIST */}
        <div className="p-10 space-y-8 max-h-[700px] overflow-y-auto">
          {currentData.length > 0 ? (
            currentData.map((item) => {
              // Django keys: id, user, message, reply, type, date
              const isResolved = item.reply || repliedItems[item.id];

              return (
                <div key={item.id} className="p-8 rounded-[2.5rem] border border-slate-100 bg-white hover:border-indigo-200 transition-all shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                        {item.user?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 uppercase text-sm">{item.user}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                          ID: #{item.id} • {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <StatusBadge resolved={isResolved} />
                  </div>

                  <div className="bg-slate-50 rounded-3xl p-8 mb-6 border border-slate-100 italic text-slate-600 text-sm">
                    "{item.message}"
                  </div>

                  {!isResolved ? (
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="Type response..."
                        value={replyText[item.id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [item.id]: e.target.value })}
                        className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:ring-2 ring-indigo-500"
                      />
                      <button onClick={() => handleReplySubmit(item.id)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase hover:bg-indigo-700 transition-all shadow-md">
                        Send
                      </button>
                    </div>
                  ) : (
                    <div className="text-emerald-500 font-black text-[10px] uppercase flex items-center gap-2 p-2">
                       <i className="fas fa-check"></i> Resolved: {item.reply}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 text-slate-300 font-black text-[10px] uppercase tracking-widest">
              No {feedbackTab} Feedback Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, label, onClick }) => (
  <button onClick={onClick} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-400 border'}`}>
    {label}
  </button>
);

const StatusBadge = ({ resolved }) => (
  <span className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border ${resolved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
    {resolved ? 'Resolved' : 'Pending'}
  </span>
);

export default AdminFeedback;