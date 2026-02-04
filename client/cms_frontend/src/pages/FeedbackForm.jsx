import React, { useState } from 'react';
import { submitFeedback } from '../api/authService';

const FeedbackForm = () => {
  const [text, setText] = useState('');
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await submitFeedback(text);
      setMsg({ type: 'success', text: res.message });
      setText(''); // Clear form
    } catch (err) {
      setMsg({ type: 'error', text: err.error });
    }
  };

  return (
    <div className="p-8 ml-64 bg-slate-50 min-h-screen">
      <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 mb-2">SEND FEEDBACK</h2>
        <p className="text-slate-500 text-xs mb-6 uppercase font-bold tracking-widest">Share your thoughts with the Administration</p>

        {msg && (
          <div className={`p-4 mb-4 rounded-lg text-xs font-bold uppercase ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <textarea 
            className="w-full h-40 p-4 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
            placeholder="Type your feedback here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <button type="submit" className="mt-4 bg-slate-900 text-white px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;