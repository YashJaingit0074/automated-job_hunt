
import React from 'react';
import { JobProvider, useJobs } from './context/JobContext';
import { LayoutDashboard, Briefcase, Settings, Plus, Star, Search, Menu, X, CheckCircle2, Clock, Ban, Trophy, ShieldCheck, UserCheck } from 'lucide-react';
import Dashboard from './components/Dashboard';
import JobTracker from './components/JobTracker';
import ResumeSettings from './components/Settings';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, resume } = useJobs();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const hasResume = !!(resume.resumeText || resume.skills);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'My Applications', icon: Briefcase },
    { id: 'offers', label: 'Offers Received', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'jobs': return <JobTracker mode="all" />;
      case 'offers': return <JobTracker mode="offers" />;
      case 'settings': return <ResumeSettings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-xl">
            <Briefcase className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">JobSearch</h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id 
                ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Identity Status Widget */}
        <div className="p-4 mt-auto border-t border-slate-100">
          <div className={`rounded-2xl p-4 transition-all duration-500 ${hasResume ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-900'}`}>
            <div className="flex items-center gap-2 mb-2">
              {hasResume ? (
                <UserCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-slate-400" />
              )}
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${hasResume ? 'text-emerald-700' : 'text-slate-400'}`}>
                Identity Status
              </p>
            </div>
            <p className={`text-sm font-bold ${hasResume ? 'text-emerald-900' : 'text-white'}`}>
              {hasResume ? 'Intelligence Active' : 'Waiting for PDF'}
            </p>
            <p className={`text-[10px] mt-1 font-medium ${hasResume ? 'text-emerald-600' : 'text-slate-500'}`}>
              {hasResume ? 'Auto-Pilot is persistent.' : 'Upload in settings.'}
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around p-3">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as any)}
            className={`flex flex-col items-center gap-1 ${
              currentView === item.id ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
        {renderView()}
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <JobProvider>
    <AppContent />
  </JobProvider>
);

export default App;
