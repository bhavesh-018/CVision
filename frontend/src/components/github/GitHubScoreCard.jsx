import React from "react";
import { GitFork, Users, Globe, MapPin, BookOpen } from "lucide-react";
import ProgressCircle from "../ui/ProgressCircle";

const LEVEL_COLORS = {
  Expert: "text-purple-400 bg-purple-400/10 border-purple-500/30",
  Advanced: "text-blue-400 bg-blue-400/10 border-blue-500/30",
  Intermediate: "text-green-400 bg-green-400/10 border-green-500/30",
  Beginner: "text-yellow-400 bg-yellow-400/10 border-yellow-500/30",
};

const SCORE_BREAKDOWN_CONFIG = {
  volume: { label: "Volume", max: 25, color: "bg-blue-500" },
  quality: { label: "Quality", max: 35, color: "bg-purple-500" },
  diversity: { label: "Diversity", max: 20, color: "bg-green-500" },
  social_proof: { label: "Social Proof", max: 20, color: "bg-amber-500" },
};


export default function GitHubScoreCard({ result }) {
  const levelClass = LEVEL_COLORS[result.level] || LEVEL_COLORS.Beginner;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
        <img
          src={result.profile.avatar_url}
          alt={result.username}
          className="h-20 w-20 rounded-2xl border-2 border-slate-700 object-cover"
        />
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
            <h2 className="text-2xl font-bold text-white">@{result.username}</h2>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${levelClass}`}>
              {result.level}
            </span>
          </div>
          {result.profile.name && result.profile.name !== result.username && (
            <p className="text-slate-300 font-medium mb-1">{result.profile.name}</p>
          )}
          {result.profile.bio && (
            <p className="text-slate-400 text-sm mb-3">{result.profile.bio}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-slate-400 justify-center sm:justify-start">
            <span className="flex items-center gap-1">
              <BookOpen size={14} /> {result.profile.public_repos} repos
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} /> {result.profile.followers} followers
            </span>
            {result.profile.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {result.profile.location}
              </span>
            )}
            {result.profile.blog && (
              <a
                href={result.profile.blog.startsWith("http") ? result.profile.blog : `https://${result.profile.blog}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
              >
                <Globe size={14} /> Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Score circle */}
        <div className="flex flex-col items-center gap-2">
          <ProgressCircle score={result.github_score} size={144} stroke={10} label="GitHub Score" />
        </div>
      </div>

      {/* Score breakdown */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Score Breakdown</h3>
        {Object.entries(result.score_breakdown).map(([key, val]) => {
          const cfg = SCORE_BREAKDOWN_CONFIG[key] || { label: key, max: 25, color: "bg-blue-500" };
          const pct = Math.round((val / cfg.max) * 100);
          return (
            <div key={key} className="flex items-center gap-4">
              <span className="w-24 text-xs text-slate-400 capitalize shrink-0">{cfg.label}</span>
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${cfg.color} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-mono text-slate-300 w-12 text-right">
                {val}/{cfg.max}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
