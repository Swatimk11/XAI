
import React, { useState, useEffect } from 'react';
import type { PatientCase, User } from './types';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import ResearcherDashboard from './components/ResearcherDashboard';
import { getCases, saveCases, getUsers, saveUsers, getCurrentUser, setCurrentUserSession, getSystemStats } from './services/dbService';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactPage from './components/ContactPage';
import HomePage from './components/HomePage';

type AuthViewType = 'login' | 'register' | 'forgot' | 'reset' | 'verify';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const [cases, setCases] = useState<PatientCase[]>(() => getCases());
  const [users, setUsers] = useState<User[]>(() => getUsers());
  const [authView, setAuthView] = useState<AuthViewType>('login');
  const [currentPage, setCurrentPage] = useState<'home' | 'auth' | 'dashboard' | 'contact'>('home');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    saveCases(cases);
  }, [cases]);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentUserSession(loggedInUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentUserSession(null);
    setAuthView('login');
    setCurrentPage('home');
  };

  const updateUserInfo = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  };

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const stats = getSystemStats(cases, users);

  const renderDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case 'Admin':
        return <AdminDashboard users={users} stats={stats} onUpdateUser={updateUserInfo} onAddUser={handleAddUser} />;
      case 'Researcher':
        return <ResearcherDashboard cases={cases} stats={stats} />;
      case 'Doctor':
      default:
        return <Dashboard user={user} cases={cases} setCases={setCases} onLogout={handleLogout} />;
    }
  };

  const renderPage = () => {
    if (!user) {
      switch (currentPage) {
        case 'auth':
          return <LoginPage onLogin={handleLogin} view={authView} setView={setAuthView} />;
        case 'contact':
          return <ContactPage />;
        default:
          return <HomePage 
            onNavigateToLogin={() => { setAuthView('login'); setCurrentPage('auth'); }}
            onNavigateToRegister={() => { setAuthView('register'); setCurrentPage('auth'); }}
          />;
      }
    }
    
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-full">
            <div className="max-w-7xl mx-auto">
              <div className="mb-10 animate-in fade-in slide-in-from-top-2 duration-700">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Welcome, {user.name.split(' ')[0]}
                </h1>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                    {user.role}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">•</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">{user.specialization}</span>
                </div>
              </div>
              {renderDashboard()}
            </div>
          </div>
        );
      case 'contact':
        return <ContactPage />;
      default:
         return <Dashboard user={user} cases={cases} setCases={setCases} onLogout={handleLogout} />;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      <main className="flex-grow flex flex-col relative overflow-hidden">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
