import React from "react";
import { CheckCircle2, AlertTriangle, Target, Sparkles, Zap, ArrowUpRight, FileCheck } from "lucide-react";

function JobMatchTab({ analysis }) {
  const jobMatch = analysis.job_match;

  if (!jobMatch) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
          <Target size={30} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Target Job Description Provided</h3>
        <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed mb-6">
          You analyzed this resume without a specific Job Description. We have evaluated your profile against 9 industry standard roles in the Readiness tab.
        </p>
        <p className="text-xs text-slate-500">
          To run a targeted match against a specific job, upload your resume on the Home page with the optional Job Description pasted.
        </p>
      </div>
    );
  }

  const {
    match_score = 0,
    keyword_score = 0,
    semantic_score = 0,
    matching_skills = [],
    missing_skills = [],
    critical_missing_skills = [],
    recommendations = [],
    match_level = "Target Match",
    total_jd_skills_found = 0
  } = jobMatch;

  const getScoreColor = (score) => {
    if (score >= 75) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 55) return "text-blue-400 border-blue-500/30 bg-blue-500/10";
    return "text-amber-400 border-amber-500/30 bg-amber-500/10";
  };

  return (
    <div className="space-y-8">
      {/* TOP SCORE OVERVIEW */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/10 border border-purple-500/20 text-purple-300 mb-3">
              <Sparkles size={12} /> Target Job Match Analysis
            </div>
            <h2 className="text-3xl font-black text-white">Target Job Alignment</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Composite alignment evaluated using canonical skill extraction, keyword presence, and contextual semantic vector similarity.
            </p>
          </div>

          <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${getScoreColor(match_score)} min-w-[180px]`}>
            <span className="text-5xl font-black">{match_score}%</span>
            <span className="text-xs font-bold uppercase tracking-wider mt-1 text-slate-300">{match_level}</span>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 font-medium">Keyword Skill Match</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white">{keyword_score}%</span>
              <span className="text-xs text-slate-500">({matching_skills.length}/{total_jd_skills_found} skills)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 font-medium">Semantic Vector Fit</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-blue-400">{semantic_score}%</span>
              <span className="text-xs text-slate-500">MiniLM embedding</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 font-medium">Critical Skill Gaps</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-bold ${critical_missing_skills.length > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                {critical_missing_skills.length}
              </span>
              <span className="text-xs text-slate-500">high-priority gaps</span>
            </div>
          </div>
        </div>
      </div>

      {/* SKILL COMPARISON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* MATCHING SKILLS */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 size={22} className="text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Matching Qualifications ({matching_skills.length})</h3>
          </div>
          {matching_skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matching_skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No exact keyword skill overlap detected with this job description.</p>
          )}
        </div>

        {/* MISSING SKILLS & GAPS */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle size={22} className="text-amber-400" />
            <h3 className="text-xl font-bold text-white">Missing Job Requirements ({missing_skills.length})</h3>
          </div>
          {missing_skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missing_skills.map((skill, index) => {
                const isCritical = critical_missing_skills.includes(skill);
                return (
                  <span
                    key={index}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border ${
                      isCritical
                        ? "bg-red-500/10 border-red-500/30 text-red-300"
                        : "bg-slate-800 border-slate-700 text-slate-300"
                    }`}
                  >
                    {isCritical ? "★ " : ""}{skill}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-emerald-400 text-sm font-medium">Excellent! All extracted skills from this JD were found in your resume.</p>
          )}
        </div>
      </div>

      {/* TAILORING & APPLICATION RECOMMENDATIONS */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <div className="flex items-center gap-2 mb-6">
          <Zap size={22} className="text-purple-400" />
          <h3 className="text-xl font-bold text-white">Resume Tailoring Strategy</h3>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20">
              <ArrowUpRight size={18} className="text-purple-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobMatchTab;
