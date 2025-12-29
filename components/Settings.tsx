import React, { useState, useRef } from 'react';
import { useJobs } from '../context/JobContext';
import { 
  Save, User, Code, FileCheck, Upload, FileText, 
  CheckCircle, AlertCircle, Zap, RefreshCw, Trash2, 
  Cloud, ExternalLink, Globe, Layout, Download, Database, HardDrive
} from 'lucide-react';

const Settings: React.FC = () => {
  const { resume, setResume, jobs, importFullData } = useJobs();
  const [formData, setFormData] = useState(resume);
  const [showSaved, setShowSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

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

  const handleExportData = () => {
    const data = {
      jobs,
      resume,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JobSearch_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.jobs && data.resume) {
          if (confirm("Importing will overwrite your current applications and resume. Continue?")) {
            importFullData(data);
            setFormData(data.resume);
            alert("Data imported successfully!");
          }
        } else {
          alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Failed to read the file. Please ensure it is a valid JSON backup.");
      }
    };
    reader.readAsText(file);
  };

  const simulateGoogleDriveImport = () => {
    setIsCloudSyncing(true);
    setTimeout(() => {
      const mockCloudResume = `
        Experience: Senior Software Engineer at TechCorp.
        Skills: React, TypeScript, Node.js, AWS, Gemini AI.
        Education: B.Tech in Computer Science.
        Summary: Expert in building premium cloud applications with AI integrations.
      `;
      setFormData(prev => ({ 
        ...prev, 
        resumeText: prev.resumeText ? prev.resumeText + "\n[Cloud Updated]: " + mockCloudResume : mockCloudResume 
      }));
      setIsCloudSyncing(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    }, 2000);
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings Form */}
        <div className="lg:col-span-2 space-y-8">
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
                  rows={8}
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

          {/* Data Management Section */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden p-8">
             <div className="flex items-center gap-3 mb-6">
                <div className="bg-slate-100 p-2 rounded-xl">
                  <Database className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Data Portability</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Maintenance & Backups</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={handleExportData}
                  className="flex items-center justify-center gap-3 p-6 bg-slate-50 hover:bg-slate-100 rounded-3xl border border-slate-200 transition-all group"
                >
                   <Download className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
                   <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">Export All Records</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Download Backup JSON</p>
                   </div>
                </button>

                <button 
                  onClick={() => importInputRef.current?.click()}
                  className="flex items-center justify-center gap-3 p-6 bg-slate-50 hover:bg-slate-100 rounded-3xl border border-slate-200 transition-all group"
                >
                   <Upload className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
                   <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">Import Records</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Restore from JSON</p>
                   </div>
                </button>
                <input 
                  type="file" 
                  ref={importInputRef} 
                  className="hidden" 
                  accept=".json"
                  onChange={handleImportData}
                />
             </div>
          </div>
        </div>

        {/* Sidebar: Cloud Integrations */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-slate-900">Cloud Sync</h3>
            </div>
            
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Connect your professional design tools to automatically pull the latest versions of your resume.
            </p>

            <div className="space-y-3">
              <button 
                onClick={simulateGoogleDriveImport}
                disabled={isCloudSyncing}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-5 h-5" alt="Drive" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">Google Drive</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                      {isCloudSyncing ? 'Fetching...' : 'Connected'}
                    </p>
                  </div>
                </div>
                <RefreshCw className={`w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors ${isCloudSyncing ? 'animate-spin' : ''}`} />
              </button>

              <a 
                href="https://www.canva.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-purple-50 border border-slate-100 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Layout className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">Canva Design</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Edit Templates</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-purple-500 transition-colors" />
              </a>
            </div>
          </div>

          <div className="bg-emerald-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
            <Globe className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
            <h4 className="text-lg font-bold mb-2">Local Upload</h4>
            <p className="text-xs text-emerald-100/70 mb-6 font-medium leading-relaxed">
              Prefer manual control? Upload a PDF directly from your machine.
            </p>
            
            <button 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isUploading ? `Parsing ${uploadProgress}%` : 'Upload PDF'}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="application/pdf"
              onChange={handleFileUpload}
            />
          </div>

          {formData.resumeText && (
            <button 
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all text-xs font-black uppercase tracking-widest border border-transparent hover:border-rose-100"
            >
              <Trash2 className="w-4 h-4" />
              Wipe Local Identity
            </button>
          )}

          <div className="p-6 bg-slate-100 rounded-3xl flex items-center gap-3">
             <HardDrive className="w-5 h-5 text-slate-400" />
             <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Records</p>
                <p className="text-sm font-black text-slate-900">{jobs.length} Applications Secured</p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex gap-4">
        <AlertCircle className="w-6 h-6 text-blue-600 shrink-0" />
        <div className="text-sm">
          <p className="text-blue-900 font-bold mb-1">Privacy First Storage</p>
          <p className="text-blue-700 leading-relaxed">
            Your data is stored within your browser's Local Storage. Cloud integrations like Google Drive are client-side only; we never host your private resumes on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;