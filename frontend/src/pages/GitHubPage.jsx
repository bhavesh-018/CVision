import React, { useState, useEffect } from "react";
import { GitFork, Loader2, Search } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import GitHubScoreCard from "../components/github/GitHubScoreCard";
import GitHubTechStack from "../components/github/GitHubTechStack";
import GitHubProjectGrid from "../components/github/GitHubProjectGrid";
import GitHubConsistencyReport from "../components/github/GitHubConsistencyReport";
import GitHubRecommendations from "../components/github/GitHubRecommendations";
import api from "../services/api";

export default function GitHubPage() {
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const sessionId = localStorage.getItem("session_id") || "";
  const analysis = JSON.parse(localStorage.getItem("analysis") || "{}");
  const resumeSkills = analysis.skills || [];

  // Load cached result on mount
  useEffect(() => {
    const cached = localStorage.getItem("github_analysis");
    if (cached) {
      try { setResult(JSON.parse(cached)); } catch {}
    }
  }, []);

  const handleAnalyze = async () => {
    if (!githubUrl.trim()) {
      toast.error("Enter a GitHub URL or username");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/github/analyze", {
        github_url: githubUrl.trim(),
        session_id: sessionId,
        resume_skills: resumeSkills,
      });
      const data = response.data;
      setResult(data);
      localStorage.setItem("github_analysis", JSON.stringify(data));
      toast.success(`@${data.username} analyzed! GitHub Score: ${data.github_score}`);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (err.response?.status === 404) {
        toast.error("GitHub user not found. Check the URL.");
      } else if (err.response?.status === 429) {
        toast.error("GitHub API rate limit hit. Try again later.");
      } else {
        toast.error(detail || "Analysis failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAnalyze();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
              <GitFork size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white">GitHub Analysis</h1>
          </div>
          <p className="text-slate-400 max-w-xl">
            Enter your GitHub profile URL to get a comprehensive analysis of your tech stack,
            project quality, and skill consistency with your resume.
          </p>
        </div>

        {/* URL Input */}
        <div className="flex gap-3 mb-10">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="github.com/yourusername or @yourusername"
              className="w-full h-12 pl-10 pr-4 rounded-2xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center gap-2 px-6 h-12 rounded-2xl bg-blue-600 font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
            ) : (
              <><GitFork size={16} /> Analyze Profile</>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <GitHubScoreCard result={result} />
            <GitHubTechStack stack={result.tech_stack} />
            <GitHubProjectGrid projects={result.top_projects} />
            {result.consistency && (
              <GitHubConsistencyReport consistency={result.consistency} />
            )}
            <GitHubRecommendations recommendations={result.recommendations} />
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-800 mb-6">
              <GitFork size={36} className="text-slate-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-300 mb-2">No Analysis Yet</h2>
            <p className="text-slate-500 max-w-sm">
              Enter your GitHub URL above to get a full profile intelligence report.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
