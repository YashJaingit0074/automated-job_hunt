
import React, { useState, useRef } from 'react';
import { useJobs } from '../context/JobContext';
import { Save, User, Code, FileCheck, Upload, FileText, CheckCircle, AlertCircle, Zap, RefreshCw, Trash2 } from 'lucide-react';

const Settings: React.FC = () => {
  const { resume, setResume } = useJobs();
  const [formData, setFormData] = useState(resume);
  const [showSaved, setShowSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResume(formData);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm("This will permanently clear your stored career identity. You will need to re-upload your resume for AI features. Proceed?")) {
      const cleared = { fullName: '', skills: '', resumeText: '' };
      setFormData(cleared);
      setResume(cleared);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert("Please upload a valid PDF file.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedarray = new Uint8Array(reader.result as ArrayBuffer);
        
        // @ts-ignore
        const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
        if (!pdfjsLib) throw new Error("PDF.js library not loaded");
        
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        const loadingTask = pdfjsLib.getDocument({ data: typedarray });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        
        let completedCount = 0;

        const pagePromises = Array.from({ length: totalPages }, (_, i) => 
          pdf.getPage(i + 1).then(async (page: any) => {
            const textContent = await page.getTextContent();
            const text = textContent.items.map((item: any) => item.str).join(' ');
            
            completedCount++;
            const progress = Math.round((completedCount / totalPages) * 100);
            setUploadProgress(progress);
            
            return text;
          })
        );

        const pageTexts = await Promise.all(pagePromises);
        const fullText = pageTexts.join('\n');
        
        setFormData(prev => ({ ...prev, resumeText: fullText }));
        setIsUploading(false);
        setUploadProgress(100);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("PDF Parsing Error:", error);
      alert("Failed to parse PDF. Please check the file and try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Career Profile</h2>
          <p className="text-slate-500">Your professional identity is stored locally and persists permanently.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
          <Zap className="w-3 h-3 fill-current" />
          Auto-Pilot Active
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="px-8 py-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold">Resume Intelligence</h3>
          </div>
          {showSaved && (
            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
              Sync Successful
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                Identity Source (PDF)
              </label>
              {formData.resumeText && (
                <button 
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 uppercase tracking-tighter transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Reset Identity
                </button>
              )}
            </div>
            <div 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`group relative cursor-pointer border-2 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center gap-4 min-h-[200px] ${
                isUploading 
                  ? 'border-emerald-500 bg-emerald-50/20' 
                  : formData.resumeText 
                    ? 'border-emerald-200 bg-emerald-50/10' 
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
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                  <p className="text-emerald-700 font-bold text-sm">Extracting: {uploadProgress}%</p>
                </div>
              ) : formData.resumeText ? (
                <>
                  <div className="bg-emerald-100 p-4 rounded-2xl">
                    <FileText className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="text-center px-6">
                    <p className="text-emerald-900 font-bold">Resume Parsed & Locked</p>
                    <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mt-1">Ready for magic apply</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-slate-100 p-4 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-600" />
                  </div>
                  <div className="text-center px-6">
                    <p className="text-slate-900 font-bold">Upload Resume once</p>
                    <p className="text-slate-500 text-xs mt-1 font-medium">We store your profile locally to boost your speed.</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" /> Full Legal Name
            </label>
            <input 
              required
              type="text" 
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-slate-900 font-medium transition-all"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-600" /> Professional Summary & Skills
            </label>
            <textarea 
              required
              rows={6}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none resize-none text-slate-900 font-medium text-sm leading-relaxed transition-all"
              value={formData.resumeText || formData.skills}
              placeholder="Resume details will be extracted here..."
              onChange={e => setFormData({ ...formData, resumeText: e.target.value, skills: e.target.value.substring(0, 500) })}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${showSaved ? 'animate-spin' : ''}`} />
            Sync Profile
          </button>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex gap-4">
        <AlertCircle className="w-6 h-6 text-blue-600 shrink-0" />
        <div className="text-sm">
          <p className="text-blue-900 font-bold mb-1">Privacy First Storage</p>
          <p className="text-blue-700 leading-relaxed">
            Your data is stored within your browser's Local Storage. It never touches our servers. You only need to upload your resume once; subsequent applications will use this stored context automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
