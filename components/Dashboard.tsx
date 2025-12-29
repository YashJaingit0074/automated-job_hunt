
import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { Users, Calendar, Clock, Trophy, Zap, Sparkles, CheckCircle2, Activity, Info } from 'lucide-react';
import SubmissionReceiptModal from './SubmissionReceiptModal';
import { Job } from '../types';

const StatsCard: React.FC<{ title: string, value: string | number, icon: any, colorClass: string, subtitle?: string }> = ({ title, value, icon: Icon, colorClass, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between transition-all hover:shadow-md group">
    <div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
      {subtitle && <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{subtitle}</p>}
    </div>
    <div className={`${colorClass} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { jobs } = useJobs();
  const [selectedJobForReceipt, setSelectedJobForReceipt] = useState<Job | null>(null);

  // Stats Calculations
  const totalApplied = jobs.length;
  const interviews = jobs.filter(j => j.status === 'Interview').length;
  const offers = jobs.filter(j => j.status === 'Offer' || j.status === 'Accepted').length;
  const autoAppliedCount = jobs.filter(j => j.status === 'Auto-Pilot').length;
  
  const optimizationHealth = totalApplied > 0 
    ? Math.round((autoAppliedCount / totalApplied) * 100) 
    : 0;

  const aiJobs = jobs.filter(j => j.status === 'Auto-Pilot').slice(0, 4);

  // --- Calendar Logic ---
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthName = today.toLocaleString('default', { month: 'long' });

  const getStatsForDay = (day: number) => {
    const dayJobs = jobs.filter(job => {
      const appliedDate = new Date(job.dateApplied);
      return appliedDate.getDate() === day && 
             appliedDate.getMonth() === currentMonth && 
             appliedDate.getFullYear() === currentYear;
    });
    return {
      count: dayJobs.length,
      autoCount: dayJobs.filter(j => j.status === 'Auto-Pilot').length
    };
  };

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-slate-100 text-slate-300';
    if (count > 10) return 'bg-emerald-500 text-white shadow-sm shadow-emerald-200';
    if (count >= 6) return 'bg-amber-400 text-white shadow-sm shadow-amber-100';
    return 'bg-rose-500 text-white shadow-sm shadow-rose-100';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Intelligence Hub
            <div className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse" />
          </h2>
          <p className="text-slate-500 font-medium">Monitoring your automated career trajectory.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Rank</span>
              <span className="text-sm font-bold text-slate-900">Top 5% Candidate</span>
           </div>
           <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm text-slate-700 font-bold">
            <Calendar className="w-5 h-5 text-emerald-600" />
            {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Optimization Health" 
          value={`${optimizationHealth}%`} 
          icon={Activity} 
          colorClass={optimizationHealth > 70 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"} 
          subtitle="AI Integration Score"
        />
        <StatsCard title="AI Transmissions" value={autoAppliedCount} icon={Zap} colorClass="bg-purple-50 text-purple-600" subtitle="Tailored Packages" />
        <StatsCard title="Active Leads" value={interviews} icon={Clock} colorClass="bg-blue-50 text-blue-600" subtitle="Interview Phase" />
        <StatsCard title="Offer Pipeline" value={offers} icon={Trophy} colorClass="bg-emerald-50 text-emerald-600" subtitle="Final Rewards" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          
          {/* AI Submission Log Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Sparkles className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-500/30">
                    <Zap className="w-5 h-5 text-purple-400 fill-current" />
                  </div>
                  <h3 className="text-xl font-black text-white">AI Submission Log</h3>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Live Stream</div>
              </div>
              
              <div className="space-y-4">
                {aiJobs.length > 0 ? aiJobs.map(job => (
                  <div 
                    key={job.id} 
                    onClick={() => setSelectedJobForReceipt(job)}
                    className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group/item"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-500/20 p-2 rounded-xl group-hover/item:scale-110 transition-transform">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{job.role}</p>
                        <p className="text-xs text-slate-400 uppercase font-black tracking-widest">{job.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end text-[10px] font-black text-purple-400 uppercase tracking-tighter">
                        <Sparkles className="w-3 h-3" />
                        Optimized
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{new Date(job.dateApplied).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                )) : (
                  <div className="py-12 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No Auto-Pilot Submissions</p>
                    <p className="text-slate-600 text-[10px] mt-2">Convert manual apps to unlock AI tracking.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Velocity Tracking Calendar */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Velocity Tracking</h3>
                  <p className="text-sm text-slate-400 font-medium">{monthName} Activity Heatmap</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <Activity className="w-3.5 h-3.5 text-blue-500" />
                  Performance Map
                </div>
             </div>

             <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5">
                   <div className="w-3 h-3 rounded-md bg-rose-500" />
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">1-5 Apps</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="w-3 h-3 rounded-md bg-amber-400" />
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">6-10 Apps</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="w-3 h-3 rounded-md bg-emerald-500" />
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">&gt; 10 Apps</span>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                   <Sparkles className="w-3 h-3 text-purple-500" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Quality Marker</span>
                </div>
             </div>

             <div className="grid grid-cols-7 gap-2 md:gap-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                   <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2">
                      {d}
                   </div>
                ))}
                
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                   <div key={`empty-${i}`} className="aspect-square bg-slate-50/20 rounded-2xl border border-dashed border-slate-100" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const { count, autoCount } = getStatsForDay(day);
                  const isToday = day === today.getDate();
                  const isHighQuality = autoCount > 0 && autoCount >= count / 2;
                  
                  return (
                    <div 
                      key={day} 
                      className={`aspect-square rounded-xl md:rounded-2xl flex flex-col items-center justify-center transition-all relative group ${getHeatmapColor(count)} ${isToday ? 'ring-2 ring-slate-900 ring-offset-2' : ''}`}
                    >
                       <span className={`text-[10px] md:text-xs font-black ${count > 0 ? 'opacity-100' : 'opacity-40'}`}>
                          {day}
                       </span>
                       
                       {isHighQuality && count > 0 && (
                         <div className="absolute top-1 right-1">
                            <Sparkles className="w-2.5 h-2.5 text-white/80" />
                         </div>
                       )}

                       {count > 0 && (
                         <span className="text-[8px] font-bold mt-0.5 opacity-80">{count}</span>
                       )}
                       
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[9px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-xl">
                          {count} Applications ({autoCount} AI)
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="mb-8">
            <h3 className="text-xl font-black text-slate-900">Recent Pulse</h3>
            <p className="text-sm text-slate-400 font-medium">Status updates & milestones</p>
          </div>
          
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {jobs.slice(0, 10).map(job => (
              <div 
                key={job.id} 
                onClick={() => job.status === 'Auto-Pilot' && setSelectedJobForReceipt(job)}
                className="flex gap-4 group cursor-pointer items-start hover:translate-x-1 transition-transform"
              >
                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 border-2 border-white shadow-sm ${
                  job.status === 'Offer' ? 'bg-emerald-500' : 
                  job.status === 'Auto-Pilot' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)] animate-pulse' :
                  job.status === 'Interview' ? 'bg-amber-500' : 
                  job.status === 'Rejected' ? 'bg-rose-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">{job.role}</p>
                    {job.status === 'Auto-Pilot' && <Zap className="w-3 h-3 text-purple-500 fill-current" />}
                  </div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight mt-0.5">{job.company}</p>
                </div>
              </div>
            ))}
            {jobs.length === 0 && (
               <div className="py-10 text-center text-slate-400 italic text-sm">No activity recorded yet.</div>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-50">
             <div className="bg-emerald-50 rounded-2xl p-4">
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">Coach Insight</p>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  {optimizationHealth < 50 
                    ? "Your profile is mostly manual. Switch to Auto-Pilot for a 3x higher callback rate."
                    : "Excellent AI integration! Your tailored assets are boosting your performance."}
                </p>
             </div>
          </div>
        </div>
      </div>

      {selectedJobForReceipt && (
        <SubmissionReceiptModal 
          job={selectedJobForReceipt} 
          onClose={() => setSelectedJobForReceipt(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
