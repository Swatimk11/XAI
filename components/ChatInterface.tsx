
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';

interface ChatInterfaceProps {
  history: ChatMessage[];
  isReplying: boolean;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ history, isReplying, onSendMessage, disabled = false }) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isReplying]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isReplying && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex-shrink-0">
        {disabled ? 'Consultation Record' : 'Follow-up Clinical Inquiry'}
      </h3>
      <div className="flex-grow overflow-y-auto space-y-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        {history.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No follow-up questions submitted.</p>}
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-3 rounded-2xl shadow-sm ${
              msg.role === 'user' 
              ? 'bg-rose-600 text-white font-medium' 
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isReplying && (
           <div className="flex justify-start">
              <div className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border dark:border-slate-700">
                <div className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-bounce"></span>
                </div>
              </div>
           </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {!disabled && (
        <div className="mt-4 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type clinical question..."
              disabled={isReplying || disabled}
              className="flex-1 p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition dark:text-white text-sm"
            />
            <button
              type="submit"
              disabled={isReplying || !input.trim() || disabled}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-2xl hover:opacity-90 disabled:opacity-30 transition-all shadow-lg active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
