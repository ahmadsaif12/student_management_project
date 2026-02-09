import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('accounts/profile/');
        const myProfile = res.data.my_profile || {};
        const adminData = myProfile.admin || {};

        setProfile({
          ...myProfile,
          ...adminData,
          user_type: res.data.user_type,
          first_name: adminData.first_name || myProfile.first_name || '',
          last_name: adminData.last_name || myProfile.last_name || '',
          id: adminData.id || myProfile.id || '00'
        });
      } catch (err) {
        console.error("Profile Fetch Error:", err);
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="w-16 h-16 border-4 border-t-indigo-500 border-indigo-500/20 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-6 md:p-12 font-sans selection:bg-indigo-100">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">User Profile</h1>
            <div className="h-1.5 w-20 bg-indigo-600 rounded-full"></div>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md"
          >
            <i className="fas fa-chevron-left text-xs group-hover:-translate-x-1 transition-transform"></i> 
            Return Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Identity Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/60 border border-white p-8 sticky top-10">
              <div className="relative w-40 h-40 mx-auto mb-8">
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  {profile?.first_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-white rounded-2xl shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
              </div>

              <div className="text-center space-y-1 mb-8">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  {profile?.first_name} {profile?.last_name}
                </h2>
                <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.15em] rounded-full">
                  {profile?.user_type === "1" ? "Administrator" : profile?.user_type === "2" ? "Staff" : "Student"}
                </span>
              </div>
              
              <div className="space-y-3">
                <IdentityStats label="Username" value={`@${profile?.username}`} icon="fa-at" />
                <IdentityStats label="System ID" value={`#USR-${profile?.id?.toString().padStart(4, '0')}`} icon="fa-fingerprint" />
              </div>
            </div>
          </div>

          {/* Right Column: Information Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="bg-slate-900 px-10 py-8 flex items-center justify-between">
                <h3 className="text-white font-bold flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <i className="fas fa-address-card text-indigo-400"></i>
                  </div>
                  Account Information
                </h3>
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Read Only</span>
              </div>
              
              <div className="p-10">
                {message.text && (
                  <div className="mb-8 p-5 bg-rose-50 border-l-4 border-rose-500 rounded-r-2xl text-rose-600 text-sm font-bold flex items-center gap-3">
                    <i className="fas fa-circle-exclamation"></i>
                    {message.text}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <ProfileField label="First Name" value={profile?.first_name} icon="fa-user" />
                  <ProfileField label="Last Name" value={profile?.last_name} icon="fa-user-tag" />
                  <ProfileField label="Email Address" value={profile?.email} icon="fa-envelope-open" />
                  <ProfileField 
                    label="Last Active Session" 
                    value={
                      profile?.last_login 
                        ? new Date(profile.last_login).toLocaleString('en-US', {
                            month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          }) 
                        : 'No session history'
                    } 
                    icon="fa-clock-rotate-left" 
                  />
                  
                  {profile?.gender && <ProfileField label="Gender" value={profile?.gender} icon="fa-venus-mars" />}
                  {profile?.address && <ProfileField label="Location" value={profile?.address} icon="fa-location-dot" className="md:col-span-2" />}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const IdentityStats = ({ label, value, icon }) => (
  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors">
    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400">
      <i className={`fas ${icon} text-sm`}></i>
    </div>
    <div className="text-left">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  </div>
);

const ProfileField = ({ label, value, icon, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-hover:text-indigo-500 transition-colors">
        <i className={`fas ${icon} text-sm`}></i>
      </div>
      <input 
        type="text" 
        readOnly 
        value={value || 'Not Provided'} 
        className="w-full bg-slate-50/50 border border-slate-200 rounded-[1.25rem] py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none hover:border-indigo-200 hover:bg-white transition-all cursor-default"
      />
    </div>
  </div>
);

export default Profile;