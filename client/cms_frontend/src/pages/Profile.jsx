import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../api/authService';
import axiosInstance from '../api/axiosInstance';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
            <p className="text-slate-500 font-medium">Manage your personal information and security preferences.</p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Identity Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden text-center p-8">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-full flex items-center justify-center text-white text-4xl font-black border-4 border-white shadow-xl mx-auto">
                  {profile?.first_name?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full"></div>
              </div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {profile?.first_name} {profile?.last_name}
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">
                {profile?.user_type === "1" ? "System Administrator" : profile?.user_type === "2" ? "Staff Member" : "Student"}
              </p>
              
              <div className="flex flex-col gap-2">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Username</p>
                  <p className="text-sm font-bold text-slate-700">@{profile?.username}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase">System ID</p>
                  <p className="text-sm font-bold text-slate-700">#USR-00{profile?.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Information Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <i className="fas fa-user-edit text-indigo-500"></i> Personal Details
                </h3>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField label="First Name" value={profile?.first_name} icon="fas fa-id-card" />
                  <ProfileField label="Last Name" value={profile?.last_name} icon="fas fa-id-card" />
                  <ProfileField label="Email Address" value={profile?.email} icon="fas fa-envelope" />
                  <ProfileField label="Last Login" value={new Date(profile?.last_login).toLocaleDateString()} icon="fas fa-clock" />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <i className="fas fa-shield-check text-rose-500"></i> Security & Access
                </h3>
              </div>
              <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h4 className="text-sm font-black text-slate-800">Password Management</h4>
                  <p className="text-xs text-slate-500 font-medium">Keep your account secure by rotating your password regularly.</p>
                </div>
                <button className="px-6 py-3 bg-slate-900 text-white text-xs font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest shadow-lg shadow-slate-200">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Internal Field Component for consistent styling */
const ProfileField = ({ label, value, icon }) => (
  <div className="group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-hover:text-indigo-500 transition-colors">
        <i className={icon}></i>
      </div>
      <input 
        type="text" 
        readOnly 
        value={value || ''} 
        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all"
      />
    </div>
  </div>
);

export default Profile;