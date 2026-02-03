import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCourse } from '../api/curriculumService';

const AddCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addCourse(courseName);
      setStatus('success');
      setTimeout(() => navigate('/manage-course'), 1000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || "Request failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Add Course Registry</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {status === 'success' && (
              <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-center uppercase text-sm">
                Course registered successfully
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-sm font-semibold italic">
                {errorMsg}
              </div>
            )}

            <div className="mb-8">
              <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
                Course Nomenclature
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Enter formal course name..."
                className="w-full px-4 py-3 text-lg font-medium bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
              >
                {status === 'loading' ? 'Processing...' : 'Confirm Registry'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;