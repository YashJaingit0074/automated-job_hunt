
import { GoogleGenAI } from "@google/genai";
import { Job, Resume } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateCoverLetter = async (job: Partial<Job>, resume: Resume): Promise<string> => {
  const ai = getAIClient();
  const context = resume.resumeText || resume.skills;

  const prompt = `Write a professional cover letter for the position of ${job.role} at ${job.company}. 
  Target Location/Type: ${job.location || 'Remote/India'}.
  
  Context:
  - Applicant: ${resume.fullName}
  - My Resume Content: ${context}
  - Job Description: ${job.description}

  Requirement: 
  If this is a fresher/intern role, emphasize learning agility, core technical projects, and passion.
  If it's in the NCR region (Delhi, Noida, Gurgaon), mention availability for onsite/hybrid in that area.
  
  Output ONLY the letter text.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Failed to generate cover letter.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Error generating cover letter.";
  }
};

export const enhanceResume = async (job: Job, resume: Resume): Promise<string> => {
  const ai = getAIClient();
  const context = resume.resumeText || resume.skills;

  const prompt = `Act as an expert career consultant. Rewrite the following resume text to perfectly match this job description.
  
  Job: ${job.role} at ${job.company}
  Job Description: ${job.description}
  Original Resume: ${context}

  Optimization Rules:
  1. Highlight skills that are specifically asked for in the job description.
  2. If the candidate is a fresher/intern, focus on relevant projects, coursework, and certifications.
  3. Ensure the tone is professional.
  4. Use standard resume formatting (Sections: Professional Summary, Skills, Projects/Experience, Education).
  5. If the role is Tech/Consulting, prioritize problem-solving and specific tools.

  Output the ENTIRE optimized resume content.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for complex rewriting
      contents: prompt,
    });
    return response.text || "Failed to enhance resume.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Error enhancing resume.";
  }
};

export const generateInterviewGuide = async (job: Job): Promise<string> => {
  const ai = getAIClient();
  const prompt = `Create an interview prep guide for ${job.role} at ${job.company}. 
  JD: ${job.description}. 
  Include top 5 technical and 5 behavioral questions with ideal answers for a fresher/junior level candidate.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Failed to generate interview guide.";
  } catch (error) {
    return "Error generating guide.";
  }
};
