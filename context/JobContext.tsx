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
  importFullData: (data: { jobs: Job[], resume: Resume }) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resume, setResumeState] = useState<Resume>({
    fullName: '',
    skills: ''
  });
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  // Load from local storage on mount
  useEffect(() => {
    const savedJobs = localStorage.getItem('jobsearch_jobs');
    const savedResume = localStorage.getItem('jobsearch_resume');
    if (savedJobs) {
      try {
        setJobs(JSON.parse(savedJobs));
      } catch (e) {
        console.error("Failed to parse jobs from storage", e);
      }
    }
    if (savedResume) {
      try {
        setResumeState(JSON.parse(savedResume));
      } catch (e) {
        console.error("Failed to parse resume from storage", e);
      }
    }
  }, []);

  // Save to local storage whenever state changes
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
  
  const importFullData = (data: { jobs: Job[], resume: Resume }) => {
    if (data.jobs) setJobs(data.jobs);
    if (data.resume) setResumeState(data.resume);
  };

  return (
    <JobContext.Provider value={{
      jobs,
      resume,
      currentView,
      addJob,
      updateJob,
      deleteJob,
      setResume,
      setCurrentView,
      importFullData
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