import React, { useState, useEffect } from "react";
import { Globe, Loader2, Search } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import LinkedInScoreCard from "../components/linkedin/LinkedInScoreCard";
import LinkedInConsistencyReport from "../components/linkedin/LinkedInConsistencyReport";
import LinkedInManualForm from "../components/linkedin/LinkedInManualForm";
import GitHubRecommendations from "../components/github/GitHubRecommendations"; // Reusing the UI component
import api from "../services/api";

export default function LinkedInPage() {
  const [step, setStep] = useState("url"); // url | form | results
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [manualData, setManualData] = useState({
    headline: "",
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    location: ""
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const sessionId = localStorage.getItem("session_id") || "";
  const analysis = JSON.parse(localStorage.getItem("analysis") || "{}");
  const resumeText = analysis.clean_text || "";

  useEffect(() => {
    const cached = localStorage.getItem("linkedin_analysis");
    if (cached) {
      try {
        setResult(JSON.parse(cached));
        setStep("results");
      } catch {}
    }
  }, []);

  const handleUrlAnalyze = async () => {
    if (!linkedinUrl.trim()) {
      toast.error("Enter a LinkedIn URL");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/linkedin/analyze-url", {
        linkedin_url: linkedinUrl.trim(),
        session_id: sessionId,
        resume_text: resumeText
      });
      
      const data = response.data;
      if (data.form_required) {
        toast.error("LinkedIn blocked our analysis bot. Please use manual entry.", { duration: 5000 });
        setStep("form");
      } else {
        setResult(data);
        localStorage.setItem("linkedin_analysis", JSON.stringify(data));
        setStep("results");
        toast.success("Profile analyzed!");
      }
    } catch (err) {
      toast.error("LinkedIn blocked our analysis bot. Please use manual entry.");
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.post("/linkedin/analyze-manual", {
        ...manualData,
        session_id: sessionId,
        resume_text: resumeText
      });
      
      const data = response.data;
      setResult(data);
      localStorage.setItem("linkedin_analysis", JSON.stringify(data));
      setStep("results");
      toast.success("Manual profile analyzed!");
    } catch (err) {
      toast.error("Failed to analyze manual data.");
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setStep("url");
    setResult(null);
    setLinkedinUrl("");
    localStorage.removeItem("linkedin_analysis");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <Globe size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-black text-white">LinkedIn Analysis</h1>
            </div>
            <p className="text-slate-400 max-w-xl">
              Evaluate your LinkedIn profile completeness and check alignment with your resume.
            </p>
          </div>
          
          {step === "results" && (
            <button onClick={resetAnalysis} className="text-sm text-slate-400 hover:text-white transition-colors">
              Analyze Different Profile
            </button>
          )}
        </div>

        {step === "url" && (
          <div className="flex gap-3 mb-10">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlAnalyze()}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full h-12 pl-10 pr-4 rounded-2xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition"
              />
            </div>
            <button
              onClick={handleUrlAnalyze}
              disabled={loading}
              className="flex items-center gap-2 px-6 h-12 rounded-2xl bg-blue-600 font-semibold hover:bg-blue-700 disabled:opacity-50 transition whitespace-nowrap"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Fetching...</>
              ) : (
                <><Globe size={18} /> Analyze</>
              )}
            </button>
          </div>
        )}

        {step === "form" && (
          <LinkedInManualForm 
            data={manualData} 
            onChange={setManualData} 
            onSubmit={handleManualSubmit} 
            loading={loading} 
          />
        )}

        {step === "results" && result && (
          <div className="space-y-6">
            <LinkedInScoreCard result={result} />
            <LinkedInConsistencyReport consistency={result.consistency} />
            <GitHubRecommendations recommendations={result.recommendations} />
          </div>
        )}
      </div>
    </div>
  );
}
