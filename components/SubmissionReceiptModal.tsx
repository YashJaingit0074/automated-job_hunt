
import React from 'react';
import { X, FileCheck, Calendar, MapPin, Building2, CheckCircle, ShieldCheck, Download } from 'lucide-react';
import { Job } from '../types';

const SubmissionReceiptModal: React.FC<{ job: Job, onClose: () => void }> = ({ job, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[80vh] animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Header - Receipt Style */}
        <div className="px-8 py-8 bg-slate-50 border-b border-slate-100 flex items-start justify-between">
          <div className="flex gap-6">
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-200">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Verified Transmission</span>
                <span className="text-slate-400 text-[10px] font-bold">Ref: {job.id.toUpperCase()}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Submission Receipt</h3>
              <div className="flex items-center gap-4 mt-2 text-slate-500 text-sm font-medium">
                <div className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {job.company}</div>
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</div>
                <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(job.dateApplied).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/30">
          
          {/* Optimized Resume Side */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Optimized Resume</h4>
              <button className="text-emerald-600 hover:text-emerald-700 text-xs font-bold flex items-center gap-1">
                <Download className="w-3 h-3" /> Export PDF
              </button>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-[13px] text-slate-700 leading-relaxed font-sans min-h-[400px] whitespace-pre-wrap">
              {job.enhancedResumeText || "No optimized resume data found."}
            </div>
          </div>

          {/* Tailored Letter Side */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Tailored Cover Letter</h4>
              <button className="text-emerald-600 hover:text-emerald-700 text-xs font-bold flex items-center gap-1">
                <Download className="w-3 h-3" /> Export PDF
              </button>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-[13px] text-slate-700 leading-relaxed font-sans min-h-[400px] whitespace-pre-wrap">
              {job.coverLetter || "No cover letter data found."}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-white border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <CheckCircle className="w-5 h-5" />
            AI Transmission Confirmed
          </div>
          <button 
            onClick={onClose}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionReceiptModal;
