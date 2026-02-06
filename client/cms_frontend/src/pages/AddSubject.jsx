import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, addSubject } from '../api/curriculumService';

const AddSubject = () => {
  const [subjectName, setSubjectName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [courses, setCourses] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const courseData = await getCourses();
        setCourses(courseData);

        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/accounts/staff/', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const staffData = await response.json();
          setStaffMembers(staffData);
        }
      } catch (err) {
        console.error("Failed to load dropdown data:", err);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId || !staffId) {
      alert("Please select both a Course and a Staff member.");
      return;
    }
    setLoading(true);
    const payload = { 
      subject_name: subjectName, 
      course_id: parseInt(courseId), 
      staff_id: parseInt(staffId)    
    };

    try {
      await addSubject(payload);
      navigate('/manage-subject');
    } catch (err) {
      alert("Error: " + (err.response?.data ? JSON.stringify(err.response.data) : err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6 flex items-center justify-center font-sans">
      <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden">
        
        {/* Header Section */}
        <div className="relative bg-[#0f172a] p-8 text-white">
          <div className="relative z-10">
            <h3 className="text-2xl font-black uppercase tracking-tight">Add New Subject</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Curriculum Management System</p>
          </div>
          {/* Decorative Circle */}
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          
          {/* Subject Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject Title</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <i className="fas fa-book-open"></i>
              </span>
              <input 
                type="text" 
                required 
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Advanced Mathematics"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-semibold text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Dropdown */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department / Course</label>
              <select 
                required 
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-semibold text-slate-700 appearance-none cursor-pointer"
              >
                <option value="">Select Course</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.course_name}</option>
                ))}
              </select>
            </div>

            {/* Staff Dropdown */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Staff</label>
              <select 
                required 
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-semibold text-slate-700 appearance-none cursor-pointer"
              >
                <option value="">Select Faculty</option>
                {staffMembers.map(s => (
                  <option key={s.id} value={s.id}>{s.full_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex flex-col gap-3">
            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full py-4 rounded-2xl text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg transition-all transform active:scale-[0.98] ${
                loading 
                  ? "bg-slate-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/25"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : "Create Subject"}
            </button>
            
            <button 
              type="button"
              onClick={() => navigate('/manage-subject')}
              className="w-full py-4 rounded-2xl text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
            >
              Cancel and Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubject;