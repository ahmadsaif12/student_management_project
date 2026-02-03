import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const StaffAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    raw_email: '', 
    password: '', 
    first_name: '', 
    last_name: '',
    gender: 'Male', 
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // FIXED URL: Removed 'accounts/' prefix to avoid duplication
      await axiosInstance.post('staff/', formData);
      alert("Staff registered successfully!");
      navigate('/manage-staff');
    } catch (err) {
      console.error("Error details:", err.response?.data);
      
      // Dynamic error reporting
      if (err.response?.status === 404) {
        alert("Endpoint not found. Ensure your baseURL in axiosInstance is correct.");
      } else if (err.response?.data) {
        // This will show specific backend errors (e.g., email exists)
        const errorMsg = Object.entries(err.response.data)
          .map(([key, val]) => `${key}: ${val}`)
          .join('\n');
        alert("Registration Failed:\n" + errorMsg);
      } else {
        alert("An unexpected error occurred.");
      }
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] ml-64 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black uppercase tracking-widest">Register Staff</h1>
            <p className="text-[9px] text-slate-400 font-bold">SYSTEM ADMINISTRATION UNIT</p>
          </div>
          <button onClick={() => navigate('/manage-staff')} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-[10px] font-bold transition">VIEW LIST</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Official Email</label>
            <input type="email" required className="border p-3 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" 
              onChange={e => setFormData({...formData, raw_email: e.target.value})} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Password</label>
            <input type="password" required className="border p-3 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" 
              onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">First Name</label>
            <input type="text" required className="border p-3 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" 
              onChange={e => setFormData({...formData, first_name: e.target.value})} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Last Name</label>
            <input type="text" required className="border p-3 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" 
              onChange={e => setFormData({...formData, last_name: e.target.value})} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Gender</label>
            <select className="border p-3 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" 
              value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Address</label>
            <input type="text" required className="border p-3 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" 
              onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>
          
          <button type="submit" disabled={loading} 
            className="col-span-2 bg-slate-900 hover:bg-black text-white py-4 rounded-lg font-black text-xs tracking-widest transition shadow-lg mt-4 disabled:bg-slate-400">
            {loading ? 'PROCESSING...' : 'REGISTER STAFF MEMBER'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffAdd;