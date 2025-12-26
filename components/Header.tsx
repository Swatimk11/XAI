
import React, { useState } from 'react';
import type { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: 'home' | 'auth' | 'dashboard' | 'contact') => void;
  currentPage: 'home' | 'auth' | 'dashboard' | 'contact';
  onAuthNavigate?: (view: 'login' | 'register') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const NavLink: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
  <button 
    onClick={onClick}
    className={`px-3 py-2 rounded-lg transition-all text-sm font-semibold whitespace-nowrap ${
      isActive 
      ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' 
      : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800'
    }`}
  >
    {children}
  </button>
);

const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigate, currentPage, onAuthNavigate, isDarkMode, onToggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAuthNav = (view: 'login' | 'register') => {
    if (onAuthNavigate) onAuthNavigate(view);
    onNavigate('auth');
    setIsMenuOpen(false);
  };

  const navigateTo = (page: any) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };
  
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center max-w-7xl">
        <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigateTo(user ? 'dashboard' : 'home')}
        >
          <div className="bg-rose-600 p-1.5 rounded-xl shadow-lg shadow-rose-200 dark:shadow-none">
            <svg className="h-5 w-5 sm:h-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.92,13.56c-0.34-0.41-0.73-0.81-1.12-1.2l-0.29-0.29c-0.45-0.45-0.95-0.86-1.45-1.23L9.8,10.6c-0.34-0.25-0.72-0.46-1.1-0.63 c-0.54-0.23-1.1-0.35-1.66-0.35c-0.26,0-0.51,0.03-0.76,0.08c-0.53,0.12-1,0.36-1.42,0.72c-0.71,0.6-1.13,1.48-1.09,2.44 c0.05,1.21,0.73,2.28,1.83,2.85c0.35,0.18,0.72,0.32,1.1,0.43c0.55,0.16,1.12,0.24,1.69,0.24c0.23,0,0.46-0.02,0.68-0.06 c0.77-0.14,1.47-0.5,2.05-1.02C12.63,15.28,13.06,14.48,12.92,13.56z M8.68,14.93c-0.59,0-1.14-0.12-1.62-0.35 c-0.77-0.36-1.28-1.08-1.32-1.9c-0.03-0.6,0.25-1.18,0.74-1.57c0.29-0.22,0.62-0.36,0.96-0.42c0.16-0.03,0.33-0.04,0.49-0.04 c0.39,0,0.77,0.08,1.12,0.24c0.26,0.12,0.5,0.27,0.72,0.45l0.13,0.1c0.36,0.28,0.71,0.6,1.03,0.94l0.29,0.29 c0.29,0.29,0.56,0.6,0.8,0.92c-0.44,0.61-1.07,1.04-1.8,1.2C9.88,14.88,9.28,14.93,8.68,14.93z" />
            </svg>
          </div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-800 dark:text-white truncate">XAI Platform</span>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button 
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-4">
            <NavLink onClick={() => navigateTo(user ? 'dashboard' : 'home')} isActive={currentPage === 'home' || currentPage === 'dashboard'}>
              {user ? 'Dashboard' : 'Home'}
            </NavLink>
            <NavLink onClick={() => navigateTo('contact')} isActive={currentPage === 'contact'}>Contact</NavLink>
            
            {user ? (
              <button onClick={onLogout} className="text-slate-500 hover:text-rose-600 font-bold transition-colors pl-2 ml-2 border-l dark:border-slate-800">
                Sign Out
              </button>
            ) : (
              <button 
                onClick={() => handleAuthNav('login')} 
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 dark:shadow-none transition-all active:scale-95"
              >
                Sign In
              </button>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-4 space-y-2 flex flex-col">
            <NavLink onClick={() => navigateTo(user ? 'dashboard' : 'home')} isActive={currentPage === 'home' || currentPage === 'dashboard'}>
              {user ? 'Dashboard' : 'Home'}
            </NavLink>
            <NavLink onClick={() => navigateTo('contact')} isActive={currentPage === 'contact'}>Contact</NavLink>
            {user ? (
              <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="text-left px-3 py-2 text-rose-600 font-bold">
                Sign Out
              </button>
            ) : (
              <button 
                onClick={() => handleAuthNav('login')} 
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-xl text-sm font-bold mt-2"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
