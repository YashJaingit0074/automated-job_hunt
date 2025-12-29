import React, { useState, useRef } from 'react';
import { useJobs } from '../context/JobContext';
import { X, Sparkles, Copy, Check, Zap, FileText, CheckCircle2, RotateCcw, Send, CheckCircle, Download, Loader2 } from 'lucide-react';
import { Job } from '../types';
import { generateCoverLetter, enhanceResume } from '../services/gemini';
import ResumePaper from './ResumePaper';

const AutoPilotModal: React.FC<{ job: Job, onClose: () => void }> = ({ job, onClose }) => {
  const { resume, updateJob } = useJobs();
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'resume' | 'letter'>('resume');
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [enhancedResume, setEnhancedResume] = useState(job.enhancedResumeText || '');
  const [tailoredLetter, setTailoredLetter] = useState(job.coverLetter || '');
  const [copied, setCopied] = useState<'resume' | 'letter' | null>(null);

  const documentRef = useRef<HTMLDivElement>(null);

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
      
      // Update persistent storage immediately
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

  const handleDownloadPDF = async () => {
    if (!documentRef.current || isExporting) return;
    
    setIsExporting(true);
    try {
      // @ts-ignore
      const html2canvas = window.html2canvas;
      // @ts-ignore
      const { jsPDF } = window.jspdf;

      if (!html2canvas || !jsPDF) {
        throw new Error("PDF libraries not loaded.");
      }

      const element = documentRef.current.querySelector('.resume-document') as HTMLElement;
      if (!element) return;
      
      element.classList.add('pdf-export-target');
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      element.classList.remove('pdf-export-target');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      const fileName = `${resume.fullName.replace(/\s+/g, '_')}_${activeTab === 'resume' ? 'Resume' : 'CoverLetter'}_${job.company.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF Export failed:", error);
      alert("Failed to generate PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const simulateApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setShowSuccess(true);
      
      // Commit state before closing
      updateJob({ 
        ...job, 
        status: 'Auto-Pilot',
        enhancedResumeText: enhancedResume,
        coverLetter: tailoredLetter 
      });

      setTimeout(() => {
        onClose();
      }, 1800);
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
      <div className="bg-[#f1f5f9] w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[90vh] animate-in zoom-in-95 duration-300 border border-white/20 relative">
        
        {/* Success Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 z-[100] bg-emerald-600 flex flex-col items-center justify-center text-white animate-in fade-in duration-500">
            <div className="bg-white/20 p-6 rounded-full animate-bounce mb-6">
              <CheckCircle className="w-16 h-16" />
            </div>
            <h2 className="text-4xl font-black mb-2">Transmission Successful!</h2>
            <p className="text-emerald-100 font-bold tracking-widest uppercase text-xs">AI Optimized assets are now secured in records</p>
          </div>
        )}

        {/* Header */}
        <div className="px-8 py-5 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-purple-600 p-2 rounded-xl shadow-lg shadow-purple-200">
              <Zap className="w-5 h-5 fill-current text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">DOCUMENT STUDIO</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Optimizing for {job.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownloadPDF}
              disabled={!enhancedResume || isExporting}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white disabled:opacity-50 transition-all"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex px-8 border-b border-slate-200 bg-white shrink-0">
          <button 
            onClick={() => setActiveTab('resume')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
              activeTab === 'resume' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Enhanced Resume
          </button>
          <button 
            onClick={() => setActiveTab('letter')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
              activeTab === 'letter' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Tailored Letter
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar scroll-smooth bg-slate-100/30">
            {!enhancedResume && !isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
                <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
                  <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="text-2xl font-black text-slate-900">AI Intelligence Engine</h4>
                  <p className="text-slate-500 mt-2 font-medium leading-relaxed">
                    We'll re-engineer your professional profile into a tailored document optimized for {job.company}'s hiring standards.
                  </p>
                </div>
                <button 
                  onClick={handleMagicAction}
                  className="w-full bg-slate-900 hover:bg-black text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  Generate Tailored Assets
                </button>
              </div>
            ) : isLoading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-8">
                <div className="relative">
                  <div className="w-24 h-24 border-[6px] border-slate-200 border-t-purple-600 rounded-full animate-spin shadow-inner" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600 text-[10px] font-black uppercase tracking-tighter">Analyzing</div>
                </div>
                <div className="text-center">
                  <p className="text-slate-900 font-black text-xl">Aligning Career Trajectory...</p>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Gemini 3 Pro Intelligence Active</p>
                </div>
              </div>
            ) : (
              <div ref={documentRef} className="flex justify-center pb-20">
                <ResumePaper content={activeTab === 'resume' ? enhancedResume : tailoredLetter} type={activeTab} />
              </div>
            )}
          </div>

          {/* Tools Sidebar */}
          <div className="w-80 border-l border-slate-200 p-8 hidden xl:flex flex-col gap-8 bg-white/50 backdrop-blur-sm">
             <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Content Controls</h5>
                <div className="space-y-4">
                  <button 
                    onClick={() => copyToClipboard(activeTab)}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-purple-50 rounded-xl transition-all group"
                  >
                    <span className="text-xs font-bold text-slate-600 group-hover:text-purple-700">Copy Text</span>
                    {copied === activeTab ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-300" />}
                  </button>
                  <button 
                    onClick={handleMagicAction}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-purple-50 rounded-xl transition-all group"
                  >
                    <span className="text-xs font-bold text-slate-600 group-hover:text-purple-700">Regenerate</span>
                    <RotateCcw className="w-4 h-4 text-slate-300 group-hover:text-purple-600" />
                  </button>
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={isExporting}
                    className="w-full flex md:hidden items-center justify-between p-3 bg-slate-900 text-white rounded-xl transition-all group"
                  >
                    <span className="text-xs font-bold">Export PDF</span>
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  </button>
                </div>
             </div>

             <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h6 className="text-xs font-black text-emerald-900 uppercase tracking-widest">Verified</h6>
                </div>
                <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">
                  Asset analysis confirms high alignment with the JD. Your keywords have been optimized for high-callback rates.
                </p>
             </div>
          </div>
        </div>

        {/* Global Action Footer */}
        <div className="p-6 border-t border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3 text-slate-500 text-xs font-black uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Transmission Ready
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <button 
                onClick={onClose}
                className="flex-1 md:flex-none px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-xs uppercase tracking-widest"
             >
               Back
             </button>
             <button 
                disabled={!enhancedResume || isApplying || showSuccess}
                onClick={simulateApply}
                className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-95"
             >
                {isApplying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Finalize Application
                  </>
                )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoPilotModal;