
import React from 'react';
import type { PatientCase } from '../types';
import ResultDisplay from './ResultDisplay';

interface PatientViewProps {
  patientId: string;
  cases: PatientCase[];
  onLogout: () => void;
}

const PatientView: React.FC<PatientViewProps> = ({ patientId, cases, onLogout }) => {
  const patientCase = cases.find(c => c.patientId === patientId);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-rose-600 p-1.5 rounded-xl">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.92,13.56c-0.34-0.41-0.73-0.81-1.12-1.2l-0.29-0.29c-0.45-0.45-0.95-0.86-1.45-1.23L9.8,10.6c-0.34-0.25-0.72-0.46-1.1-0.63 c-0.54-0.23-1.1-0.35-1.66-0.35c-0.26,0-0.51,0.03-0.76,0.08c-0.53,0.12-1,0.36-1.42,0.72c-0.71,0.6-1.13,1.48-1.09,2.44 c0.05,1.21,0.73,2.28,1.83,2.85c0.35,0.18,0.72,0.32,1.1,0.43c0.55,0.16,1.12,0.24,1.69,0.24c0.23,0,0.46-0.02,0.68-0.06 c0.77-0.14,1.47-0.5,2.05-1.02C12.63,15.28,13.06,14.48,12.92,13.56z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">Patient Portal</h1>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest">Digital Diagnostic Record</p>
            </div>
          </div>
          <button 
            onClick={onLogout} 
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <span>Exit Portal</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-8 lg:p-12 overflow-y-auto">
        {patientCase ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200 dark:shadow-none">
              <div className="mb-8 pb-8 border-b border-slate-50 dark:border-slate-800">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Report Summary: {patientCase.patientId}</h2>
                <p className="text-sm text-slate-500 mt-2">Study finalized on {patientCase.date} • Verified clinical report</p>
              </div>
              
              <ResultDisplay
                  result={patientCase.analysisResult}
                  isLoading={false}
                  previewUrl={patientCase.previewUrl}
                  notes={patientCase.notes}
                  onNotesChange={() => {}} 
                  chatHistory={patientCase.chatHistory}
                  isReplying={false}
                  onSendMessage={() => {}} 
                  isPatientView={true}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-[2rem] flex items-center justify-center text-3xl">🚫</div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">Case Record Not Found</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm font-medium leading-relaxed">
              We could not find a diagnostic report associated with your Patient ID. Please verify your credentials or contact clinical support.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientView;
