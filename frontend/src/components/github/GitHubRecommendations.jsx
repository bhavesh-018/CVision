import React from "react";
import { Zap, ArrowRight } from "lucide-react";

export default function GitHubRecommendations({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-500">
        No recommendations at this time. Great profile!
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Zap size={18} className="text-yellow-400" />
        Recommendations
      </h3>

      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-950 hover:border-slate-700 transition-colors group"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold mt-0.5">
              {i + 1}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed flex-1">{rec}</p>
            <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 mt-1 shrink-0 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
