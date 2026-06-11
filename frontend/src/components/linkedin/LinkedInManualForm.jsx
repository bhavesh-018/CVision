import React, { useState } from "react";
import { Globe, AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";

export default function LinkedInManualForm({ data, onChange, onSubmit, loading }) {
  const [newSkill, setNewSkill] = useState("");
  const [newExp, setNewExp] = useState({ title: "", company: "" });

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      onChange({ ...data, skills: [...data.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange({
      ...data,
      skills: data.skills.filter(s => s !== skillToRemove)
    });
  };

  const addExperience = (e) => {
    e.preventDefault();
    if (newExp.title.trim() || newExp.company.trim()) {
      onChange({
        ...data,
        experience: [...data.experience, { ...newExp }]
      });
      setNewExp({ title: "", company: "" });
    }
  };

  const removeExperience = (index) => {
    onChange({
      ...data,
      experience: data.experience.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl mb-8">
      <div className="flex items-start gap-4 mb-8 pb-6 border-b border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 mt-1 shrink-0">
          <AlertCircle size={24} className="text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Manual Data Entry Required</h2>
          <p className="text-slate-400 text-sm">
            LinkedIn has blocked automated scraping for your profile (this is common for privacy reasons). 
            Please paste your profile details below to get your AI analysis.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Professional Headline</label>
          <input
            type="text"
            placeholder="e.g., Senior Backend Engineer | Python | AWS"
            value={data.headline}
            onChange={e => onChange({ ...data, headline: e.target.value })}
            className="w-full h-12 px-4 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">About / Summary</label>
          <textarea
            placeholder="Paste your LinkedIn About section here..."
            value={data.summary}
            onChange={e => onChange({ ...data, summary: e.target.value })}
            rows={4}
            className="w-full p-4 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Skills</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.skills.map(skill => (
              <span key={skill} className="px-3 py-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 text-sm flex items-center gap-2">
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-blue-300"><Trash2 size={14}/></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a skill (e.g. React)"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill(e)}
              className="flex-1 h-12 px-4 rounded-xl border border-slate-700 bg-slate-950 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
            />
            <button onClick={addSkill} className="h-12 px-6 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition">
              Add
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Recent Experience</label>
          <div className="space-y-3 mb-3">
            {data.experience.map((exp, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-700 bg-slate-950">
                <div>
                  <div className="font-medium text-white">{exp.title}</div>
                  <div className="text-sm text-slate-400">{exp.company}</div>
                </div>
                <button onClick={() => removeExperience(i)} className="text-slate-500 hover:text-red-400 p-2"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Job Title"
              value={newExp.title}
              onChange={e => setNewExp({ ...newExp, title: e.target.value })}
              className="flex-1 h-12 px-4 rounded-xl border border-slate-700 bg-slate-950 text-white focus:border-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Company"
              value={newExp.company}
              onChange={e => setNewExp({ ...newExp, company: e.target.value })}
              className="flex-1 h-12 px-4 rounded-xl border border-slate-700 bg-slate-950 text-white focus:border-blue-500 focus:outline-none"
            />
            <button onClick={addExperience} className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition">
              <Plus size={20} />
            </button>
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={loading || (!data.headline && data.experience.length === 0)}
          className="w-full h-14 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mt-4"
        >
          {loading ? <><Loader2 size={18} className="animate-spin" /> Analyzing...</> : <><Globe size={18} /> Run Analysis</>}
        </button>
      </div>
    </div>
  );
}
