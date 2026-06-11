import React from "react";
import { Star, ExternalLink, Globe, Tag } from "lucide-react";

function qualityColor(score) {
  if (score >= 70) return "text-green-400 bg-green-400/10 border-green-500/30";
  if (score >= 40) return "text-blue-400 bg-blue-400/10 border-blue-500/30";
  return "text-slate-400 bg-slate-700/30 border-slate-600/30";
}

function timeAgo(isoString) {
  if (!isoString) return "";
  const days = Math.floor((Date.now() - new Date(isoString)) / 86400000);
  if (days === 0) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function GitHubProjectGrid({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-500">
        No public projects found.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Star size={18} className="text-amber-400" />
        Top Projects
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.name}
            className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-950 p-5 hover:border-slate-600 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <h4 className="font-semibold text-white text-sm truncate">{proj.name}</h4>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border shrink-0 ${qualityColor(proj.quality_score)}`}>
                {proj.quality_score}pt
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 mb-4 line-clamp-2 flex-1">
              {proj.description || "No description provided."}
            </p>

            {/* Topics */}
            {proj.topics && proj.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {proj.topics.slice(0, 3).map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 flex items-center gap-1">
                    <Tag size={9} />{t}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                {proj.language && (
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-400 inline-block" />
                    {proj.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star size={11} />{proj.stars}
                </span>
                <span>{timeAgo(proj.last_updated)}</span>
              </div>
              <div className="flex items-center gap-2">
                {proj.homepage && (
                  <a href={proj.homepage} target="_blank" rel="noreferrer"
                    className="text-slate-500 hover:text-blue-400 transition-colors">
                    <Globe size={14} />
                  </a>
                )}
                <a href={proj.url} target="_blank" rel="noreferrer"
                  className="text-slate-500 hover:text-white transition-colors">
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
