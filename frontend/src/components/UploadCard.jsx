import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Loader2, ChevronDown, ChevronUp, Briefcase, Sparkles } from "lucide-react";

import api from "../services/api";

function UploadCard() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showJdInput, setShowJdInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a resume first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      if (jobDescription.trim()) {
        formData.append("job_description", jobDescription.trim());
      }
      
      let sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("session_id", sessionId);
      }
      formData.append("session_id", sessionId);

      const response = await api.post(
        "/dashboard",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem(
        "analysis",
        JSON.stringify(response.data)
      );
      localStorage.setItem(
        "filename",
        file.name
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Failed to analyze resume"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 md:p-10 shadow-2xl">
      <div className="rounded-2xl border-2 border-dashed border-slate-700/80 p-8 md:p-12 text-center bg-slate-950/40">

        <div className="flex justify-center mb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5">
            <Upload size={28} />
          </div>
        </div>

        <h3 className="text-3xl font-extrabold text-white tracking-tight">
          Upload Resume
        </h3>

        <p className="mt-3 text-slate-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          Upload your PDF resume to receive multi-dimensional ATS scoring, AI reviews, benchmark rankings, and role readiness across 9 top tech careers.
        </p>

        {/* FILE UPLOAD BUTTON */}
        <div className="mt-8">
          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <label
            htmlFor="resume-upload"
            className="inline-flex items-center gap-2 cursor-pointer rounded-xl border border-slate-700 bg-slate-800/80 px-7 py-3 text-sm font-semibold text-slate-200 hover:border-blue-500 hover:text-white hover:bg-slate-800 transition shadow-sm"
          >
            <Upload size={16} />
            {file ? "Replace PDF" : "Choose PDF"}
          </label>
        </div>

        {file && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-2 text-sm text-green-400 font-medium">
            <FileText size={16} />
            <span>{file.name}</span>
          </div>
        )}

        {/* OPTIONAL JOB DESCRIPTION EXPANDABLE SECTION */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-left max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setShowJdInput(!showJdInput)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/70 transition text-sm font-medium text-slate-300"
          >
            <div className="flex items-center gap-2.5">
              <Briefcase size={16} className="text-purple-400" />
              <span>Target Job Description</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-normal">
                Optional
              </span>
            </div>
            <div className="text-slate-400">
              {showJdInput ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </button>

          {showJdInput && (
            <div className="mt-3 space-y-2 animate-fadeIn">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target Job Description (responsibilities, required skills, tech stack)..."
                rows={5}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition resize-none"
              />
              <p className="text-xs text-slate-400 flex items-center gap-1.5 pl-1">
                <Sparkles size={13} className="text-purple-400" />
                Providing a JD enables targeted ATS keyword matching, semantic fit scoring, and tailored resume advice. If omitted, we evaluate general readiness across all 9 roles.
              </p>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-5 text-sm text-red-400 font-medium">
            {error}
          </p>
        )}

        {/* ANALYZE SUBMIT BUTTON */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-8 flex items-center justify-center gap-2 mx-auto rounded-xl bg-blue-600 px-9 py-3.5 font-bold text-white hover:bg-blue-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-blue-600/20"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Analyzing Resume...</span>
            </>
          ) : (
            <>
              <span>{jobDescription.trim() ? "Analyze Resume & Match JD" : "Analyze Resume"}</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}

export default UploadCard;