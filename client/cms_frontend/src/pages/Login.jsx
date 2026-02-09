import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    localStorage.clear(); // Wipe previous session data

    try {
      const response = await loginUser({
        email: formData.email.toLowerCase().trim(), 
        password: formData.password
      });

      // --- CRITICAL FIX: Extracting nested user data ---
      // Your Django response sends the name inside the 'user' object
      const userData = response.user || {};
      const fullName = userData.first_name && userData.last_name 
        ? `${userData.first_name} ${userData.last_name}` 
        : 'Student User';

      // Unified storage keys
      localStorage.setItem('access_token', response.access || response.token); 
      localStorage.setItem('user_role', String(response.user_type)); 
      localStorage.setItem('user_name', fullName);
      localStorage.setItem('user_email', userData.email || '');

      const role = String(response.user_type);
      
      if (role === '1') navigate('/admin-home');
      else if (role === '2') navigate('/staff-home');
      else if (role === '3') navigate('/student-home');
      else {
        setError("Account role mismatch. Contact system admin.");
        localStorage.clear();
      }

    } catch (err) {
      setError(err.response?.data?.error || "Access Denied. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]"></div>

      <div className="bg-[#1e293b]/40 backdrop-blur-2xl w-full max-w-[420px] p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-700/50">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-6">
            <i className="fas fa-shield-check text-white text-2xl"></i>
          </div>
          <h2 className="text-white text-3xl font-black tracking-tight uppercase">Welcome Back</h2>
          <p className="text-slate-400 text-[10px] mt-2 font-black uppercase tracking-[0.3em]">Institutional Gateway</p>
        </div>
        
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 text-[11px] p-4 rounded-2xl mb-8 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
            <i className="fas fa-lock-alt"></i>
            <span className="font-bold uppercase tracking-wider">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-slate-500 text-[10px] uppercase font-black tracking-widest ml-1">Email Identity</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <i className="fas fa-envelope text-sm"></i>
              </span>
              <input 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="name.role@jecrc.ac.in" 
                className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-slate-900 transition-all placeholder:text-slate-600"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-slate-500 text-[10px] uppercase font-black tracking-widest ml-1">Secret Key</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <i className="fas fa-key text-sm"></i>
              </span>
              <input 
                name="password" 
                type="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••" 
                className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-slate-900 transition-all placeholder:text-slate-600"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:bg-slate-700 disabled:transform-none mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-circle-notch animate-spin"></i> Verifying...
              </span>
            ) : "Establish Session"}
          </button>
        </form>
        
        <div className="mt-10 pt-6 border-t border-slate-700/50 text-center">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">New to JECRC?</p>
          <button 
            onClick={() => navigate('/register')} 
            className="text-blue-400 text-xs font-black uppercase tracking-widest hover:text-blue-300 transition-colors"
          >
            Create Credentials <i className="fas fa-arrow-right ml-1 text-[8px]"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;