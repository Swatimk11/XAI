
import React from 'react';

interface HomePageProps {
    onNavigateToLogin: () => void;
    onNavigateToRegister: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToLogin, onNavigateToRegister }) => {
  return (
    <div className="relative flex-grow flex items-center justify-center p-4 sm:p-6 overflow-hidden min-h-[calc(100vh-100px)]">
      {/* Background blobs for visual interest */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-rose-400/10 dark:bg-rose-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-4xl w-full text-center space-y-8 sm:space-y-10 py-8 sm:py-12 px-2 sm:px-6 animate-in fade-in zoom-in-95 duration-1000">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-full mb-2 sm:mb-4">
            <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-widest">Next-Gen XAI Diagnostic Tool</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight">
            Precision AI for <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">Oncology Excellence</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium px-4">
            Empowering radiologists with transparent, multimodal AI insights to improve detection accuracy and patient outcomes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 px-4 sm:px-0">
          <button 
            onClick={onNavigateToRegister}
            className="group relative w-full sm:w-auto bg-rose-600 text-white font-bold py-3.5 sm:py-4 px-8 sm:px-10 rounded-2xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-200 dark:shadow-none hover:-translate-y-0.5 active:scale-95 flex items-center justify-center overflow-hidden"
          >
            <span className="relative z-10 text-sm sm:text-base">Get Started Now</span>
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
          <button 
            onClick={onNavigateToLogin}
            className="w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold py-3.5 sm:py-4 px-8 sm:px-10 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95 text-sm sm:text-base"
          >
            Clinician Login
          </button>
        </div>

        <div className="pt-6 sm:pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto px-4 sm:px-0">
          {[
            { title: 'Explainable AI', desc: 'Understand model logic with visual Grad-CAM heatmaps.', icon: '🧠' },
            { title: 'Clinician Focused', desc: 'Integrated tools for follow-up questions and notes.', icon: '👨‍⚕️' },
            { title: 'Secure & Reliable', desc: 'Production-ready platform with RBAC security.', icon: '🛡️' }
          ].map((feature, i) => (
            <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-slate-800 rounded-2xl text-center sm:text-left">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{feature.icon}</div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1">{feature.title}</h3>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
