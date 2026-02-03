import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      
      const response = await loginUser({
        email: formData.email.toLowerCase().trim(), 
        password: formData.password
      });
      
    
      if (response.user_type === '1') navigate('/admin-home');
      else if (response.user_type === '2') navigate('/staff-home');
      else navigate('/student-home');

    } catch (err) {
      setError(err.response?.data?.error || "Invalid Credentials. Use your full email!");
    }
  };

  return (
    <div className="min-h-screen bg-[#34495e] flex items-center justify-center p-6">
      <div className="bg-[#1e272e] w-full max-w-[400px] p-10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-800 text-center">
        <h2 className="text-white text-4xl font-serif mb-2 italic tracking-tight">Login</h2>
        <p className="text-gray-500 text-xs mb-8 uppercase tracking-widest">Student Management System</p>
        
        {error && <p className="text-red-500 text-[10px] mb-4 bg-red-500/10 p-2 rounded border border-red-500 uppercase font-bold">⚠️ {error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-left">
            <label className="text-gray-400 text-[10px] uppercase font-bold ml-1">Full Email Address</label>
            <input 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="alex.student@jecrc.ac.in" 
              className="w-full bg-gray-900/50 border border-gray-700 text-white mt-1 p-3 rounded-md text-sm outline-none focus:border-[#1e90ff] transition-all"
              required
            />
          </div>

          <div className="text-left">
            <label className="text-gray-400 text-[10px] uppercase font-bold ml-1">Password</label>
            <input 
              name="password" 
              type="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="••••••••" 
              className="w-full bg-gray-900/50 border border-gray-700 text-white mt-1 p-3 rounded-md text-sm outline-none focus:border-[#1e90ff] transition-all"
              required
            />
          </div>

          <button type="submit" className="w-full bg-[#273c75] text-white py-3 rounded-md text-sm font-bold uppercase tracking-widest hover:bg-[#1e90ff] transition-all">
            Log In
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-800">
          <button onClick={() => navigate('/register')} className="text-[#1e90ff] text-xs font-bold hover:underline">
            Not Registered Yet? Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;