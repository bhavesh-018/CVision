import React from "react";
import { Code2, Cpu, Layers } from "lucide-react";

const LANG_COLORS = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-500",
  Python: "bg-green-500",
  Java: "bg-orange-500",
  "C++": "bg-pink-500",
  Go: "bg-cyan-500",
  Rust: "bg-red-500",
  PHP: "bg-indigo-500",
  Ruby: "bg-red-400",
  Swift: "bg-orange-400",
  Kotlin: "bg-purple-400",
  HTML: "bg-orange-600",
  CSS: "bg-blue-400",
  Shell: "bg-slate-400",
  Dart: "bg-sky-400",
};

function LangBar({ lang, pct }) {
  const color = LANG_COLORS[lang] || "bg-slate-500";
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-xs text-slate-300 truncate shrink-0">{lang}</span>
      <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-mono text-slate-400 w-8 text-right">{pct}%</span>
    </div>
  );
}

export default function GitHubTechStack({ stack }) {
  const languages = Object.entries(stack.languages || {}).slice(0, 8);
  const frameworks = stack.frameworks || [];
  const devops = stack.devops_tools || [];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Code2 size={18} className="text-blue-400" />
        Tech Stack
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Languages */}
        <div className="md:col-span-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Languages</h4>
          {languages.length > 0 ? (
            <div className="space-y-3">
              {languages.map(([lang, pct]) => (
                <LangBar key={lang} lang={lang} pct={pct} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No language data found.</p>
          )}
        </div>

        {/* Frameworks + DevOps */}
        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Layers size={12} /> Frameworks
            </h4>
            {frameworks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {frameworks.map((f) => (
                  <span key={f} className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {f}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-xs">None detected</p>
            )}
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Cpu size={12} /> DevOps
            </h4>
            {devops.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {devops.map((d) => (
                  <span key={d} className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
                    {d}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-xs">None detected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
