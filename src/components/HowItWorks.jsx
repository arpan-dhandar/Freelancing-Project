import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, MessageSquare, ShieldCheck, Sparkle } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Post Your Project",
    description: "Share your project details and requirements with our curated talent community",
    icon: <FileText className="w-6 h-6 text-white" />,
  },
  {
    id: 2,
    title: "Get Matched",
    description: "Our AI algorithm connects you with the best-fit freelancers for your needs",
    icon: <Users className="w-6 h-6 text-white" />,
  },
  {
    id: 3,
    title: "Collaborate Seamlessly",
    description: "Work together with built-in tools for communication and project management",
    icon: <MessageSquare className="w-6 h-6 text-white" />,
  },
  {
    id: 4,
    title: "Achieve Success",
    description: "Review deliverables and pay securely through our protected payment system",
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
  },
];

const HowItWorks = () => {
  return (
    <section className="pt-24 pb-64 px-6 bg-white flex flex-col items-center overflow-hidden font-sans">
      
      {/* 1. Header Section - Centered with substantial gap (mb-32) below it */}
      <div className="text-center mb-32 max-w-2xl relative">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          How It <span className="text-blue-600">Works</span>
        </h2>
        <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
          A streamlined process designed for success
        </p>
        
        {/* Decorative Sparkle from your screenshot */}
        <div className="absolute -top-10 -right-10 text-blue-200">
          <Sparkle size={44} />
        </div>
      </div>

      {/* 2. 4-Column Grid with Horizontal Connector Line */}
      <div className="max-w-7xl w-full relative">
        {/* Connector Line (Desktop Only) */}
        <div className="hidden lg:block absolute top-[16px] left-[10%] right-[10%] h-[1px] bg-blue-100 z-0" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 justify-items-center items-stretch relative z-10">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: "easeOut" }}
              className="relative w-full max-w-[280px] group"
            >
              {/* Step Badge */}
              <div className="absolute -top-4 left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-0 w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md z-20 transition-transform group-hover:scale-110">
                {step.id}
              </div>

              {/* Card Body - Increased vertical padding (py-16) for "Taller" look */}
              <div className="h-full mt-4 bg-white rounded-[2.5rem] py-16 px-8 border border-gray-100 shadow-sm transition-all duration-300 
                              hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:border-blue-100 flex flex-col items-center lg:items-start text-center lg:text-left">
                
                {/* Icon Box */}
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-blue-100">
                  {step.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-5 tracking-tight min-h-[3.5rem]">
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-[15px] flex-grow">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Action Button - Huge gap (mt-48) to force a small scroll */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-48 flex flex-col items-center"
      >
        <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-5 px-16 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-2xl shadow-blue-100 active:scale-95">
          Start Your Project
        </button>
        
        {/* Decorative Sparkle below the button */}
        <div className="mt-8 text-blue-200 opacity-60">
           <Sparkle size={32} />
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;