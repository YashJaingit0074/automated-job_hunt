
import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { X, Sparkles, Copy, Check, Zap, FileText, CheckCircle2, RotateCcw } from 'lucide-react';
import { Job } from '../types';
import { generateCoverLetter, enhanceResume } from '../services/gemini';

const AutoPilotModal: React.FC<{ job: Job, onClose: () => void }> = ({ job, onClose }) => {
  const { resume, updateJob } = useJobs();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'resume' | 'letter'>('resume');
  const [isApplied, setIsApplied] = useState(false);
  
  const [enhancedResume, setEnhancedResume] = useState(job.enhancedResumeText || '');
  const [tailoredLetter, setTailoredLetter] = useState(job.coverLetter || '');
  const [copied, setCopied] = useState<'resume' | 'letter' | null>(null);

  const handleMagicAction = async () => {
    if (!resume.resumeText) {
      alert("Please upload your PDF resume in Settings first!");
      return;
    }
    
    setIsLoading(true);
    try {
      const [res, letter] = await Promise.all([
        enhanceResume(job, resume),
        generateCoverLetter(job, resume)
      ]);
      
      setEnhancedResume(res);
      setTailoredLetter(letter);
      
      updateJob({
        ...job,
        enhancedResumeText: res,
        coverLetter: letter
      });
    } catch (error) {
      console.error(error);
      alert("AI Intelligence failed to respond. Check your API connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateApply = () => {
    setIsApplied(true);
    setTimeout(() => {
      updateJob({ ...job, status: 'Auto-Pilot' });
      onClose();
    }, 2000);
  };

  const copyToClipboard = (type: 'resume' | 'letter') => {
    const text = type === 'resume' ? enhancedResume : tailoredLetter;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-purple-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <Zap className="w-6 h-6 fill-current text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">AI AUTO-PILOT</h3>
              <p className="text-white/70 text-sm font-medium">Optimizing for {job.role} at {job.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex px-8 border-b border-slate-100 bg-slate-50/50">
          <button 
            onClick={() => setActiveTab('resume')}
            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'resume' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Enhanced Resume
          </button>
          <button 
            onClick={() => setActiveTab('letter')}
            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'letter' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Tailored Cover Letter
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Document Display */}
          <div className="flex-1 overflow-y-auto p-8 bg-slate-100/30">
            {!enhancedResume && !isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-purple-100 rounded-full animate-ping absolute opacity-20" />
                  <div className="bg-white p-6 rounded-3xl shadow-xl border border-purple-50">
                    <Sparkles className="w-12 h-12 text-purple-600" />
                  </div>
                </div>
                <div className="max-w-md">
                  <h4 className="text-2xl font-black text-slate-900">Ready to Take Off?</h4>
                  <p className="text-slate-500 mt-2 font-medium">
                    Our AI will rewrite your resume sections and draft a location-aware cover letter specifically for this job description.
                  </p>
                </div>
                <button 
                  onClick={handleMagicAction}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-purple-600/30 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Zap className="w-6 h-6 fill-current" />
                  Activate Magic Apply
                </button>
              </div>
            ) : isLoading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600 text-xs font-black">AI</div>
                </div>
                <div className="text-center animate-pulse">
                  <p className="text-slate-900 font-black text-xl">Enhancing Your Professional Identity...</p>
                  <p className="text-slate-500">Injecting keywords for NCR/Remote/Fresher roles</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute top-0 right-0 p-4 flex gap-2">
                  <button 
                    onClick={() => copyToClipboard(activeTab)}
                    className="bg-white/80 backdrop-blur shadow-sm border border-slate-200 p-2 rounded-xl hover:text-purple-600 transition-colors"
                  >
                    {copied === activeTab ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={handleMagicAction}
                    className="bg-white/80 backdrop-blur shadow-sm border border-slate-200 p-2 rounded-xl hover:text-purple-600 transition-colors"
                    title="Regenerate"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 font-sans prose prose-slate max-w-none min-h-[600px] whitespace-pre-wrap text-slate-900 leading-relaxed text-[15px]">
                  {activeTab === 'resume' ? enhancedResume : tailoredLetter}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="w-80 border-l border-slate-100 p-8 hidden xl:flex flex-col gap-8 bg-slate-50/20">
            <div>
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Job Score</h5>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl font-black">
                  98%
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-none">AI Match</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">Perfect Alignment</p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">AI Focus Areas</h5>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <p className="text-xs font-bold text-slate-700">Remote Availability</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <p className="text-xs font-bold text-slate-700">NCR Region Context</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <p className="text-xs font-bold text-slate-700">Fresher Keywords</p>
                </div>
              </div>
            </div>

            <div className="mt-auto">
               <button 
                  disabled={!enhancedResume || isApplied}
                  onClick={simulateApply}
                  className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
               >
                  {isApplied ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Applied</>
                  ) : 'Confirm Auto-Apply'}
               </button>
               <p className="text-[10px] text-center text-slate-400 mt-4 font-medium italic">
                Simulates submission to career site with AI assets.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoPilotModal;
