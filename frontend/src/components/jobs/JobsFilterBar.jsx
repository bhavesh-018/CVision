import React from "react";

export default function JobsFilterBar({ filter, onChange, counts }) {
  const tabs = [
    { id: "all", label: "All Jobs", count: counts.all },
    { id: "high-match", label: "High Match (>70%)", count: counts["high-match"] },
    { id: "remote", label: "Remote", count: counts.remote },
  ];

  return (
    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            filter === tab.id
              ? "bg-slate-800 text-white"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          {tab.label}
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              filter === tab.id ? "bg-slate-700 text-slate-300" : "bg-slate-800 text-slate-500"
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}
