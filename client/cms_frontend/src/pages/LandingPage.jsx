import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Navbar - Sticky with Backdrop Blur */}
      <nav className="bg-cms-dark py-4 px-8 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Logo Circle - Fixed visibility */}
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border border-gray-200">
            <span className="text-black font-black text-[10px]">JECRC</span>
          </div>
          <h1 className="text-white text-xl font-bold tracking-widest hidden sm:block">
            WELCOME TO CMS
          </h1>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/login')}
            className="text-cms-green border-2 border-cms-green px-5 py-1.5 rounded-md font-semibold hover:bg-cms-green hover:text-white transition-all duration-300 text-sm"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="text-cms-green border-2 border-cms-green px-5 py-1.5 rounded-md font-semibold hover:bg-cms-green hover:text-white transition-all duration-300 text-sm"
          >
            Register
          </button>
          <button className="text-cms-red border-2 border-cms-red px-5 py-1.5 rounded-md font-semibold hover:bg-cms-red hover:text-white transition-all duration-300 text-sm">
            Contact Us
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center container mx-auto px-6 py-12 gap-10 lg:gap-20">
        
        {/* Left Side: Illustration */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end animate-in fade-in slide-in-from-left duration-1000">
          <img 
            src="/hero_books.png" 
            alt="CMS Illustration" 
            className="max-w-[450px] lg:max-w-[600px] w-full h-auto drop-shadow-2xl"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Hero+Image+Missing' }}
          />
        </div>

        {/* Right Side: Large Stylized Typography */}
        <div className="w-full md:w-1/2 flex flex-col items-start leading-[0.85] font-serif uppercase italic select-none animate-in fade-in slide-in-from-right duration-1000">
          <h1 className="text-[75px] lg:text-[120px] text-hero-red font-black tracking-tighter hero-text-shadow">
            College
          </h1>
          <h1 className="text-[75px] lg:text-[120px] text-hero-green font-black tracking-tighter hero-text-shadow">
            Management
          </h1>
          <h1 className="text-[75px] lg:text-[120px] text-hero-cyan font-black tracking-tighter hero-text-shadow">
            System
          </h1>
        </div>
      </div>

      {/* Footer (Optional addition for a finished look) */}
      <footer className="bg-gray-100 py-4 text-center text-gray-500 text-xs">
        © 2026 JECRC Student Management Project. All Rights Reserved.
      </footer>
    </div>
  );
};

export default LandingPage;