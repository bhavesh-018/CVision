import React from "react";
import { Award, CheckCircle, TrendingUp, AlertCircle, Zap, FileText } from "lucide-react";

function AtsTab({ analysis }) {
  const ats = analysis.ats || {};
  const breakdown = ats.breakdown || analysis.breakdown || {};
  const grade = ats.grade || "B+ (Competitive)";
  const suggestions = ats.suggestions || analysis.evaluation?.suggestions || analysis.suggestions || [];

  // Pillar labels and their max possible points in production engine
  const pillarConfig = {
    format: { label: "Formatting & Parser Safety", max: 15, desc: "Structure, contact details, file density" },
    metrics: { label: "Impact & Quantifiable Metrics", max: 25, desc: "Measurable achievements, %, $, scale, volume" },
    action_verbs: { label: "Action Verbs & Active Voice", max: 20, desc: "Leadership, architectural, and engineering verbs" },
    skills: { label: "Technical Competency & Breadth", max: 20, desc: "Tech stack coverage and tool modernness" },
    alignment: { label: "Target Alignment & Balance", max: 20, desc: "JD alignment (or general role readiness health)" },
    // Fallbacks for previous data schema
    projects: { label: "Projects & Portfolio", max: 20, desc: "Project depth and deployed links" },
    experience: { label: "Work Experience", max: 20, desc: "Chronological experience and impact" },
    education: { label: "Education Credentials", max: 15, desc: "Degree, coursework, and honors" },
    contact: { label: "Contact Discoverability", max: 10, desc: "Email, phone, LinkedIn, GitHub" }
  };

  return (
    <div className="space-y-8">
      {/* HEADER CARD WITH GRADE */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 text-blue-300 mb-3">
              <Award size={13} /> Production ATS Scanner
            </div>
            <h2 className="text-3xl font-black text-white">ATS Compliance & Parseability</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Evaluated against modern applicant tracking algorithms (Workday, Greenhouse, Taleo) prioritizing quantifiable metrics, clean parsing, and power action verbs.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 min-w-[170px]">
            <span className="text-xs text-blue-300 font-bold uppercase tracking-wider">ATS Grade</span>
            <span className="text-2xl font-black text-white mt-1 text-center">{grade}</span>
          </div>
        </div>
      </div>

      {/* 5-PILLAR ATS BREAKDOWN */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp size={22} className="text-blue-400" />
          Scoring Dimensions Breakdown
        </h3>

        <div className="space-y-6">
          {Object.entries(breakdown).map(([key, value]) => {
            const config = pillarConfig[key] || {
              label: key.charAt(0).toUpperCase() + key.slice(1),
              max: 20,
              desc: "Evaluation metric"
            };
            const percentage = Math.min(Math.round((value / config.max) * 100), 100);

            return (
              <div key={key} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-baseline mb-1.5">
                  <div>
                    <span className="font-semibold text-white text-base mr-2">{config.label}</span>
                    <span className="text-xs text-slate-400 hidden sm:inline">({config.desc})</span>
                  </div>
                  <div className="text-right font-bold text-sm">
                    <span className="text-white">{value}</span>
                    <span className="text-slate-500 font-normal"> / {config.max} pts</span>
                    <span className="ml-2 text-xs font-semibold text-blue-400">({percentage}%)</span>
                  </div>
                </div>

                <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ATS OPTIMIZATION RECOMMENDATIONS */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap size={22} className="text-amber-400" />
          High-Impact ATS Recommendations
        </h3>

        <div className="space-y-4">
          {suggestions.length > 0 ? (
            suggestions.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5"
              >
                <CheckCircle size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
              <p className="text-green-400 text-sm font-medium">
                Your resume satisfies all primary ATS benchmark standards and formatting guidelines.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AtsTab;