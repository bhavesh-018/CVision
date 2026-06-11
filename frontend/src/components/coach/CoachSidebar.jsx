import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ChevronRight, FileText, GitFork, Globe, Pencil, X, Check, RefreshCw } from "lucide-react";

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

export default function CoachSidebar({ profile, onActionClick, onGoalChange, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [newRole, setNewRole] = useState(profile?.target_role || "");
  const [newGoals, setNewGoals] = useState(profile?.career_goals || "");
  const [saving, setSaving] = useState(false);

  if (!profile) return null;

  const handleSave = async () => {
    if (!newRole) return;
    setSaving(true);
    await onGoalChange(newRole, newGoals, profile.experience_years || 0);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      
      {/* Profile Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-xl font-bold text-white">Career Profile</h3>
          <button
            onClick={() => { setNewRole(profile.target_role || ""); setNewGoals(profile.career_goals || ""); setEditing(true); }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
            title="Change target role"
          >
            <Pencil size={14} />
          </button>
        </div>
        <p className="text-sm text-slate-400 mb-6 flex items-center gap-2">
          <Briefcase size={14} />
          {profile.target_role || "Not set"} • {profile.experience_years || 0} years exp
        </p>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-xs text-slate-500 mb-1">ATS</span>
            <span className={`text-lg font-bold ${profile.ats_score > 75 ? 'text-green-500' : 'text-yellow-500'}`}>
              {profile.ats_score || 0}
            </span>
          </div>
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-xs text-slate-500 mb-1">GitHub</span>
            <span className="text-lg font-bold text-slate-300">
              {profile.github_score || 0}
            </span>
          </div>
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-xs text-slate-500 mb-1">LinkedIn</span>
            <span className="text-lg font-bold text-slate-300">
              {profile.linkedin_score || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Connected Data */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Connected Data</h3>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
              title="Refresh scores"
            >
              <RefreshCw size={13} />
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-blue-400" />
              <span className="text-sm text-slate-300">Resume</span>
            </div>
            {profile.ats_score > 0 ? (
              <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-md">Connected</span>
            ) : (
              <Link
                to="/dashboard"
                className="text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md hover:bg-amber-400/20 transition-colors"
                title="Upload resume on Dashboard"
              >
                Upload ↗
              </Link>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
            <div className="flex items-center gap-3">
              <GitFork size={18} className="text-slate-300" />
              <span className="text-sm text-slate-300">GitHub</span>
            </div>
            {profile.github_username ? (
              <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-md">{profile.github_username}</span>
            ) : (
              <span className="text-xs font-medium text-slate-500 bg-slate-800 px-2 py-1 rounded-md">Missing</span>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-blue-500" />
              <span className="text-sm text-slate-300">LinkedIn</span>
            </div>
            {profile.linkedin_username ? (
              <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-md">Connected</span>
            ) : (
              <span className="text-xs font-medium text-slate-500 bg-slate-800 px-2 py-1 rounded-md">Missing</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Actions</h3>
        <div className="space-y-2">
          <button 
            onClick={() => onActionClick("Create a detailed 90-day roadmap for me.")}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 text-left transition-colors group"
          >
            <span className="text-sm text-slate-300 group-hover:text-white">Create 90-day roadmap</span>
            <ChevronRight size={16} className="text-slate-500 group-hover:text-white" />
          </button>
          <button 
            onClick={() => onActionClick(`What are my biggest skill gaps for a ${profile.target_role || 'target role'} position?`)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 text-left transition-colors group"
          >
            <span className="text-sm text-slate-300 group-hover:text-white">Analyze skill gaps</span>
            <ChevronRight size={16} className="text-slate-500 group-hover:text-white" />
          </button>
          <button 
            onClick={() => onActionClick("What certifications or courses would give me the best ROI right now?")}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 text-left transition-colors group"
          >
            <span className="text-sm text-slate-300 group-hover:text-white">Recommend courses</span>
            <ChevronRight size={16} className="text-slate-500 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Edit Goal Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Change Target Role</h3>
              <button
                onClick={() => setEditing(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Target Role</label>
              <div className="flex flex-wrap gap-2">
                {TARGET_ROLES.map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setNewRole(role)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      newRole === role
                        ? "bg-blue-600 text-white font-medium"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Updated Goals</label>
              <textarea
                value={newGoals}
                onChange={e => setNewGoals(e.target.value)}
                placeholder="Describe your updated career goals..."
                className="w-full h-24 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!newRole || saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <><Check size={16} /> Save</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
