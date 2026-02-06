import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authService';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email_prefix: '', 
    role: 'student',  
    password: '',
    confirm_password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    const cleanPrefix = formData.email_prefix.trim().split('@')[0].split('.')[0];
    const finalEmail = `${cleanPrefix}.${formData.role}@jecrc.ac.in`.toLowerCase();

    try {
      await registerUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: finalEmail,
        password: formData.password
      });
      alert(`Registration Successful! Login with: ${finalEmail}`);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Username might be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <div className="bg-[#1e293b]/50 backdrop-blur-xl w-full max-w-[500px] p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-700/50">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 mb-4">
            <i className="fas fa-user-plus text-white text-2xl"></i>
          </div>
          <h2 className="text-white text-3xl font-black tracking-tight uppercase">Join JECRC</h2>
          <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-[0.3em]">Institutional Access</p>
        </div>
        
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 text-[11px] p-3 rounded-xl mb-6 flex items-center gap-3 animate-shake">
            <i className="fas fa-exclamation-circle"></i>
            <span className="font-bold uppercase tracking-wider">{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-500 text-[10px] uppercase font-black tracking-widest ml-1">First Name</label>
              <input name="first_name" type="text" required onChange={handleChange} placeholder="John" 
                className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 text-[10px] uppercase font-black tracking-widest ml-1">Last Name</label>
              <input name="last_name" type="text" required onChange={handleChange} placeholder="Doe"
                className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 text-[10px] uppercase font-black tracking-widest ml-1">Portal Role</label>
            <div className="relative">
              <select name="role" value={formData.role} onChange={handleChange} 
                className="w-full bg-slate-900/50 border border-slate-700 text-blue-400 px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500 font-bold appearance-none cursor-pointer">
                <option value="student">Student</option>
                <option value="staff">Staff Member</option>
                <option value="hod">Admin/HOD</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] pointer-events-none"></i>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 text-[10px] uppercase font-black tracking-widest ml-1">Generated Identity</label>
            <div className="flex flex-col space-y-2">
               <input name="email_prefix" type="text" required placeholder="Enter ID (e.g. alex)" onChange={handleChange} 
                 className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
               <div className="bg-blue-500/10 border border-blue-500/20 py-2 px-4 rounded-lg flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Login ID Preview:</span>
                  <span className="text-blue-400 text-[11px] font-black lowercase italic">
                    {formData.email_prefix || 'id'}.{formData.role}@jecrc.ac.in
                  </span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-500 text-[10px] uppercase font-black tracking-widest ml-1">Security Key</label>
              <input name="password" type="password" required onChange={handleChange} autoComplete="new-password"
                className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 text-[10px] uppercase font-black tracking-widest ml-1">Verify</label>
              <input name="confirm_password" type="password" required onChange={handleChange} autoComplete="new-password"
                className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          
          <button type="submit" disabled={loading} 
            className="w-full bg-blue-600 text-white py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 mt-4 hover:bg-blue-500 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:transform-none">
            {loading ? <i className="fas fa-circle-notch animate-spin mr-2"></i> : null}
            {loading ? "Initializing..." : "Register Identity"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/50 flex flex-col items-center">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Existing Personnel?</p>
          <button onClick={() => navigate('/login')} className="text-blue-400 text-xs font-black uppercase tracking-widest hover:text-blue-300 transition-colors">
            Access System <i className="fas fa-arrow-right ml-1 text-[8px]"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;