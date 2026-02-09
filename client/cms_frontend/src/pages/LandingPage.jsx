import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  // Simple scroll function
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/operations/contact/send/', formData);
      setStatus({ type: 'success', msg: 'Thank you! Your message has been sent.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ type: '', msg: '' }), 5000);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans overflow-hidden ${isDarkMode ? 'bg-[#020617] text-slate-300' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] blur-[160px] rounded-full animate-pulse-slow ${isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-200/40'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] blur-[140px] rounded-full animate-pulse-slow delay-1000 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-200/30'}`} />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-[100] backdrop-blur-2xl border-b py-4 px-6 md:px-20 flex justify-between items-center transition-all ${isDarkMode ? 'bg-[#020617]/40 border-white/5' : 'bg-white/60 border-black/5'}`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
            <span className="text-white font-bold text-xl italic">S</span>
          </div>
          <div className="flex flex-col">
            <span className={`font-black tracking-widest text-lg leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>SAIF</span>
            <span className="text-[9px] text-indigo-500 font-bold tracking-[0.3em] uppercase opacity-80">CMS</span>
          </div>
        </div>

        <div className="flex items-center gap-6 md:gap-10">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-black/5 text-indigo-600 hover:bg-black/10'}`}>
            {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
          </button>
          <button onClick={() => handleScroll('contact')} className="hidden md:block text-[10px] font-bold uppercase tracking-widest hover:text-indigo-500 transition-colors">Contact</button>
          <button onClick={() => navigate('/login')} className={`bg-indigo-600 text-white px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/20`}>
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 md:px-20 pt-20 pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-3/5 text-center lg:text-left">
            <h1 className={`text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.9] uppercase mb-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              CMS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 italic font-medium">Design.</span>
            </h1>
            <p className={`text-lg md:text-xl font-medium max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0 opacity-80 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              I build high-quality websites and applications using Django and React. Focus on clean code, fast performance, and beautiful user experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => handleScroll('contact')} className="px-10 py-4 bg-indigo-600 text-white font-bold uppercase text-[11px] tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20">
                Get In Touch
              </button>
              <a href="https://github.com/ahmadsaif12" target="_blank" rel="noreferrer" className={`flex items-center gap-3 px-8 py-4 border rounded-xl transition-all ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}>
                <i className="fab fa-github text-xl"></i>
                <span className="text-[11px] font-bold uppercase tracking-widest">My Work</span>
              </a>
            </div>
          </div>

          <div className="w-full lg:w-2/5 relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full opacity-30 animate-pulse" />
            <div className={`relative border p-3 rounded-[3rem] shadow-2xl transition-all duration-700 hover:rotate-1 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
              <img src="/hero_books.png" alt="Project Preview" className="rounded-[2.5rem] w-full h-auto grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                   onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600/6366f1/ffffff?text=MY+PROJECTS' }} />
            </div>
          </div>
        </div>
      </main>

      {/* Contact Section */}
      <section id="contact" className={`relative z-10 py-24 transition-colors border-y ${isDarkMode ? 'bg-indigo-950/10 border-white/5' : 'bg-indigo-50/50 border-black/5'}`}>
        <div className="container mx-auto px-6 md:px-20 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-indigo-500 text-[11px] font-black uppercase tracking-[0.4em] mb-4">Contact Me</h2>
              <h3 className={`text-5xl font-black tracking-tight uppercase mb-12 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Start A <br />
                <span className={`${isDarkMode ? 'text-slate-700' : 'text-slate-300'} italic`}>Project.</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-8">
                <ContactItem isDark={isDarkMode} icon="fa-envelope" title="Email" detail="ahmads87237@gmail.com" link="mailto:ahmads87237@gmail.com" />
                <ContactItem isDark={isDarkMode} icon="fa-linkedin-in" title="LinkedIn" detail="Saif Ahmad" link="https://linkedin.com/in/saif-ahmad" />
                <ContactItem isDark={isDarkMode} icon="fa-github" title="GitHub" detail="ahmadsaif12" link="https://github.com/ahmadsaif12" />
                <ContactItem isDark={isDarkMode} icon="fa-instagram" title="Instagram" detail="@saifahmad976" link="https://instagram.com/saifahmad976" />
              </div>
            </div>

            <div className="relative">
              <form onSubmit={handleSubmit} className={`relative p-8 md:p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl space-y-6 border ${isDarkMode ? 'bg-[#0d1117]/60 border-white/10' : 'bg-white/80 border-black/10'}`}>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField isDark={isDarkMode} label="Name" type="text" placeholder="John Doe" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
                  <InputField isDark={isDarkMode} label="Email" type="email" placeholder="john@example.com" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                </div>
                <InputField isDark={isDarkMode} label="Subject" type="text" placeholder="I have an idea" value={formData.subject} onChange={(v) => setFormData({...formData, subject: v})} />
                <div className="space-y-2">
                  <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 opacity-60 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Message</label>
                  <textarea required rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className={`w-full rounded-2xl px-5 py-4 text-sm outline-none transition-all resize-none border ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-indigo-500' : 'bg-black/5 border-black/10 text-slate-900 focus:border-indigo-500'}`} placeholder="Tell me about your project..." />
                </div>

                {status.msg && (
                  <div className={`p-4 rounded-xl text-[10px] font-bold uppercase text-center ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {status.msg}
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white hover:bg-indigo-500 font-bold uppercase tracking-widest text-[11px] py-5 rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-lg">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center opacity-50">
         <p className="text-[10px] font-bold uppercase tracking-[0.4em]">
           &copy; 2026 SAIF AHMAD &bull; Web Developer
         </p>
      </footer>
    </div>
  );
};

/* --- Visual Helpers --- */

const InputField = ({ label, type, placeholder, value, onChange, isDark }) => (
  <div className="space-y-2">
    <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 opacity-60 ${isDark ? 'text-white' : 'text-slate-900'}`}>{label}</label>
    <input type={type} required value={value} onChange={(e) => onChange(e.target.value)}
      className={`w-full h-14 rounded-xl px-5 text-sm outline-none transition-all border ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-indigo-500' : 'bg-black/5 border-black/10 text-slate-900 focus:border-indigo-500'}`} placeholder={placeholder} />
  </div>
);

const ContactItem = ({ icon, title, detail, link, isDark }) => (
  <a href={link} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-indigo-500 transition-all group-hover:bg-indigo-600 group-hover:text-white shadow-sm ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
      <i className={`fab ${icon} text-lg`}></i>
    </div>
    <div>
      <h5 className="text-[9px] font-bold uppercase tracking-widest opacity-50 mb-0.5">{title}</h5>
      <p className={`font-bold text-sm group-hover:text-indigo-500 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{detail}</p>
    </div>
  </a>
);

export default LandingPage;