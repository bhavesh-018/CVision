import React, { useState } from "react";
import { ArrowRight, Briefcase, GraduationCap, Target } from "lucide-react";

export default function CoachOnboarding({ onComplete }) {
  const [targetRole, setTargetRole] = useState("");
  const [goals, setGoals] = useState("");
  const [experience, setExperience] = useState(0);

  const TARGET_ROLES = [
    "AI Engineer",
    "Backend Engineer",
    "Full Stack Developer",
    "Data Engineer",
    "DevOps Engineer",
    "Software Engineer",
    "Frontend Developer",
    "ML Engineer"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (targetRole && goals) {
      onComplete(targetRole, goals, experience);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto px-4">
      <div className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 mb-4">
            <Target className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-white">Set Your Career Goals</h2>
          <p className="mt-2 text-slate-400">
            Tell me where you are and where you want to go. I'll help you get there.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <Briefcase size={16} /> Target Role
            </label>
            <div className="flex flex-wrap gap-2">
              {TARGET_ROLES.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTargetRole(role)}
                  className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                    targetRole === role 
                    ? "bg-blue-600 text-white font-medium" 
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <GraduationCap size={16} /> Experience Level
            </label>
            <select
              value={experience}
              onChange={e => setExperience(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={0}>Fresher / Student</option>
              <option value={1}>1 year</option>
              <option value={2}>2-3 years</option>
              <option value={4}>4-5 years</option>
              <option value={6}>6+ years</option>
              <option value={8}>8+ years</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <Target size={16} /> Your Career Goals
            </label>
            <textarea
              placeholder="e.g., I want to transition from frontend to backend and learn system design in the next 6 months..."
              value={goals}
              onChange={e => setGoals(e.target.value)}
              className="w-full h-32 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!targetRole || !goals}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Coaching <ArrowRight size={18} />
          </button>

        </form>
      </div>
    </div>
  );
}
