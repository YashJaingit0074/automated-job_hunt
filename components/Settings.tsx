
import React, { useState, useRef } from 'react';
import { useJobs } from '../context/JobContext';
import { Save, User, Code, FileCheck, Sparkles, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const { resume, setResume } = useJobs();
  const [formData, setFormData] = useState(resume);
  const [showSaved, setShowSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResume(formData);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert("Please upload a valid PDF file.");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedarray = new Uint8Array(reader.result as ArrayBuffer);
        // @ts-ignore - pdfjs is loaded via CDN in index.html
        const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        
        setFormData(prev => ({ ...prev, resumeText: fullText }));
        setIsUploading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("PDF Parsing Error:", error);
      alert("Failed to parse PDF. Please ensure it is not password protected.");
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Career Profile</h2>
          <p className="text-slate-500">Upload your PDF resume for AI-powered auto-pilot features.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
          PDF Parsing Active
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="px-8 py-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold">Resume Management</h3>
          </div>
          {showSaved && (
            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
              Profile Updated
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
              <Upload className="w-4 h-4 text-emerald-600" />
              Main Resume (PDF Only)
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`group cursor-pointer border-2 border-dashed rounded-2xl p-10 transition-all flex flex-col items-center justify-center gap-4 ${
                formData.resumeText 
                  ? 'border-emerald-300 bg-emerald-50/30' 
                  : 'border-slate-200 hover:border-emerald-500 hover:bg-slate-50'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="application/pdf"
                onChange={handleFileUpload}
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                  <p className="text-sm font-bold text-emerald-600">Extracting PDF Intelligence...</p>
                </div>
              ) : formData.resumeText ? (
                <>
                  <div className="bg-emerald-100 p-4 rounded-2xl">
                    <FileText className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-900 font-bold">Resume Locked & Loaded</p>
                    <p className="text-emerald-600 text-xs mt-1">Ready for Auto-Pilot optimization.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-slate-100 p-4 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-900 font-bold">Click to upload Resume.pdf</p>
                    <p className="text-slate-500 text-xs mt-1">Required for AI Resume Enhancement</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" /> Full Name
            </label>
            <input 
              required
              type="text" 
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-slate-900 font-medium"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-600" /> Parsed Context / Backup
            </label>
            <textarea 
              required
              rows={6}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none resize-none text-slate-900 font-medium text-sm leading-relaxed"
              value={formData.resumeText || formData.skills}
              onChange={e => setFormData({ ...formData, resumeText: e.target.value, skills: e.target.value.substring(0, 500) })}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Update Application Identity
          </button>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex gap-4">
        <AlertCircle className="w-6 h-6 text-blue-600 shrink-0" />
        <div className="text-sm">
          <p className="text-blue-900 font-bold mb-1">Target Filters Active</p>
          <p className="text-blue-700">
            Auto-Pilot is currently configured to prioritize <strong>Remote Tech Roles</strong> and <strong>NCR (Delhi/Noida/Gurugram)</strong> fresher/intern positions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
