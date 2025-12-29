import React from 'react';
import { X, Calendar, MapPin, Building2, CheckCircle, ShieldCheck, Download } from 'lucide-react';
import { Job } from '../types';
import ResumePaper from './ResumePaper';

const SubmissionReceiptModal: React.FC<{ job: Job, onClose: () => void }> = ({ job, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80] flex items-center justify-center p-4">
      <div className="bg-[#f8fafc] w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Header */}
        <div className="px-8 py-6 bg-white border-b border-slate-200 flex items-start justify-between">
          <div className="flex gap-6">
            <div className="bg-slate-900 p-4 rounded-2xl shadow-lg shadow-slate-200">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Verified Transmission</span>
                <span className="text-slate-400 text-[10px] font-bold">ID: {job.id.toUpperCase()}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Transmission Receipt</h3>
              <div className="flex items-center gap-4 mt-2 text-slate-500 text-xs font-black uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {job.company}</div>
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</div>
                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(job.dateApplied).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Dual Document View */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col lg:flex-row gap-12 custom-scrollbar bg-slate-100/50">
          
          <div className="flex-1 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Submitted Resume</h4>
            <div className="scale-[0.85] origin-top">
              <ResumePaper content={job.enhancedResumeText || ""} type="resume" />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Submitted Letter</h4>
            <div className="scale-[0.85] origin-top">
              <ResumePaper content={job.coverLetter || ""} type="letter" />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
            <CheckCircle className="w-5 h-5" />
            Transmission Secured
          </div>
          <button 
            onClick={onClose}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionReceiptModal;