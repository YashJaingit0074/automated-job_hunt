export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Accepted' | 'Auto-Pilot';

export interface StructuredResume {
  header: {
    fullName: string;
    tagline: string;
    contact: string[];
  };
  summary: string;
  experience: {
    role: string;
    company: string;
    dates: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
  skills: string[];
}

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
  enhancedResumeText?: string; // Stored as JSON string
  origin: 'application' | 'offer';
}

export interface Resume {
  fullName: string;
  skills: string;
  resumeText?: string; 
}

export type ViewType = 'dashboard' | 'jobs' | 'offers' | 'settings';