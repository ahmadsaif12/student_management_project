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

  // Load Courses and Sessions for dropdowns
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

    // Create FormData object for multipart/form-data (image support)
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    try {
      await addStudent(data);
      alert("Student registered successfully!");
      navigate('/manage-student');
    } catch (err) {
      // Logic to display specific field errors from Django
      const errorMessage = typeof err === 'object' 
        ? Object.entries(err).map(([k, v]) => `${k}: ${v}`).join('\n')
        : "Submission failed";
      
      alert(errorMessage);
      console.error("Submission Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f6f9] ml-64 p-8">
      <div className="max-w-4xl w-full mx-auto bg-white rounded shadow-sm border border-slate-200">
        <div className="bg-[#007bff] p-4 text-white font-bold text-xs uppercase tracking-widest">
          Register New Student Profile
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-6">
          {/* Email & Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
            <input type="email" placeholder="e.g. name.student@domain.com" required className="border p-2 rounded text-sm" 
              onChange={e => setFormData({...formData, raw_email: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Password</label>
            <input type="password" placeholder="••••••••" required className="border p-2 rounded text-sm" 
              onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          {/* Names */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">First Name</label>
            <input type="text" placeholder="John" required className="border p-2 rounded text-sm" 
              onChange={e => setFormData({...formData, first_name: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Last Name</label>
            <input type="text" placeholder="Doe" required className="border p-2 rounded text-sm" 
              onChange={e => setFormData({...formData, last_name: e.target.value})} />
          </div>

          {/* Gender & Address */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Gender</label>
            <select className="border p-2 rounded text-sm" value={formData.gender} 
              onChange={e => setFormData({...formData, gender: e.target.value})}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Residential Address</label>
            <input type="text" placeholder="123 Street, City" required className="border p-2 rounded text-sm" 
              onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>

          {/* Academic Selects */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Assign Course</label>
            <select required className="border p-2 rounded text-sm" 
              onChange={e => setFormData({...formData, course_id: e.target.value})}>
              <option value="">Select Course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Session Year</label>
            <select required className="border p-2 rounded text-sm" 
              onChange={e => setFormData({...formData, session_year_id: e.target.value})}>
              <option value="">Select Session</option>
              {sessions.map(s => <option key={s.id} value={s.id}>{s.session_start_year} - {s.session_end_year}</option>)}
            </select>
          </div>

          {/* Profile Pic */}
          <div className="col-span-2 bg-slate-50 p-4 border border-dashed border-slate-300 rounded">
             <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Student Photo</label>
             <input type="file" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
              onChange={e => setFormData({...formData, profile_pic: e.target.files[0]})} />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`col-span-2 py-3 rounded font-bold text-xs tracking-widest text-white transition ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#007bff] hover:bg-blue-700'}`}
          >
            {loading ? 'PROCESSING...' : 'REGISTER STUDENT'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;