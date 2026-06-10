import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Loader2 } from "lucide-react";

import api from "../services/api";

function UploadCard() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
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
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10">
      <div className="rounded-2xl border-2 border-dashed border-slate-700 p-12 text-center">

        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
            <Upload
              size={30}
              className="text-blue-400"
            />
          </div>
        </div>

        <h3 className="text-3xl font-bold">
          Upload Resume
        </h3>

        <p className="mt-3 text-slate-400">
          Upload your PDF resume and receive
          ATS analysis, AI review, benchmark
          scores, and interview insights.
        </p>

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
            className="cursor-pointer rounded-xl border border-slate-700 px-6 py-3 hover:border-blue-500 transition"
          >
            Choose PDF
          </label>
        </div>

        {file && (
          <div className="mt-6 flex items-center justify-center gap-2 text-green-400">
            <FileText size={18} />
            <span>{file.name}</span>
          </div>
        )}

        {error && (
          <p className="mt-4 text-red-400">
            {error}
          </p>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-8 flex items-center justify-center gap-2 mx-auto rounded-xl bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Analyzing...
            </>
          ) : (
            <>
              Analyze Resume
            </>
          )}
        </button>

      </div>
    </div>
  );
}

export default UploadCard;