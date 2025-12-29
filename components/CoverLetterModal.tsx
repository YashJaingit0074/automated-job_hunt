
import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { X, Sparkles, Copy, Check, RotateCcw } from 'lucide-react';
import { Job } from '../types';
import { generateCoverLetter } from '../services/gemini';

const CoverLetterModal: React.FC<{ job: Job, onClose: () => void }> = ({ job, onClose }) => {
  const { resume, updateJob } = useJobs();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(job.coverLetter || '');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!resume.skills) {
      alert("Please add your skills in Settings first!");
      return;
    }
    setIsLoading(true);
    const result = await generateCoverLetter(job, resume);
    setContent(result);
    updateJob({ ...job, coverLetter: result });
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-300">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-xl">
              <Sparkles className="text-emerald-600 w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">AI Cover Letter</h3>
              <p className="text-xs text-slate-500">{job.role} at {job.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {content ? (
            <div className="relative group">
              <pre className="whitespace-pre-wrap font-sans text-slate-900 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 min-h-[300px] text-[15px]">
                {content}
              </pre>
              <button 
                onClick={copyToClipboard}
                className="absolute top-4 right-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm hover:border-emerald-500 hover:text-emerald-600 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="bg-emerald-50 p-4 rounded-full">
                <Sparkles className="w-12 h-12 text-emerald-500 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Let AI write it for you</h4>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">
                  Gemini will analyze your skills and the job role to craft a compelling, tailored letter.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-white flex gap-3">
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : content ? (
              <>
                <RotateCcw className="w-5 h-5" />
                Regenerate Letter
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterModal;
