import React from "react";
import { Globe, Briefcase, Award, GraduationCap, LayoutTemplate } from "lucide-react";
import ProgressCircle from "../ui/ProgressCircle";

export default function LinkedInScoreCard({ result }) {
  const score = result.linkedin_score;
  const comp = result.profile_completeness;

  const getScoreColor = (val) => {
    if (val >= 80) return "text-green-400";
    if (val >= 60) return "text-yellow-400";
    return "text-red-400";
  }
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl mb-8">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Total Score */}
        <div className="flex flex-col items-center justify-center min-w-[200px] shrink-0">
          <ProgressCircle score={score} size={160} label="Profile Score" />
        </div>

        {/* Breakdown */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <LayoutTemplate size={16} /> <span className="text-sm font-semibold uppercase tracking-wider">Headline</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-white">{comp.headline}</span>
              <span className="text-slate-500 text-sm mb-1">/20</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Briefcase size={16} /> <span className="text-sm font-semibold uppercase tracking-wider">Experience</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-white">{comp.experience}</span>
              <span className="text-slate-500 text-sm mb-1">/25</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Award size={16} /> <span className="text-sm font-semibold uppercase tracking-wider">Skills & Certs</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-white">{comp.skills + comp.certifications}</span>
              <span className="text-slate-500 text-sm mb-1">/25</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <GraduationCap size={16} /> <span className="text-sm font-semibold uppercase tracking-wider">Summary / Edu</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-white">{comp.summary + comp.education}</span>
              <span className="text-slate-500 text-sm mb-1">/20</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
