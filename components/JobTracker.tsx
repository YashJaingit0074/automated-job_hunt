
import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { Plus, Search, MapPin, DollarSign, Trash2, GraduationCap, Zap, FileSearch, Sparkles, AlertCircle } from 'lucide-react';
import { Job, JobStatus } from '../types';
import JobModal from './JobModal';
import CoverLetterModal from './CoverLetterModal';
import InterviewGuideModal from './InterviewGuideModal';
import AutoPilotModal from './AutoPilotModal';
import SubmissionReceiptModal from './SubmissionReceiptModal';

const JobTracker: React.FC<{ mode: 'all' | 'offers' }> = ({ mode }) => {
  const { jobs, deleteJob } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'All'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedJobForLetter, setSelectedJobForLetter] = useState<Job | null>(null);
  const [selectedJobForInterview, setSelectedJobForInterview] = useState<Job | null>(null);
  const [selectedJobForAutoPilot, setSelectedJobForAutoPilot] = useState<Job | null>(null);
  const [selectedJobForReceipt, setSelectedJobForReceipt] = useState<Job | null>(null);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    const matchesMode = mode === 'all' || (mode === 'offers' && (job.status === 'Offer' || job.status === 'Accepted'));
    return matchesSearch && matchesStatus && matchesMode;
  });

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'Applied': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Interview': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Offer': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Accepted': return 'bg-emerald-600 text-white border-emerald-600';
      case 'Auto-Pilot': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            {mode === 'all' ? 'Applications' : 'Offers Received'}
          </h2>
          <p className="text-slate-500">Track and manage your {mode === 'all' ? 'active applications' : 'career opportunities'}.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Job
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search company or role..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied (Manual)</option>
            <option value="Auto-Pilot">Auto-Pilot (Optimized)</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredJobs.some(j => j.status === 'Applied') && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3">
           <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
           <p className="text-xs text-amber-800 font-bold">
              Some applications are currently <span className="underline">Unoptimized</span>. Use <span className="bg-purple-100 px-1.5 py-0.5 rounded text-purple-700">Magic Apply</span> to increase ATS callback probability.
           </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Position & Company</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Magic Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredJobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {job.role}
                          {job.status === 'Auto-Pilot' && <Sparkles className="w-3 h-3 text-purple-500" />}
                        </div>
                        <div className="text-sm text-slate-500">{job.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-slate-600 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      {job.location}
                    </div>
                    <div className="mt-1">
                       <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {job.status === 'Auto-Pilot' ? (
                        <button 
                          onClick={() => setSelectedJobForReceipt(job)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-900/10"
                        >
                          <FileSearch className="w-3.5 h-3.5" />
                          Sent Package
                        </button>
                      ) : (
                        <button 
                          onClick={() => setSelectedJobForAutoPilot(job)}
                          className="group flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/10 animate-pulse hover:animate-none"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current group-hover:scale-125 transition-transform" />
                          Optimize Now
                        </button>
                      )}
                      
                      <button 
                        title="Interview Prep Guide"
                        onClick={() => setSelectedJobForInterview(job)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-100"
                      >
                        <GraduationCap className="w-4.5 h-4.5" />
                      </button>
                      
                      <button 
                        title="Delete Application"
                        onClick={() => deleteJob(job.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center text-slate-400">
                    No applications found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && <JobModal onClose={() => setIsAddModalOpen(false)} />}
      {selectedJobForInterview && (
        <InterviewGuideModal 
          job={selectedJobForInterview} 
          onClose={() => setSelectedJobForInterview(null)} 
        />
      )}
      {selectedJobForAutoPilot && (
        <AutoPilotModal
          job={selectedJobForAutoPilot}
          onClose={() => setSelectedJobForAutoPilot(null)}
        />
      )}
      {selectedJobForReceipt && (
        <SubmissionReceiptModal
          job={selectedJobForReceipt}
          onClose={() => setSelectedJobForReceipt(null)}
        />
      )}
    </div>
  );
};

export default JobTracker;
