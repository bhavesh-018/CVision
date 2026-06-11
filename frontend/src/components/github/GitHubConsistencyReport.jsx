import React from "react";
import { CheckCircle, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";

export default function GitHubConsistencyReport({ consistency }) {
  const { consistency_score, validated_skills, resume_only, github_only } = consistency;

  const scoreColor =
    consistency_score >= 70 ? "text-green-400" :
    consistency_score >= 40 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp size={18} className="text-purple-400" />
          Resume vs GitHub Consistency
        </h3>
        <div className="text-right">
          <div className={`text-3xl font-black ${scoreColor}`}>{consistency_score}%</div>
          <div className="text-xs text-slate-500">match rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Validated */}
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-green-400" />
            <span className="text-sm font-semibold text-green-400">Validated Skills</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">On resume AND proven in GitHub</p>
          {validated_skills && validated_skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {validated_skills.map((s) => (
                <span key={s} className="text-xs px-2 py-1 rounded-lg bg-green-500/10 text-green-300 capitalize">
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No direct matches found</p>
          )}
        </div>

        {/* Resume only (unproven) */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-400" />
            <span className="text-sm font-semibold text-amber-400">Claimed but Unproven</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">On resume, but not shown in GitHub</p>
          {resume_only && resume_only.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {resume_only.map((s) => (
                <span key={s} className="text-xs px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300">
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">All resume skills are proven!</p>
          )}
        </div>

        {/* GitHub only (hidden gems) */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">Hidden Skills</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">In GitHub, missing from resume</p>
          {github_only && github_only.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {github_only.map((s) => (
                <span key={s} className="text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-300">
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No hidden skills found</p>
          )}
        </div>
      </div>
    </div>
  );
}
