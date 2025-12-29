
export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Accepted' | 'Auto-Pilot';

export interface Job {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  salary: string;
  location: string;
  dateApplied: string;
  description: string;
  coverLetter: string;
  enhancedResumeText?: string; // AI optimized version of the user's resume for this specific job
  origin: 'application' | 'offer';
}

export interface Resume {
  fullName: string;
  skills: string;
  resumeText?: string; 
}

export type ViewType = 'dashboard' | 'jobs' | 'offers' | 'settings';
