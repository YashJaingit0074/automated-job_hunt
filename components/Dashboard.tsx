
import React from 'react';
import { useJobs } from '../context/JobContext';
import { TrendingUp, Users, Calendar, Clock, Trophy, Ban, ChevronLeft, ChevronRight } from 'lucide-react';

const StatsCard: React.FC<{ title: string, value: number, icon: any, colorClass: string }> = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between transition-all hover:shadow-md">
    <div>
      <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
    <div className={`${colorClass} p-3 rounded-xl`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { jobs } = useJobs();

  const totalApplied = jobs.length;
  const interviews = jobs.filter(j => j.status === 'Interview').length;
  const offers = jobs.filter(j => j.status === 'Offer' || j.status === 'Accepted').length;
  const rejected = jobs.filter(j => j.status === 'Rejected').length;

  // Calendar Logic
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Group jobs by day for the current month
  const dailyCounts: { [key: number]: number } = {};
  jobs.forEach(job => {
    const jobDate = new Date(job.dateApplied);
    if (jobDate.getMonth() === currentMonth && jobDate.getFullYear() === currentYear) {
      const day = jobDate.getDate();
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    }
  });

  const getDayColor = (count: number) => {
    if (count === 0) return 'bg-slate-100 text-slate-400';
    if (count > 10) return 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20';
    if (count >= 3) return 'bg-amber-500 text-white shadow-lg shadow-amber-500/20';
    return 'bg-rose-500 text-white shadow-lg shadow-rose-500/20';
  };

  const monthName = today.toLocaleString('default', { month: 'long' });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Hub</h2>
          <p className="text-slate-500 font-medium">Your career trajectory, visualized in real-time.</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm text-slate-700 font-bold">
          <Calendar className="w-5 h-5 text-emerald-600" />
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Pipeline" value={totalApplied} icon={Users} colorClass="bg-blue-50 text-blue-600" />
        <StatsCard title="Active Leads" value={interviews} icon={Clock} colorClass="bg-amber-50 text-amber-600" />
        <StatsCard title="Acquired" value={offers} icon={Trophy} colorClass="bg-emerald-50 text-emerald-600" />
        <StatsCard title="Losses" value={rejected} icon={Ban} colorClass="bg-rose-50 text-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Heatmap Container */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900">Application Velocity</h3>
              <p className="text-sm text-slate-400 font-medium">Monthly productivity heatmap</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-tighter">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500" /> High (10+)</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500" /> Med (3-10)</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-500" /> Low (&lt;3)</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
                <span className="text-lg font-black text-slate-900 uppercase tracking-widest">{monthName} {currentYear}</span>
                <div className="flex gap-2">
                   <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"><ChevronLeft className="w-5 h-5" /></button>
                   <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"><ChevronRight className="w-5 h-5" /></button>
                </div>
             </div>
             
             <div className="grid grid-cols-7 gap-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-2">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for previous month padding */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square rounded-2xl bg-slate-50/50" />
                ))}

                {/* Actual day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const count = dailyCounts[day] || 0;
                  return (
                    <div 
                      key={day} 
                      title={`${count} applications`}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all cursor-default group relative ${getDayColor(count)}`}
                    >
                      <span className="text-sm font-black">{day}</span>
                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-white text-slate-900 w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          {count}
                        </span>
                      )}
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-black text-slate-900">Recent Pulse</h3>
            <p className="text-sm text-slate-400 font-medium">Latest application movements</p>
          </div>
          
          <div className="space-y-6 flex-1">
            {jobs.slice(0, 5).map(job => (
              <div key={job.id} className="flex gap-4 group cursor-pointer">
                <div className="relative mt-1">
                  <div className={`w-3 h-3 rounded-full transition-all group-hover:scale-125 ${
                    job.status === 'Offer' ? 'bg-emerald-500' : 
                    job.status === 'Interview' ? 'bg-amber-500' : 
                    job.status === 'Rejected' ? 'bg-rose-500' : 'bg-blue-500'
                  }`} />
                  <div className={`absolute -inset-1 rounded-full animate-ping opacity-20 ${
                    job.status === 'Offer' ? 'bg-emerald-500' : 
                    job.status === 'Interview' ? 'bg-amber-500' : 
                    job.status === 'Rejected' ? 'bg-rose-500' : 'bg-blue-500'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{job.role}</p>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">{job.company} • {job.status}</p>
                </div>
              </div>
            ))}
            {jobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                   <TrendingUp className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">System Silent</p>
              </div>
            )}
          </div>
          
          <button className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest transition-all">
            Full Audit Logs →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
