import React, { useState } from "react";
import { MapPin, Building, DollarSign, ExternalLink, Sparkles, AlertTriangle } from "lucide-react";

export default function JobCard({ job }) {
  const [expanded, setExpanded] = useState(false);

  const getMatchColor = (score) => {
    if (score >= 80) return "text-green-400 bg-green-400/10 border-green-500/30";
    if (score >= 60) return "text-yellow-400 bg-yellow-400/10 border-yellow-500/30";
    return "text-red-400 bg-red-400/10 border-red-500/30";
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Salary not listed";
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k/yr`;
    return `$${((min || max) / 1000).toFixed(0)}k/yr`;
  };

  return (
    <div className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden hover:border-slate-700 transition-colors">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><Building size={16} />{job.company}</span>
              <span className="flex items-center gap-1.5"><MapPin size={16} />{job.location}</span>
              <span className="flex items-center gap-1.5 text-emerald-400"><DollarSign size={16} />{formatSalary(job.salary_min, job.salary_max)}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center h-14 w-14 rounded-2xl border-2 font-black text-xl shadow-lg ${getMatchColor(job.match_score)}`}>
              {job.match_score}
            </div>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-2">Match</span>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-3 mb-6">
          {job.matching_skills && job.matching_skills.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-1.5">You have:</p>
              <div className="flex flex-wrap gap-1.5">
                {job.matching_skills.slice(0, 5).map(skill => (
                  <span key={skill} className="px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-xs border border-green-500/20 capitalize">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {job.missing_skills && job.missing_skills.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-1.5">Missing:</p>
              <div className="flex flex-wrap gap-1.5">
                {job.missing_skills.slice(0, 5).map(skill => (
                  <span key={skill} className="px-2 py-1 rounded-md bg-slate-800 text-slate-400 text-xs border border-slate-700 capitalize">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Expanded AI Advice */}
        {expanded && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-900/20 border border-indigo-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={64} className="text-indigo-400" />
            </div>
            <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2 mb-2">
              <Sparkles size={16} /> AI Coach Advice
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed mb-3 relative z-10">
              {job.application_advice}
            </p>
            {job.critical_gaps && job.critical_gaps.length > 0 && (
              <div className="flex items-start gap-2 text-xs text-amber-400/90 relative z-10">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <p><strong>Critical gaps:</strong> {job.critical_gaps.join(", ")}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-auto p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          {expanded ? "Hide Advice" : "See AI Advice"}
        </button>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-200 transition-colors"
        >
          Apply Now <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
