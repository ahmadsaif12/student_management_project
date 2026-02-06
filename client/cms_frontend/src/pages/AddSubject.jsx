import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // Use your instance!
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
        const [courseData, staffRes] = await Promise.all([
          getCourses(),
          axiosInstance.get('accounts/staff/')
        ]);
        setCourses(courseData);
        setStaffMembers(staffRes.data);
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
      alert("Error: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#1e293b] p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-black tracking-tight">Add New Subject</h3>
            <p className="text-slate-400 text-sm mt-1 font-medium">Link subjects to courses and assign staff.</p>
          </div>
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Subject Name */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
              Subject Name
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="fas fa-book-open text-sm"></i>
              </span>
              <input
                type="text"
                required
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Advanced Python Programming"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                Course
              </label>
              <select
                required
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:bg-white transition-all outline-none font-medium text-slate-700 appearance-none cursor-pointer"
              >
                <option value="">Select Course</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.course_name}</option>
                ))}
              </select>
            </div>

            {/* Staff Assignment */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                Assign Staff
              </label>
              <select
                required
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:bg-white transition-all outline-none font-medium text-slate-700 appearance-none cursor-pointer"
              >
                <option value="">Select Staff</option>
                {staffMembers.map(s => (
                  <option key={s.id} value={s.id}>{s.full_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/manage-subject')}
              className="flex-1 py-4 rounded-2xl text-slate-500 text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-[2] py-4 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-lg transition-all ${
                loading 
                ? "bg-slate-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-circle-notch animate-spin"></i> Processing
                </span>
              ) : "Create Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubject;