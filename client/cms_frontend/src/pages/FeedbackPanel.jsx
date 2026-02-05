import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const FeedbackPanel = () => {
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState([]);

  const fetchFeedback = async () => {
    const res = await axiosInstance.get('operations/feedback/');
    setHistory(res.data);
  };

  useEffect(() => { fetchFeedback(); }, []);

  const sendFeedback = async () => {
    await axiosInstance.post('operations/feedback/', { feedback });
    setFeedback("");
    fetchFeedback();
  };

  return (
    <div className="p-8 ml-64 max-w-4xl">
      <div className="bg-indigo-900 rounded-[3rem] p-10 text-white mb-8 shadow-2xl shadow-indigo-200">
        <h2 className="text-3xl font-black tracking-tight mb-2">Internal Feedback</h2>
        <p className="text-indigo-200 font-medium">Have a suggestion or complaint? Let the administration know.</p>
        
        <div className="mt-8 flex gap-4">
          <input className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-indigo-300 outline-none focus:bg-white/20 transition-all"
            placeholder="Type your message here..." value={feedback} onChange={e => setFeedback(e.target.value)}/>
          <button onClick={sendFeedback} className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors">
            Send Message
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Response Timeline</h3>
        {history.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-bold text-slate-800 italic">"{item.feedback}"</p>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{new Date(item.date).toLocaleDateString()}</span>
            </div>
            {item.reply ? (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex gap-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs shrink-0">
                  <i className="fas fa-reply"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Admin Reply</p>
                  <p className="text-xs font-bold text-indigo-900 leading-relaxed">{item.reply}</p>
                </div>
              </div>
            ) : (
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 w-fit px-3 py-1 rounded-full">Awaiting Reply</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default FeedbackPanel