import { GoogleGenAI, Type } from "@google/genai";
import { Job, Resume } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const enhanceResume = async (job: Job, resume: Resume): Promise<string> => {
  const ai = getAIClient();
  const context = resume.resumeText || resume.skills;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Act as a high-end career consultant. You are given a professional resume and a job description. 
    Your goal is to REWRITE the text to perfectly align with the job requirements while keeping the EXACT structural components.
    
    Job: ${job.role} at ${job.company}
    JD: ${job.description}
    Original Resume Content: ${context}
    
    Rules:
    - ONLY edit the text content. Do not add new sections.
    - Create a compelling 'tagline' that matches the role.
    - Use high-impact verbs and keywords from the JD in the 'bullets'.
    - Ensure the 'summary' is a punchy, professional elevator pitch.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          header: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING },
              tagline: { type: Type.STRING },
              contact: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["fullName", "tagline", "contact"]
          },
          summary: { type: Type.STRING },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                company: { type: Type.STRING },
                dates: { type: Type.STRING },
                bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["role", "company", "dates", "bullets"]
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                degree: { type: Type.STRING },
                school: { type: Type.STRING },
                year: { type: Type.STRING }
              },
              required: ["degree", "school", "year"]
            }
          },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["header", "summary", "experience", "education", "skills"]
      }
    }
  });

  return response.text || "";
};

export const generateCoverLetter = async (job: Partial<Job>, resume: Resume): Promise<string> => {
  const ai = getAIClient();
  const context = resume.resumeText || resume.skills;
  const prompt = `Write a high-end cover letter for ${job.role} at ${job.company}. Applicant: ${resume.fullName}. Content: ${context}. Output ONLY the letter text.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || "Error.";
};

export const generateInterviewGuide = async (job: Job): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a 10-question interview guide for ${job.role} at ${job.company} based on JD: ${job.description}.`,
  });
  return response.text || "Error.";
};