import { useEffect, useState } from "react";
import {
  Award,
  Brain,
  FileSearch,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

function Dashboard() {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("analysis");

    if (storedData) {
      setAnalysis(JSON.parse(storedData));
    }
  }, []);

  if (!analysis) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            No Resume Analysis Found
          </h2>

          <p className="mt-4 text-slate-400">
            Upload a resume first.
          </p>
        </div>
      </div>
    );
  }

  const atsScore =
    analysis.ats_score ||
    analysis.score ||
    analysis.ats?.score ||
    0;

  const skills =
    analysis.skills || [];

  const strengths =
    analysis.strengths || [];

  const weaknesses =
    analysis.weaknesses || [];

  const suggestions =
    analysis.suggestions || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}

        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            Resume Dashboard
          </h1>

          <p className="text-slate-400 mt-3">
            Your AI-powered resume analysis results.
          </p>
        </div>

        {/* ATS Score */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

            <div className="flex items-center gap-3 mb-4">
              <Award className="text-green-400" />
              <h3 className="text-lg font-semibold">
                ATS Score
              </h3>
            </div>

            <h2 className="text-6xl font-bold text-green-400">
              {atsScore}
            </h2>

          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

            <div className="flex items-center gap-3 mb-4">
              <FileSearch className="text-blue-400" />
              <h3 className="text-lg font-semibold">
                Skills Found
              </h3>
            </div>

            <h2 className="text-6xl font-bold text-blue-400">
              {skills.length}
            </h2>

          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

            <div className="flex items-center gap-3 mb-4">
              <Brain className="text-purple-400" />
              <h3 className="text-lg font-semibold">
                Resume Quality
              </h3>
            </div>

            <h2 className="text-3xl font-bold text-purple-400">
              {atsScore >= 80
                ? "Excellent"
                : atsScore >= 60
                ? "Good"
                : "Needs Work"}
            </h2>

          </div>

        </div>

        {/* Skills */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            Skills Detected
          </h2>

          <div className="flex flex-wrap gap-3">

            {skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-2 text-blue-400"
              >
                {skill}
              </span>
            ))}

          </div>

        </div>

        {/* Strengths + Weaknesses */}

        <div className="grid lg:grid-cols-2 gap-6 mb-10">

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="text-green-400" />
              <h2 className="text-2xl font-bold">
                Strengths
              </h2>
            </div>

            <ul className="space-y-4">

              {strengths.map((item, index) => (
                <li
                  key={index}
                  className="text-slate-300"
                >
                  • {item}
                </li>
              ))}

            </ul>

          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-yellow-400" />
              <h2 className="text-2xl font-bold">
                Weaknesses
              </h2>
            </div>

            <ul className="space-y-4">

              {weaknesses.map((item, index) => (
                <li
                  key={index}
                  className="text-slate-300"
                >
                  • {item}
                </li>
              ))}

            </ul>

          </div>

        </div>

        {/* Suggestions */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="text-2xl font-bold mb-6">
            Suggestions
          </h2>

          <ul className="space-y-4">

            {suggestions.map((item, index) => (
              <li
                key={index}
                className="text-slate-300"
              >
                • {item}
              </li>
            ))}

          </ul>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;