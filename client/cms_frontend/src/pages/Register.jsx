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

    
    // "alex.student@gmail.com.student@jecrc.ac.in"
    const cleanPrefix = formData.email_prefix.trim().split('@')[0].split('.')[0];
    const finalEmail = `${cleanPrefix}.${formData.role}@jecrc.ac.in`.toLowerCase();

    try {
      await registerUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: finalEmail,
        password: formData.password
      });
      
      alert(`Registration Successful! Use this email to login: ${finalEmail}`);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Username might be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#34495e] flex items-center justify-center p-6">
      <div className="bg-[#1e272e] w-full max-w-[450px] p-10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-800 text-center">
        <h2 className="text-white text-4xl font-serif mb-2 italic tracking-tight">Signup</h2>
        <p className="text-gray-500 text-xs mb-6 uppercase tracking-widest">Create Your Account</p>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 text-[10px] p-2 rounded mb-4 text-left font-bold uppercase">⚠️ {error}</div>}

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 text-[10px] uppercase font-bold ml-1">First Name</label>
              <input name="first_name" type="text" required onChange={handleChange} className="w-full bg-transparent border-b-2 border-gray-700 text-white p-2 text-sm outline-none focus:border-[#1e90ff] transition-colors" />
            </div>
            <div>
              <label className="text-gray-500 text-[10px] uppercase font-bold ml-1">Last Name</label>
              <input name="last_name" type="text" required onChange={handleChange} className="w-full bg-transparent border-b-2 border-gray-700 text-white p-2 text-sm outline-none focus:border-[#1e90ff] transition-colors" />
            </div>
          </div>

          <div>
            <label className="text-gray-500 text-[10px] uppercase font-bold ml-1">Select Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-gray-900 border-b-2 border-gray-700 text-[#1e90ff] p-2 text-sm outline-none focus:border-[#1e90ff] mt-1 font-bold">
              <option value="student">Student</option>
              <option value="staff">Staff Member</option>
              <option value="hod">Admin/HOD</option>
            </select>
          </div>

          <div>
            <label className="text-gray-500 text-[10px] uppercase font-bold ml-1">Username (Name part only)</label>
            <div className="flex items-center">
               <input name="email_prefix" type="text" required placeholder="e.g. alex" onChange={handleChange} className="flex-1 bg-transparent border-b-2 border-gray-700 text-white p-2 text-sm outline-none focus:border-[#1e90ff]" />
               <span className="text-[#1e90ff] text-xs ml-2 font-bold">.{formData.role}@jecrc.ac.in</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-gray-500 text-[10px] uppercase font-bold ml-1">Password</label>
              <input name="password" type="password" required onChange={handleChange} className="w-full bg-transparent border-b-2 border-gray-700 text-white p-2 text-sm outline-none focus:border-[#1e90ff]" />
            </div>
            <div>
              <label className="text-gray-500 text-[10px] uppercase font-bold ml-1">Confirm</label>
              <input name="confirm_password" type="password" required onChange={handleChange} className="w-full bg-transparent border-b-2 border-gray-700 text-white p-2 text-sm outline-none focus:border-[#1e90ff]" />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-[#273c75] text-white py-3 rounded-md text-sm font-bold uppercase tracking-widest mt-6 hover:bg-[#1e90ff] transition-all disabled:opacity-50">
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>
        <button onClick={() => navigate('/login')} className="text-[#1e90ff] text-xs mt-6 font-bold hover:underline">Already have an account? Login</button>
      </div>
    </div>
  );
};

export default Register;