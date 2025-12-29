import React from 'react';
import { StructuredResume } from '../types';

interface ResumePaperProps {
  content: string; // JSON String or raw text
  type: 'resume' | 'letter';
}

const ResumePaper: React.FC<ResumePaperProps> = ({ content, type }) => {
  if (type === 'letter') {
    return (
      <div className="resume-document bg-white w-full shadow-2xl border border-slate-200 min-h-[1056px] mx-auto p-[2cm] animate-in fade-in duration-500">
        <div className="max-w-2xl mx-auto space-y-6">
           {content.split('\n').map((line, i) => (
             <p key={i} className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{line}</p>
           ))}
        </div>
      </div>
    );
  }

  let data: StructuredResume;
  try {
    data = JSON.parse(content);
  } catch (e) {
    // Fallback if not JSON
    return (
      <div className="resume-document bg-white w-full shadow-2xl border border-slate-200 min-h-[1056px] mx-auto p-[2cm] text-sm text-slate-800">
        {content}
      </div>
    );
  }

  return (
    <div className="resume-document bg-white w-full shadow-2xl border border-slate-200 min-h-[1056px] mx-auto flex flex-col animate-in zoom-in-95 duration-500">
      {/* Premium Header */}
      <header className="bg-slate-900 text-white p-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">{data.header.fullName}</h1>
          <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-xs mt-2">{data.header.tagline}</p>
        </div>
        <div className="text-right text-[10px] font-bold text-slate-400 space-y-1">
          {data.header.contact.map((c, i) => <div key={i}>{c}</div>)}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left Sidebar (Accented Design) */}
        <aside className="w-[35%] bg-slate-50 p-12 border-r border-slate-100">
          <section className="mb-12">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 pb-2 border-b border-slate-200">Key Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s, i) => (
                <span key={i} className="bg-white px-3 py-1 rounded-md border border-slate-200 text-[11px] font-bold text-slate-700">{s}</span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 pb-2 border-b border-slate-200">Education</h2>
            <div className="space-y-6">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <p className="text-xs font-black text-slate-900">{edu.degree}</p>
                  <p className="text-[11px] font-bold text-slate-500 mt-0.5">{edu.school}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{edu.year}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>

        {/* Main Content Column */}
        <main className="flex-1 p-12 bg-white">
          <section className="mb-12">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Professional Profile</h2>
            <p className="text-[13px] leading-relaxed text-slate-700 italic border-l-2 border-emerald-500 pl-4">{data.summary}</p>
          </section>

          <section>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Career Experience</h2>
            <div className="space-y-10">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{exp.role}</h3>
                      <p className="text-xs font-bold text-emerald-600">{exp.company}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded uppercase tracking-tighter">{exp.dates}</span>
                  </div>
                  <ul className="space-y-2">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="text-[12px] text-slate-600 flex gap-3 leading-relaxed">
                        <span className="text-emerald-500 mt-1 text-[8px]">■</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ResumePaper;