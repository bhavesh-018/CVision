import React from "react";
import { Search, MapPin, Briefcase } from "lucide-react";

const POPULAR_ROLES = [
  "AI Engineer", "Backend Engineer", "Full Stack Developer",
  "Data Engineer", "DevOps Engineer", "Frontend Developer"
];

export default function JobSearchForm({ params, onChange, onSearch, loading, detectedSkills }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl mb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white mb-2">Find Your Next Role</h1>
        <p className="text-slate-400 text-sm">
          We'll score open jobs against your resume skills and generate AI application advice.
        </p>
      </div>

      {detectedSkills && detectedSkills.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Optimizing for your skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {detectedSkills.slice(0, 8).map(skill => (
              <span key={skill} className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
          Popular Roles
        </p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_ROLES.map(role => (
            <button
              key={role}
              onClick={() => onChange({ ...params, role })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                params.role === role
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Role Input */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Job Title or Keyword"
            value={params.role}
            onChange={e => onChange({ ...params, role: e.target.value })}
            onKeyDown={handleKeyDown}
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition"
          />
        </div>

        {/* Location Input */}
        <div className="flex-1 relative">
          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Location (e.g., Remote, NY)"
            value={params.location}
            onChange={e => onChange({ ...params, location: e.target.value })}
            onKeyDown={handleKeyDown}
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition"
          />
        </div>

        {/* Experience Dropdown */}
        <div className="md:w-48 relative">
          <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={params.experience_years}
            onChange={e => onChange({ ...params, experience_years: Number(e.target.value) })}
            className="w-full h-12 pl-10 pr-10 appearance-none rounded-xl border border-slate-700 bg-slate-950 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition cursor-pointer"
          >
            <option value={0}>Entry Level</option>
            <option value={1}>1+ Years</option>
            <option value={3}>3+ Years</option>
            <option value={5}>5+ Years</option>
            <option value={8}>8+ Years</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <button
          onClick={onSearch}
          disabled={!params.role || loading}
          className="h-12 px-8 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
        >
          {loading ? "Searching..." : "Search Jobs"}
        </button>
      </div>
    </div>
  );
}
