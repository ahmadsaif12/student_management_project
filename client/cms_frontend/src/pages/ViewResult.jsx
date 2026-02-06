import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const ViewResult = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('user_role'); // '2' for Staff, '3' for Student

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // GET request with no params triggers "Mode 2" in our backend
        const res = await axiosInstance.get('operations/manage-results/');
        setResults(res.data);
      } catch (err) {
        console.error("Error loading results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const handleBackToDashboard = () => {
    if (userRole === '2') navigate('/staff-home');
    else if (userRole === '3') navigate('/student-home');
    else navigate('/');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 lg:p-10 lg:ml-72">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
              {userRole === '2' ? 'Submitted Results' : 'Academic Report Card'}
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">Viewing latest academic records</p>
          </div>

          <button 
            onClick={handleBackToDashboard}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
          >
            <i className="fas fa-arrow-left text-indigo-600"></i>
            Back to Dashboard
          </button>
        </header>

        {results && results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((res, index) => (
              <div key={res.id || index} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-white flex justify-between items-center group hover:border-indigo-200 transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {res.subject_name}
                    </h3>
                  </div>
                  <p className="text-xl font-black text-slate-800 uppercase leading-tight">
                    {userRole === '2' ? `Student: ${res.student_name}` : 'Examination Score'}
                  </p>
                  {userRole === '2' && (
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Record ID: #{res.id}</span>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-4xl font-black text-indigo-600 tabular-nums">
                    {res.subject_exam_marks}
                    <span className="text-sm text-slate-300 ml-1">/100</span>
                  </div>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${res.subject_exam_marks >= 40 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {res.subject_exam_marks >= 40 ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-folder-open text-slate-300 text-3xl"></i>
             </div>
             <p className="text-slate-400 font-black uppercase text-xs tracking-widest">
               No academic records found.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResult;