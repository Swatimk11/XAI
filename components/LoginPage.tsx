
import React, { useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { getUsers, saveUsers } from '../services/dbService';

interface LoginPageProps {
  onLogin: (user: User) => void;
  view: 'login' | 'register' | 'forgot' | 'reset' | 'verify';
  setView: (view: 'login' | 'register' | 'forgot' | 'reset' | 'verify') => void;
}

const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_rgkycbp',
  TEMPLATE_ID: 'template_6wpakjm',
  PUBLIC_KEY: 'F6B6LqAWVBoxhnITi'
};

const VisibilityIcon = ({ visible }: { visible: boolean }) => (
  visible ? (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
);

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, view, setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [role, setRole] = useState<UserRole>('Doctor');
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [targetUserEmail, setTargetUserEmail] = useState('');

  // Handle redirects if target email is missing on verification views
  useEffect(() => {
    if ((view === 'verify' || view === 'reset') && !targetUserEmail) {
      setView('login');
    }
  }, [view, targetUserEmail, setView]);

  useEffect(() => {
    setError('');
    setAuthCode('');
    setShowPassword(false);
  }, [view]);

  const sendSystemEmail = async (toEmail: string, name: string, subject: string, code: string) => {
    const cleanEmail = toEmail.trim().toLowerCase();
    
    const payload = {
      service_id: EMAILJS_CONFIG.SERVICE_ID,
      template_id: EMAILJS_CONFIG.TEMPLATE_ID,
      user_id: EMAILJS_CONFIG.PUBLIC_KEY,
      template_params: {
        to_email: cleanEmail,
        user_email: cleanEmail,
        email: cleanEmail,
        to_name: name,
        subject: subject,
        message: `Your medical system security code is: ${code}`,
        code: code,
        reply_to: 'support@xaiplatform.org'
      },
    };

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('[EmailJS Provider Error]', errorData);
        return false;
      }
      return true;
    } catch (e) {
      console.error('[EmailJS Network Error]', e);
      return false;
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const users = getUsers();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    
    if (existing && (password === (existing.password || 'password123'))) {
        if (existing.status === 'Unverified') {
            setTargetUserEmail(existing.email);
            setError(`Account verification required for ${existing.email}. Code sent.`);
            setView('verify');
            return;
        }
        if (existing.status !== 'Active') {
            setError('Access restricted. Please contact system admin.');
            return;
        }
        onLogin(existing);
    } else {
      setError('Invalid credentials. Check your email and password.');
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const cleanEmail = email.trim().toLowerCase();
    const users = getUsers();

    if (users.find(u => u.email.toLowerCase() === cleanEmail)) {
        setError('An account with this clinical email already exists.');
        setLoading(false);
        return;
    }
    
    const vCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser: User = {
        id: `u-${Date.now()}`,
        name: fullName.trim(),
        email: cleanEmail,
        password,
        specialization: specialization || 'Oncology',
        role,
        status: 'Unverified',
        verificationCode: vCode,
        joinedAt: new Date().toISOString().split('T')[0]
    };
    
    try {
      const sent = await sendSystemEmail(cleanEmail, fullName, 'Clinician Verification Code', vCode);
      if (sent) {
          saveUsers([...users, newUser]);
          setTargetUserEmail(cleanEmail);
          setView('verify');
          setError(`Security code sent to your inbox.`);
      } else {
        setError('Communication error. Verify EmailJS dashboard template variables.');
      }
    } catch (e) {
      setError('System encountered a network error during dispatch.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!targetUserEmail) return;
    setLoading(true);
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === targetUserEmail.toLowerCase());
    if (user) {
        const isReset = view === 'reset';
        const code = isReset ? user.resetCode : user.verificationCode;
        if (code) {
            const sent = await sendSystemEmail(targetUserEmail, user.name, 'Security Code Resend', code);
            if (sent) setError(`A fresh code has been dispatched.`);
            else setError('Resend failed. Check connection.');
        }
    }
    setLoading(false);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();
    const userIdx = users.findIndex(u => u.email.toLowerCase() === targetUserEmail.toLowerCase());
    if (userIdx > -1 && users[userIdx].verificationCode === authCode) {
        users[userIdx].status = 'Active'; 
        delete users[userIdx].verificationCode;
        saveUsers(users);
        setError('Email verified! You may now sign in.');
        setView('login');
    } else {
        setError('The verification code is incorrect.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const cleanEmail = email.trim().toLowerCase();
    const users = getUsers();
    const userIdx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    
    if (userIdx > -1) {
        const rCode = Math.floor(100000 + Math.random() * 900000).toString();
        users[userIdx].resetCode = rCode;
        saveUsers(users);
        try {
          const sent = await sendSystemEmail(cleanEmail, users[userIdx].name, 'Account Recovery Code', rCode);
          if (sent) {
              setTargetUserEmail(cleanEmail);
              setView('reset');
              setError(`Recovery instructions sent.`);
          } else {
              setError('Failed to transmit recovery code.');
          }
        } catch (e) {
          setError('Unexpected failure during recovery request.');
        }
    } else {
        setError('No account found matching that address.');
    }
    setLoading(false);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();
    const userIdx = users.findIndex(u => u.email.toLowerCase() === targetUserEmail.toLowerCase());
    if (userIdx > -1 && users[userIdx].resetCode === authCode) {
        users[userIdx].password = newPassword;
        delete users[userIdx].resetCode;
        saveUsers(users);
        setError('Password updated successfully. Please log in.');
        setView('login');
    } else {
        setError('The recovery code is invalid.');
    }
  };
  
  return (
    <div className="flex-grow flex justify-center items-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="text-center mb-10">
              <div className="inline-block p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09m15.034-3.036c0-4.639-4.301-8.4-9.613-8.4-1.218 0-2.39.2-3.483.56m13.096 7.84a9.616 9.616 0 01-3.483 4.792M9 11c0-1.29.356-2.532.977-3.6m3.023 3.6a9.616 9.616 0 00-3.023-3.6M9 11h.01M9 11a1 1 0 110 2 1 1 0 010-2zm12 5V4a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {view === 'login' && 'Portal Access'}
                {view === 'register' && 'New Clinician'}
                {view === 'verify' && 'Verify Identity'}
                {view === 'forgot' && 'Account Recovery'}
                {view === 'reset' && 'Reset Access'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {view === 'login' && 'Secure oncology decision support'}
                {view === 'register' && 'Join the oncology XAI network'}
                {view === 'verify' && 'Enter the 6-digit code sent to your email'}
                {view === 'forgot' && 'Enter your registered email address'}
                {view === 'reset' && 'Create a new secure access key'}
              </p>
          </div>

          {error && (
              <div className={`p-4 rounded-2xl text-xs font-bold mb-8 text-center animate-in slide-in-from-top-2 duration-300 ${error.toLowerCase().includes('success') || error.toLowerCase().includes('sent') || error.toLowerCase().includes('dispatched') || error.toLowerCase().includes('verified') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-100 dark:border-rose-800'}`}>
                  {error}
              </div>
          )}

          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Clinical Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="clinician@hospital.com" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all dark:text-white outline-none" required/>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Access Key</label>
                  <button type="button" onClick={() => setView('forgot')} className="text-[10px] font-black text-rose-600 uppercase hover:underline">Forgot?</button>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all dark:text-white outline-none pr-14" 
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors p-1.5"
                  >
                    <VisibilityIcon visible={showPassword} />
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-rose-200 dark:shadow-none mt-6 active:scale-[0.98]">
                Authenticate Access
              </button>
            </form>
          )}

          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Full Name</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Dr. John Doe" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all dark:text-white outline-none" required/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Medical Role</label>
                  <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all dark:text-white outline-none appearance-none cursor-pointer">
                      <option value="Doctor">Radiologist / Doctor</option>
                      <option value="Researcher">Medical Researcher</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Account Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="clinician@hospital.com" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all dark:text-white outline-none" required/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Initial Key</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Choose a strong password" 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all dark:text-white outline-none pr-14" 
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors p-1.5"
                  >
                    <VisibilityIcon visible={showPassword} />
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-rose-600 text-white font-bold py-5 rounded-2xl transition-all shadow-xl mt-6">
                {loading ? 'Processing...' : 'Register & Send Code'}
              </button>
            </form>
          )}

          {(view === 'verify' || view === 'reset') && (
            <form onSubmit={view === 'verify' ? handleVerify : handleResetPassword} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 block text-center">Verification Code</label>
                <input 
                  type="text" 
                  maxLength={6} 
                  value={authCode} 
                  onChange={e => setAuthCode(e.target.value.replace(/\D/g, ''))} 
                  placeholder="000000" 
                  className="w-full px-5 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-rose-500/20 transition-all dark:text-white outline-none text-center text-4xl font-black tracking-[0.5em]" 
                  required
                />
              </div>
              {view === 'reset' && (
                <div>
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">New Access Key</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)} 
                      placeholder="Minimum 8 characters" 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all dark:text-white outline-none pr-14" 
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600 transition-colors p-1.5"
                    >
                      <VisibilityIcon visible={showPassword} />
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <button type="submit" disabled={loading} className="w-full bg-slate-900 dark:bg-rose-600 text-white font-bold py-5 rounded-2xl transition-all shadow-xl">
                  {loading ? 'Validating...' : (view === 'verify' ? 'Confirm Identity' : 'Change Key')}
                </button>
                <button type="button" onClick={handleResendCode} disabled={loading} className="w-full text-[10px] font-black text-rose-600 hover:underline uppercase tracking-widest">
                  Didn't receive code? Resend Email
                </button>
              </div>
              <button type="button" onClick={() => setView('login')} className="w-full text-xs font-bold text-slate-400 hover:text-rose-600 uppercase transition-colors tracking-widest">Back to Login</button>
            </form>
          )}

          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Clinical Account Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="clinician@hospital.com" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all dark:text-white outline-none" required/>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-rose-600 text-white font-bold py-5 rounded-2xl transition-all shadow-xl">
                {loading ? 'Requesting...' : 'Get Security Code'}
              </button>
              <button type="button" onClick={() => setView('login')} className="w-full text-xs font-bold text-slate-400 uppercase tracking-widest">Back to Login</button>
            </form>
          )}

          <div className="mt-10 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
              {view === 'login' && (
                  <>No professional profile? <button onClick={() => setView('register')} className="text-rose-600 dark:text-rose-400 font-bold hover:underline transition-all">Register</button></>
              )}
              {view === 'register' && (
                  <>Already have a profile? <button onClick={() => setView('login')} className="text-rose-600 dark:text-rose-400 font-bold hover:underline transition-all">Log In</button></>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
