
import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Copy, Check, Sparkles } from 'lucide-react';
import { Job } from '../types';
import { generateInterviewGuide } from '../services/gemini';

const InterviewGuideModal: React.FC<{ job: Job, onClose: () => void }> = ({ job, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [guide, setGuide] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadGuide = async () => {
      setIsLoading(true);
      const result = await generateInterviewGuide(job);
      setGuide(result);
      setIsLoading(false);
    };
    loadGuide();
  }, [job]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(guide);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Interview Mastery Guide</h3>
              <p className="text-xs text-blue-100 opacity-90">{job.role} @ {job.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto bg-slate-50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-slate-900 font-bold text-lg">Analyzing job description...</p>
                <p className="text-slate-500 text-sm">Gemini is preparing your expert guide.</p>
              </div>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              <div className="flex justify-end mb-4">
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 transition-all text-sm font-semibold text-slate-700"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy Guide'}
                </button>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm whitespace-pre-wrap font-sans text-slate-900 leading-relaxed text-[15px]">
                {guide}
              </div>
            </div>
          )}
        </div>
        
        {!isLoading && (
          <div className="p-4 bg-white border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">Powered by Gemini-3 Flash • Premium Guidance</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewGuideModal;
