import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStudent } from '../api/authService';
import { getCourses, getSessions } from '../api/curriculumService';

const AddStudent = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    raw_email: '',
    password: '',
    first_name: '',
    last_name: '',
    gender: 'Male',
    address: '',
    course_id: '',
    session_year_id: '',
    profile_pic: null
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [c, s] = await Promise.all([getCourses(), getSessions()]);
        setCourses(c);
        setSessions(s);
      } catch (err) {
        console.error("Failed to load dependency data:", err);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    try {
      await addStudent(data);
      navigate('/manage-student');
    } catch (err) {
      alert("Registration failed. Please check the console for details.");
      console.error("Submission Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-semibold text-slate-700";
  const labelStyle = "text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block";

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 flex items-center justify-center font-sans">
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header Header */}
        <div className="bg-[#0f172a] p-10 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Register Student</h3>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Enrollment Division</p>
          </div>
          <i className="fas fa-user-plus text-4xl opacity-20"></i>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Section: Account Credentials */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-indigo-600 uppercase tracking-tighter border-b pb-2 mb-4">Account Access</h4>
              <div>
                <label className={labelStyle}>Email Address</label>
                <input type="email" placeholder="saif.student@jecrc.ac.in" required className={inputStyle} 
                  onChange={e => setFormData({...formData, raw_email: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Access Password</label>
                <input type="password" placeholder="••••••••" required className={inputStyle} 
                  onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>

            {/* Section: Personal Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-indigo-600 uppercase tracking-tighter border-b pb-2 mb-4">Personal Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>First Name</label>
                  <input type="text" placeholder="John" required className={inputStyle} 
                    onChange={e => setFormData({...formData, first_name: e.target.value})} />
                </div>
                <div>
                  <label className={labelStyle}>Last Name</label>
                  <input type="text" placeholder="Doe" required className={inputStyle} 
                    onChange={e => setFormData({...formData, last_name: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Gender Identity</label>
                  <select className={inputStyle} value={formData.gender} 
                    onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Course Stream</label>
                  <select required className={inputStyle} 
                    onChange={e => setFormData({...formData, course_id: e.target.value})}>
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Full Width Section */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelStyle}>Residential Address</label>
                <input type="text" placeholder="Street name, City, State" required className={inputStyle} 
                  onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Academic Session</label>
                <select required className={inputStyle} 
                  onChange={e => setFormData({...formData, session_year_id: e.target.value})}>
                  <option value="">Select Session Range</option>
                  {sessions.map(s => <option key={s.id} value={s.id}>{s.session_start_year} - {s.session_end_year}</option>)}
                </select>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="md:col-span-2">
               <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-[2rem] text-center hover:border-indigo-400 transition-all group">
                  <i className="fas fa-cloud-upload-alt text-3xl text-slate-300 group-hover:text-indigo-500 mb-3 block"></i>
                  <label className={labelStyle}>Upload Identification Photo</label>
                  <input type="file" className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer" 
                   onChange={e => setFormData({...formData, profile_pic: e.target.files[0]})} />
               </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`flex-1 py-4 rounded-2xl font-black text-[11px] tracking-[0.2em] text-white shadow-xl shadow-indigo-200 transition-all transform active:scale-95 ${loading ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {loading ? 'PROCESSING DATA...' : 'FINALIZE REGISTRATION'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/manage-student')}
              className="px-8 py-4 rounded-2xl font-black text-[11px] tracking-[0.2em] text-slate-400 hover:bg-slate-100 transition-all"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;