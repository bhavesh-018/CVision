import React from "react";
import { CheckCircle, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";

export default function LinkedInConsistencyReport({ consistency }) {
  if (!consistency) return null;

  const { consistency_score, matches, mismatches, linkedin_strengths, resume_strengths } = consistency;

  const scoreColor =
    consistency_score >= 80 ? "text-green-400" :
    consistency_score >= 60 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-purple-400" />
            Resume Alignment
          </h3>
          <p className="text-slate-400 text-sm">
            AI analysis comparing your uploaded resume with your LinkedIn profile.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-4xl font-black ${scoreColor}`}>{consistency_score}%</div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Alignment</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matches */}
        <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/20">
          <h4 className="flex items-center gap-2 font-bold text-green-400 mb-4">
            <CheckCircle size={18} /> Verified Matches
          </h4>
          <ul className="space-y-3">
            {matches && matches.length > 0 ? matches.map((match, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span> {match}
              </li>
            )) : (
              <li className="text-sm text-slate-500 italic">No significant matches found.</li>
            )}
          </ul>
        </div>

        {/* Mismatches */}
        <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20">
          <h4 className="flex items-center gap-2 font-bold text-red-400 mb-4">
            <AlertTriangle size={18} /> Inconsistencies Detected
          </h4>
          <ul className="space-y-3">
            {mismatches && mismatches.length > 0 ? mismatches.map((mismatch, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span> {mismatch}
              </li>
            )) : (
              <li className="text-sm text-slate-500 italic">No inconsistencies found. Great job!</li>
            )}
          </ul>
        </div>

        {/* LinkedIn Strengths */}
        <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20">
          <h4 className="flex items-center gap-2 font-bold text-blue-400 mb-4">
            <Lightbulb size={18} /> Add to Resume
          </h4>
          <p className="text-xs text-slate-400 mb-3">Found on LinkedIn, missing from Resume:</p>
          <ul className="space-y-3">
            {linkedin_strengths && linkedin_strengths.length > 0 ? linkedin_strengths.map((str, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">+</span> {str}
              </li>
            )) : (
              <li className="text-sm text-slate-500 italic">Nothing notable missing from your resume.</li>
            )}
          </ul>
        </div>

        {/* Resume Strengths */}
        <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20">
          <h4 className="flex items-center gap-2 font-bold text-purple-400 mb-4">
            <Lightbulb size={18} /> Add to LinkedIn
          </h4>
          <p className="text-xs text-slate-400 mb-3">Found on Resume, missing from LinkedIn:</p>
          <ul className="space-y-3">
            {resume_strengths && resume_strengths.length > 0 ? resume_strengths.map((str, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">+</span> {str}
              </li>
            )) : (
              <li className="text-sm text-slate-500 italic">Nothing notable missing from your LinkedIn.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
