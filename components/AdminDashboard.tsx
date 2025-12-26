
import React, { useState } from 'react';
import type { User, UserRole, SystemStats } from '../types';
import { CONFIG } from '../config';

interface AdminDashboardProps {
  users: User[];
  stats: SystemStats;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onAddUser: (newUser: User) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, stats, onUpdateUser, onAddUser }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Doctor' as UserRole,
    specialization: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.find(u => u.email === newUser.email)) {
      alert("User with this email already exists.");
      return;
    }

    const createdUser: User = {
      id: `u-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      specialization: newUser.specialization,
      status: 'Active',
      joinedAt: new Date().toISOString().split('T')[0]
    };

    onAddUser(createdUser);
    setSuccessMsg(`Account created for ${newUser.name}`);
    setNewUser({ name: '', email: '', password: '', role: 'Doctor', specialization: '' });
    
    setTimeout(() => {
      setSuccessMsg('');
      setShowAddForm(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-700 pb-20">
      {/* DB Connection Status */}
      <div className="bg-slate-900 dark:bg-black p-6 rounded-[2rem] border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm tracking-tight">MongoDB Atlas Connected</h4>
            <p className="text-[10px] text-slate-500 font-mono truncate max-w-[250px] sm:max-w-none">
              {CONFIG.MONGODB_URI.replace(/\/\/.*?:.*?@/, '//***:***@')}
            </p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Sync: Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Analyses', value: stats.totalScans, icon: '🔍', color: 'bg-blue-600', sub: 'Completed' },
          { label: 'Alerts', value: stats.malignantFound, icon: '⚠️', color: 'bg-rose-600', sub: 'High risk' },
          { label: 'Avg Confidence', value: `${(stats.avgConfidence * 100).toFixed(1)}%`, icon: '📊', color: 'bg-indigo-600', sub: 'Model mean' },
          { label: 'Staff', value: stats.activeDoctors, icon: '👨‍⚕️', color: 'bg-emerald-600', sub: 'Verified' },
        ].map((item, i) => (
          <div key={i} className="group p-6 sm:p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 transition-all">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${item.color} flex items-center justify-center text-white text-lg sm:text-xl mb-4 sm:mb-6 shadow-lg shadow-inherit/20`}>
              {item.icon}
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.label}</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">{item.value}</div>
              <p className="text-[10px] text-slate-400 font-medium pt-1 sm:pt-2">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* User Management Actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Personnel Directory</h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-rose-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:bg-rose-700 transition-all flex items-center space-x-2 text-sm"
        >
          <span>{showAddForm ? 'Cancel Registration' : 'Register New Personnel'}</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl animate-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
              <input type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
              <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white" required />
            </div>
            <div className="space-y-2 relative">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                value={newUser.password} 
                onChange={e => setNewUser({...newUser, password: e.target.value})} 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white pr-12" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-3 text-slate-400 hover:text-rose-500 transition-colors"
              >
                 {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Role</label>
              <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white">
                <option value="Doctor">Doctor / Radiologist</option>
                <option value="Researcher">Medical Researcher</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialization</label>
              <input type="text" value={newUser.specialization} onChange={e => setNewUser({...newUser, specialization: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white" required />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-slate-900 dark:bg-rose-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-all">
                Confirm Access Provisioning
              </button>
            </div>
          </form>
          {successMsg && <div className="mt-4 text-emerald-600 font-bold text-sm text-center animate-pulse">{successMsg}</div>}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] lg:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        <div className="px-6 lg:px-10 py-6 lg:py-8 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-black text-slate-900 dark:text-white text-lg lg:text-xl tracking-tight">Personnel Registry</h3>
            <p className="text-[10px] lg:text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Clinical Profile Audit & RBAC</p>
          </div>
          <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl text-[10px] lg:text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm">
            {users.length} Active Profiles
          </span>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 lg:px-10 py-4 text-[9px] lg:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Staff Member</th>
                <th className="px-4 lg:px-6 py-4 text-[9px] lg:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Department</th>
                <th className="px-4 lg:px-6 py-4 text-[9px] lg:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 lg:px-10 py-4 text-[9px] lg:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 lg:px-10 py-5 lg:py-6">
                    <div className="flex items-center space-x-3 lg:space-x-4">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 dark:text-slate-500 uppercase text-xs lg:text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{user.name}</span>
                        <span className="text-[10px] lg:text-xs text-slate-400">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-5 lg:py-6">
                    <span className={`px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-md text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      user.role === 'Doctor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-[9px] lg:text-[10px] text-slate-400 font-medium mt-1 truncate max-w-[120px]">{user.specialization}</p>
                  </td>
                  <td className="px-4 lg:px-6 py-5 lg:py-6">
                    <span className={`flex items-center space-x-1.5 lg:space-x-2 font-bold text-[10px] lg:text-xs ${
                      user.status === 'Active' ? 'text-emerald-600 dark:text-emerald-400' : 
                      user.status === 'Pending' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full animate-pulse ${user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                      <span>{user.status}</span>
                    </span>
                  </td>
                  <td className="px-6 lg:px-10 py-5 lg:py-6 text-right">
                    <select 
                      className="text-[10px] lg:text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl px-2 lg:px-4 py-2 dark:bg-slate-800 text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-rose-500 transition-all cursor-pointer shadow-sm"
                      value={user.status}
                      onChange={(e) => onUpdateUser(user.id, { status: e.target.value as any })}
                    >
                      <option value="Active">Approve Access</option>
                      <option value="Pending">Place on Hold</option>
                      <option value="Blocked">Revoke Access</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
