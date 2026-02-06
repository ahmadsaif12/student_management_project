import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-200 overflow-x-hidden relative">
      {/* Background Mesh Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      {/* Glowing Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] z-0"></div>

      {/* Navbar */}
      <nav className="bg-[#1e293b]/80 backdrop-blur-md py-4 px-8 flex justify-between items-center sticky top-0 z-50 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fas fa-university text-white text-sm"></i>
          </div>
          <h1 className="text-white text-lg font-black tracking-widest hidden sm:block">
            SAIF <span className="text-blue-500 text-xs font-bold ml-1 tracking-normal uppercase opacity-70 italic">CMS PROJECTS</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-slate-300 text-xs font-black uppercase tracking-widest hover:text-white transition-all"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center container mx-auto px-6 py-12 gap-10 lg:gap-20 relative z-10">
        
        {/* Left Side: Typography */}
        <div className="w-full md:w-1/2 flex flex-col items-start leading-[0.8] select-none animate-in fade-in slide-in-from-left duration-1000 order-2 md:order-1">
          <h1 className="text-[60px] lg:text-[110px] text-white font-black tracking-tighter uppercase drop-shadow-2xl">
            College
          </h1>
          <h1 className="text-[60px] lg:text-[110px] text-blue-500 font-black tracking-tighter uppercase italic opacity-90">
            Management
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <h1 className="text-[60px] lg:text-[110px] text-slate-700 font-black tracking-tighter uppercase">
              System
            </h1>
            <div className="h-2 w-20 bg-blue-600 rounded-full mt-4 hidden lg:block"></div>
          </div>
          
          <p className="mt-8 text-slate-500 text-xs font-bold uppercase tracking-[0.4em] leading-relaxed max-w-sm">
            The next generation of academic logistics and student administration.
          </p>
        </div>

        {/* Right Side: Visual Content */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end animate-in fade-in zoom-in duration-1000 order-1 md:order-2">
          <div className="relative group">
            {/* Image Placeholder with Styling */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src="/hero_books.png" 
              alt="CMS Illustration" 
              className="relative rounded-[2rem] max-w-[400px] lg:max-w-[550px] w-full h-auto object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600/1e293b/4f46e5?text=JECRC+CMS' }}
            />
          </div>
        </div>
      </div>

      {/* Statistics Section (Added for better UI) */}
      <div className="bg-slate-900/50 border-y border-slate-800 py-10 relative z-10">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <Stat icon="fa-user-graduate" label="Students" value="5000+" />
            <Stat icon="fa-chalkboard-teacher" label="Faculty" value="200+" />
            <Stat icon="fa-book" label="Courses" value="45" />
            <Stat icon="fa-award" label="Accredited" value="A+" />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-slate-800/50 mt-auto bg-[#0f172a] relative z-10">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
          © 2026 JECRC Student Management Project • Built with React & Django
        </p>
      </footer>
    </div>
  );
};

// Sub-component for clean code
const Stat = ({ icon, label, value }) => (
    <div className="text-center group hover:-translate-y-1 transition-transform">
        <i className={`fas ${icon} text-blue-500 text-lg mb-3 block opacity-50`}></i>
        <h4 className="text-white text-xl font-black">{value}</h4>
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{label}</p>
    </div>
);

export default LandingPage;