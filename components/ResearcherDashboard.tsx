
import React, { useState } from 'react';
import type { PatientCase, SystemStats } from '../types';
import ResultDisplay from './ResultDisplay';

interface ResearcherDashboardProps {
  cases: PatientCase[];
  stats: SystemStats;
}

const ResearcherDashboard: React.FC<ResearcherDashboardProps> = ({ cases, stats }) => {
  const analyzedCases = cases.filter(c => c.status === 'Analyzed');
  const [selectedCase, setSelectedCase] = useState<PatientCase | null>(null);

  // Helper to ensure bars are always visible even for low values
  const getBarHeight = (count: number) => {
    const maxVal = 25; // Adjusted scale for visualization
    const percentage = (count / maxVal) * 100;
    return `${Math.max(percentage, 4)}%`;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 lg:p-14 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Predictive Trend Analysis</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Real-time model inference volume & workload monitoring</p>
          </div>
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Model: DenseNet-XAI-v2.1</span>
          </div>
        </div>

        {/* Visual Trend Chart */}
        <div className="relative h-64 bg-slate-50/50 dark:bg-slate-950/40 px-4 sm:px-8 pt-12 pb-8 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 flex items-end justify-between space-x-2 sm:space-x-4">
          {/* Y-Axis Grid Lines */}
          <div className="absolute inset-x-8 inset-y-12 border-b border-slate-200 dark:border-slate-800/50 pointer-events-none"></div>
          <div className="absolute inset-x-8 top-1/2 bottom-0 border-t border-slate-200 dark:border-slate-800/50 pointer-events-none"></div>

          {stats.dailyScans.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
              <div className="relative w-full flex flex-col items-center justify-end h-full">
                {/* Tooltip */}
                <div className="absolute top-[-30px] opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold px-2 py-1 rounded pointer-events-none whitespace-nowrap z-20 shadow-lg">
                  {day.count} scans
                </div>
                {/* Bar */}
                <div 
                  className="w-8 sm:w-12 lg:w-16 bg-rose-500 dark:bg-rose-600 rounded-t-xl transition-all duration-1000 ease-out group-hover:bg-rose-400 dark:group-hover:bg-rose-500 shadow-xl shadow-rose-200/20 dark:shadow-none"
                  style={{ height: getBarHeight(day.count) }}
                ></div>
              </div>
              <span className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 mt-4 uppercase tracking-tighter whitespace-nowrap">
                {day.date.split('-').slice(1).join('/')}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-rose-500 rounded-sm"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Diagnostic Volume</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Auto-refresh enabled • Interval: 30s</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
            </div>
            <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">Inference Distribution</h3>
          </div>
          <div className="space-y-8">
            {['Malignant', 'Benign'].map(type => {
              const count = analyzedCases.filter(c => c.analysisResult?.diagnosis === type).length;
              const percentage = analyzedCases.length ? (count / analyzedCases.length) * 100 : 0;
              return (
                <div key={type} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{type} Diagnostic Yield</span>
                      <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{count} Cases</p>
                    </div>
                    <span className={`text-sm font-black px-3 py-1 rounded-lg ${type === 'Malignant' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'}`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${type === 'Malignant' ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl text-amber-600 dark:text-amber-400">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">Explainability Efficacy</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">LIME Clarity Score</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">4.2 <span className="text-xs text-slate-400 font-medium">/ 5.0</span></p>
              <div className="mt-4 flex space-x-1">
                {[1, 2, 3, 4, 5].map(s => <div key={s} className={`h-1 flex-1 rounded-full ${s <= 4 ? 'bg-amber-400' : 'bg-slate-200 dark:bg-slate-700'}`}></div>)}
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ROI Overlap Accuracy</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">89.4%</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /></svg>
                +2.1% from v2.0
              </p>
            </div>
          </div>
          <div className="mt-8 p-6 bg-rose-50 dark:bg-rose-900/20 rounded-3xl border border-rose-100 dark:border-rose-900/30">
            <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-widest mb-2">Research Insight</h4>
            <p className="text-[11px] text-rose-800 dark:text-rose-300 font-medium leading-relaxed italic">
              "DenseNet architectures show 14% higher saliency scores in spiculated margin identification compared to standard ResNet backbones."
            </p>
          </div>
        </div>
      </div>

      {/* Case Exploration List for Researchers */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden pb-10">
        <div className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Anonymized Case Exploration</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Review diagnostic outputs for longitudinal study validation</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b dark:border-slate-800">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Case ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnosis</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {analyzedCases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-900 dark:text-slate-100">{c.patientId}</td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${c.analysisResult?.diagnosis === 'Malignant' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'}`}>
                      {c.analysisResult?.diagnosis}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-medium text-slate-500">{(c.analysisResult?.confidence ? (c.analysisResult.confidence * 100).toFixed(1) : '0.0')}%</td>
                  <td className="px-6 py-5 text-xs text-slate-400">{c.date}</td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => setSelectedCase(c)}
                      className="text-[10px] font-black uppercase text-rose-600 hover:underline"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal for Researcher */}
      {selectedCase && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative custom-scrollbar border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-500">
            <button 
              onClick={() => setSelectedCase(null)}
              className="absolute top-8 right-8 text-slate-400 hover:text-rose-600 transition-colors z-10 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-8 lg:p-14">
              <ResultDisplay
                result={selectedCase.analysisResult}
                isLoading={false}
                previewUrl={selectedCase.previewUrl}
                notes={selectedCase.notes}
                onNotesChange={() => {}}
                chatHistory={selectedCase.chatHistory}
                isReplying={false}
                onSendMessage={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearcherDashboard;
