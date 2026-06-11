import React, { useState } from "react";
import Navbar from "../components/Navbar";
import JobSearchForm from "../components/jobs/JobSearchForm";
import JobsFilterBar from "../components/jobs/JobsFilterBar";
import JobCard from "../components/jobs/JobCard";
import api from "../services/api";
import toast from "react-hot-toast";
import { Briefcase } from "lucide-react";

export default function JobsPage() {
  const [searchParams, setSearchParams] = useState({
    role: "",
    location: "Remote",
    experience_years: 0,
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const sessionId = localStorage.getItem("session_id") || "";
  const analysis = JSON.parse(localStorage.getItem("analysis") || "{}");
  const skills = analysis.skills || [];
  const resumeText = analysis.clean_text || "";

  const handleSearch = async () => {
    if (!searchParams.role) {
      toast.error("Please enter a role to search.");
      return;
    }
    
    setLoading(true);
    setJobs([]);
    
    try {
      const res = await api.post("/jobs/search", {
        ...searchParams,
        skills,
        resume_text: resumeText,
        session_id: sessionId,
        limit: 12,
      });
      setJobs(res.data.jobs);
      toast.success(`Found ${res.data.jobs.length} jobs matched to your profile`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (filter === "high-match") return job.match_score >= 70;
    if (filter === "remote") return job.location.toLowerCase().includes("remote");
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <JobSearchForm
          params={searchParams}
          onChange={setSearchParams}
          onSearch={handleSearch}
          loading={loading}
          detectedSkills={skills}
        />

        {loading && (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-400 font-medium">Scoring jobs against your resume...</p>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <>
            <JobsFilterBar
              filter={filter}
              onChange={setFilter}
              counts={{
                all: jobs.length,
                "high-match": jobs.filter((j) => j.match_score >= 70).length,
                remote: jobs.filter((j) => j.location.toLowerCase().includes("remote")).length,
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            
            {filteredJobs.length === 0 && (
              <div className="py-16 text-center border border-slate-800 rounded-3xl bg-slate-900/50">
                <p className="text-slate-400">No jobs match the current filter.</p>
                <button 
                  onClick={() => setFilter("all")}
                  className="mt-4 text-blue-400 hover:text-blue-300 font-medium"
                >
                  View all jobs
                </button>
              </div>
            )}
          </>
        )}

        {!loading && jobs.length === 0 && (
          <div className="py-16 text-center border border-slate-800 border-dashed rounded-3xl bg-slate-900/20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 mx-auto mb-4">
              <Briefcase size={28} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-300 mb-2">No Jobs Yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Search for a role above to see personalized job matches and AI application advice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
