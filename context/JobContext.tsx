
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Job, Resume, ViewType } from '../types';

interface JobContextType {
  jobs: Job[];
  resume: Resume;
  currentView: ViewType;
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  setResume: (resume: Resume) => void;
  setCurrentView: (view: ViewType) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resume, setResumeState] = useState<Resume>({
    fullName: '',
    skills: ''
  });
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  // Load from local storage
  useEffect(() => {
    const savedJobs = localStorage.getItem('jobsearch_jobs');
    const savedResume = localStorage.getItem('jobsearch_resume');
    if (savedJobs) setJobs(JSON.parse(savedJobs));
    if (savedResume) setResumeState(JSON.parse(savedResume));
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('jobsearch_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('jobsearch_resume', JSON.stringify(resume));
  }, [resume]);

  const addJob = (job: Job) => setJobs(prev => [job, ...prev]);
  const updateJob = (updatedJob: Job) => setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
  const deleteJob = (id: string) => setJobs(prev => prev.filter(j => j.id !== id));
  const setResume = (newResume: Resume) => setResumeState(newResume);

  return (
    <JobContext.Provider value={{
      jobs,
      resume,
      currentView,
      addJob,
      updateJob,
      deleteJob,
      setResume,
      setCurrentView
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) throw new Error("useJobs must be used within a JobProvider");
  return context;
};
