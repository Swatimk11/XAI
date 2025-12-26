
import React, { useState, useEffect } from 'react';
import type { PatientCase, User } from '../types';
import ResultDisplay from './ResultDisplay';
import FileUpload from './FileUpload';
import AssignPatientModal from './AssignPatientModal';
import { analyzeImage, continueChatStream } from '../services/geminiService';
import Spinner from './Spinner';

interface DashboardProps {
    user: User;
    cases: PatientCase[];
    setCases: React.Dispatch<React.SetStateAction<PatientCase[]>>;
    onLogout: () => void;
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

const Dashboard: React.FC<DashboardProps> = ({ user, cases, setCases, onLogout }) => {
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(cases.length > 0 ? cases[0].id : null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedCaseId && cases.length > 0) {
            setSelectedCaseId(cases[0].id);
        }
    }, [cases]);

    const handleFileSelect = (file: File) => {
        setNewImageFile(file);
        setIsModalOpen(true);
    };

    const handleAssignPatient = (patientId: string) => {
        if (!newImageFile) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const newCase: PatientCase = {
                id: `case-${Date.now()}`,
                patientId: `${patientId.toUpperCase()}`,
                date: new Date().toISOString().split('T')[0],
                status: 'Pending',
                imageFile: newImageFile,
                previewUrl: reader.result as string,
                chatHistory: [],
                notes: '',
            };
            setCases(prevCases => [newCase, ...prevCases]);
            setSelectedCaseId(newCase.id);
        }
        reader.readAsDataURL(newImageFile);
        setIsModalOpen(false);
        setNewImageFile(null);
    };

    const handleAnalyze = async (caseToAnalyze: PatientCase) => {
        setIsAnalyzing(true);
        setError(null);
        try {
            let base64Data: string;
            let mimeType: string;

            if (caseToAnalyze.imageFile) {
                base64Data = await toBase64(caseToAnalyze.imageFile);
                mimeType = caseToAnalyze.imageFile.type;
            } else if (caseToAnalyze.previewUrl) {
                const parts = caseToAnalyze.previewUrl.split(',');
                mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
                base64Data = parts[1];
            } else throw new Error("No image source found.");

            const result = await analyzeImage(base64Data, mimeType);
            updateCase(caseToAnalyze.id, { analysisResult: result, status: 'Analyzed' });
        } catch (err: any) {
            alert(`Analysis failed: ${err.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const updateCase = (caseId: string, updates: Partial<PatientCase>) => {
        setCases(prev => prev.map(c => (c.id === caseId ? { ...c, ...updates } : c)));
    };
    
    const handleSendMessage = async (message: string) => {
        if (!selectedCase || !selectedCase.analysisResult) return;
        const userMessage = { role: 'user' as const, text: message };
        const updatedHistory = [...selectedCase.chatHistory, userMessage];
        updateCase(selectedCase.id, { chatHistory: updatedHistory });
        setIsReplying(true);

        try {
            const stream = await continueChatStream(selectedCase.analysisResult, selectedCase.chatHistory, message);
            let fullText = '';
            for await (const chunk of stream) {
                fullText += chunk.text;
                updateCase(selectedCase.id, { chatHistory: [...updatedHistory, { role: 'model', text: fullText }] });
            }
        } catch (e) {
            updateCase(selectedCase.id, { chatHistory: [...updatedHistory, { role: 'model', text: 'Diagnostic chat service currently unavailable.' }] });
        } finally {
            setIsReplying(false);
        }
    };
    
    const selectedCase = cases.find(c => c.id === selectedCaseId);

    return (
        <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-200px)] bg-white dark:bg-slate-900 rounded-3xl lg:rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200 dark:shadow-none animate-in fade-in duration-700">
            {/* Sidebar */}
            <aside className="w-full lg:w-80 xl:w-96 flex flex-col bg-slate-50/50 dark:bg-slate-900/50 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 max-h-[300px] lg:max-h-none">
                <div className="p-4 sm:p-6 lg:p-8 space-y-4">
                    <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Patient Worklist</h3>
                    <FileUpload onFileUpload={handleFileSelect} isLoading={isAnalyzing} />
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    {cases.length === 0 ? (
                        <div className="p-10 text-center space-y-2">
                          <p className="text-sm font-bold text-slate-300 dark:text-slate-700 uppercase">Queue Empty</p>
                          <p className="text-xs text-slate-400">Upload a scan to begin</p>
                        </div>
                    ) : (
                        <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
                            {cases.map(c => (
                                <button 
                                    key={c.id}
                                    onClick={() => setSelectedCaseId(c.id)}
                                    className={`flex-shrink-0 lg:flex-shrink w-64 lg:w-full text-left px-6 py-4 lg:px-8 lg:py-6 transition-all border-r lg:border-r-0 lg:border-b border-slate-100 dark:border-slate-800/50 relative ${selectedCaseId === c.id ? 'bg-white dark:bg-slate-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800/30'}`}
                                >
                                    {selectedCaseId === c.id && <div className="absolute left-0 top-0 bottom-0 w-1 lg:w-1.5 bg-rose-600 rounded-r-full animate-in slide-in-from-left duration-300"></div>}
                                    <div className="flex justify-between items-start mb-1 lg:mb-2">
                                        <span className={`text-xs lg:text-sm font-black tracking-tight truncate ${selectedCaseId === c.id ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>ID: {c.patientId}</span>
                                        <span className={`text-[8px] lg:text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest ${
                                            c.status === 'Analyzed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 
                                            c.status === 'Pending' ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                        }`}>{c.status}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{c.date}</p>
                                      {c.analysisResult && (
                                        <span className={`text-[10px] font-bold ${c.analysisResult.diagnosis === 'Malignant' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                          {c.analysisResult.diagnosis}
                                        </span>
                                      )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950 overflow-hidden">
                {selectedCase ? (
                    <div className="flex-grow overflow-y-auto custom-scrollbar">
                        <div className="p-4 sm:p-8 lg:p-12 space-y-6 lg:space-y-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 lg:pb-10 border-b border-slate-100 dark:border-slate-800">
                                <div className="space-y-1">
                                     <div className="flex items-center space-x-2">
                                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Study</span>
                                       <span className="text-rose-600 text-[10px]">•</span>
                                       <span className="text-[10px] text-slate-400 font-medium">{selectedCase.date}</span>
                                     </div>
                                     <h1 className="text-2xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Case {selectedCase.patientId}</h1>
                                </div>
                                {selectedCase.status === 'Pending' && (
                                    <button
                                        onClick={() => handleAnalyze(selectedCase)}
                                        disabled={isAnalyzing}
                                        className="w-full md:w-auto group bg-rose-600 text-white font-bold py-3 lg:py-4 px-6 lg:px-10 rounded-2xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-200 dark:shadow-none active:scale-95 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:shadow-none flex items-center justify-center space-x-3"
                                    >
                                       {isAnalyzing ? (
                                          <div className="flex items-center"><Spinner /><span className="ml-2">Analyzing...</span></div>
                                       ) : (
                                          <>
                                            <span className="text-sm lg:text-base">Run AI Diagnostic</span>
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                          </>
                                       )}
                                    </button>
                                )}
                            </div>
                           
                            <ResultDisplay
                                result={selectedCase.analysisResult}
                                isLoading={isAnalyzing}
                                previewUrl={selectedCase.previewUrl}
                                notes={selectedCase.notes}
                                onNotesChange={(notes) => updateCase(selectedCase.id, { notes, status: 'In Review' })}
                                chatHistory={selectedCase.chatHistory}
                                isReplying={isReplying}
                                onSendMessage={handleSendMessage}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-700">
                        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] lg:rounded-[2rem] flex items-center justify-center mb-6 shadow-sm">
                          <svg className="w-8 h-8 lg:w-10 lg:h-10 text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <h2 className="text-lg lg:text-xl font-black text-slate-800 dark:text-slate-200">No Patient Selected</h2>
                        <p className="text-slate-400 mt-2 max-w-xs mx-auto text-xs lg:text-sm font-medium">Please select a case from the worklist or upload a new scan to begin diagnosis.</p>
                    </div>
                )}
            </main>
            
            <AssignPatientModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAssignPatient}
                existingPatientIds={cases.map(c => c.patientId)}
            />
        </div>
    );
};

export default Dashboard;
