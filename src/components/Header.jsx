import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

const FreelanceLanding = () => {
  // Main Image Floating Animation
  const floatingImage = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-900 overflow-hidden">
      
      {/* --- AMBIENT BACKGROUND GLOW --- */}
      <div className="fixed -top-24 -left-24 w-[600px] h-[600px] bg-blue-50/60 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 -right-24 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[140px] pointer-events-none" />

      {/* --- THE ROAMING STAR --- 
          This star moves across the entire viewport width and height 
      */}
      <motion.div 
        className="fixed z-50 text-blue-400/40 pointer-events-none"
        animate={{ 
          x: [0, 800, 200, 1200, 0], // Moving across screen width
          y: [0, 400, 800, 300, 0],   // Moving across screen height
          rotate: 360 
        }}
        transition={{ 
          duration: 25, // Slow, elegant movement
          repeat: Infinity, 
          ease: "linear",
          rotate: { duration: 4, repeat: Infinity, ease: "linear" } 
        }}
      >
        <Sparkles size={50} fill="currentColor" />
      </motion.div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-16 py-8 max-w-[1440px] mx-auto">
        <div className="text-2xl font-black tracking-tighter text-blue-700">LOGO</div>
        
        <div className="flex items-center gap-10 font-medium text-slate-600">
          {['Hire Freelancer', 'Find Work', 'Find Job', 'Sign In'].map((item) => (
            <a key={item} href="#" className="relative group py-1 transition-colors hover:text-blue-700">
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          
          {/* GET STARTED BUTTON WITH GLOW SHADOW */}
          <button className="relative bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_15px_30px_-5px_rgba(59,130,246,0.6)]">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-[1440px] mx-auto px-16 mt-16 grid grid-cols-12 gap-8 items-center">
        
        {/* Left Content */}
        <div className="col-span-7 pr-12">
          <h1 className="text-[80px] font-bold leading-[1.1] tracking-tight text-slate-900">
            Hire Top Talent. <br />
            <span className="text-blue-700">Work Your Way.</span>
          </h1>

          <p className="mt-8 text-xl text-slate-500 max-w-xl leading-relaxed">
            Connect with world-class freelancers and agencies to bring your projects to life. 
            From design to development, find the perfect talent for your needs.
          </p>

          {/* Search Bar */}
          <div className="relative mt-12 max-w-2xl group">
            <div className="relative flex items-center">
              <Search className="absolute left-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={22} />
              <input 
                type="text" 
                placeholder="Search for any service..." 
                className="w-full pl-14 pr-40 py-5 border border-slate-200 bg-white/80 backdrop-blur-md rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100/50 shadow-sm transition-all text-lg"
              />
              <button className="absolute right-3 bg-blue-700 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-md">
                Search
              </button>
            </div>
          </div>

          <div className="flex gap-6 mt-16">
            <button className="flex items-center gap-3 px-8 py-4 border-2 border-slate-100 bg-white/50 backdrop-blur-sm rounded-full font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50 transition-all">
              Hire a Freelancer <ArrowRight size={20} />
            </button>
            <button className="px-10 py-4 border-2 border-slate-100 bg-white/50 backdrop-blur-sm rounded-full font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50 transition-all">
              Find Work
            </button>
          </div>
        </div>

        {/* Right Visuals */}
        <div className="col-span-5 relative flex justify-end">
          <motion.div 
            variants={floatingImage}
            animate="animate"
            className="relative z-0 rounded-[50px] overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.15)] border-[12px] border-white w-full aspect-[4/5]"
          >
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" 
              alt="Workspace"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Floating Stats Card 1 */}
          <motion.div 
            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-12 top-1/4 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-4 z-10"
          >
            <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-200">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="font-extrabold text-xl text-slate-800">+127 Projects</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed Today</p>
            </div>
          </motion.div>

          {/* Floating Stats Card 2 */}
          <motion.div 
            animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 bottom-20 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-4 z-10"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <div className="w-4 h-4 bg-white rounded-full opacity-80" />
            </div>
            <div>
              <p className="font-extrabold text-xl text-slate-800">98% Success</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client Satisfaction</p>
            </div>
          </motion.div>
        </div>

      </main>
    </div>
  );
};

export default FreelanceLanding;