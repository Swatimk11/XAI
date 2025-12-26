
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 flex-shrink-0 transition-colors">
      <div className="mx-auto py-8 px-10 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
            <span className="text-[10px] font-black text-white dark:text-slate-950">X</span>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            XAI Platform Diagnostic Suite
          </p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Built for clinical excellence by <span className="text-rose-600 dark:text-rose-400 font-bold">Digital Storm</span>
          </p>
          <p className="text-[10px] text-slate-300 dark:text-slate-700 uppercase tracking-widest mt-1">PA College of Engineering • Mangalore</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
