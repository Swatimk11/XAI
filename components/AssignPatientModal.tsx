
import React, { useState, useMemo, useEffect } from 'react';

interface AssignPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patientId: string) => void;
  existingPatientIds: string[];
}

const AssignPatientModal: React.FC<AssignPatientModalProps> = ({ isOpen, onClose, onSubmit, existingPatientIds }) => {
  const [patientId, setPatientId] = useState('');

  const uniquePatientIds = useMemo(() => [...new Set(existingPatientIds)], [existingPatientIds]);

  useEffect(() => {
    if (!isOpen) {
      setPatientId('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId.trim()) {
      onSubmit(patientId.trim().toUpperCase());
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 sm:p-6 animate-in fade-in duration-300" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 w-full max-w-lg border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-500">
        <div className="flex items-center space-x-4 mb-6 sm:mb-8">
           <div className="p-2 sm:p-3 bg-rose-50 dark:bg-rose-900/20 rounded-2xl text-rose-600">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
           </div>
           <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Assign Patient Reference</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="space-y-2">
            <p className="text-[11px] sm:text-sm text-slate-500 font-medium">
              Enter a unique Medical Record Number (MRN) or select an existing clinical profile.
            </p>
            <input
              type="text"
              list="patient-ids"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="e.g. PAT-9821-X"
              className="w-full px-5 py-4 sm:px-6 sm:py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all dark:text-white outline-none font-bold text-base sm:text-lg"
              autoFocus
              required
            />
            <datalist id="patient-ids">
              {uniquePatientIds.map(id => <option key={id} value={id} />)}
            </datalist>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="order-2 sm:order-1 flex-1 px-8 py-3.5 sm:py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="order-1 sm:order-2 flex-1 px-8 py-3.5 sm:py-4 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-200 dark:shadow-none disabled:bg-slate-300 active:scale-95 text-sm"
              disabled={!patientId.trim()}
            >
              Initialize Study
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignPatientModal;
