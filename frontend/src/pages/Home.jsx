import {
  Brain,
  FileSearch,
  Briefcase,
  Trophy,
  MessageSquareText,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import UploadCard from "../components/UploadCard";
import FeatureCard from "../components/FeatureCard";

function Home() {
  const scrollToSection = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const features = [
    {
      icon: <FileSearch size={28} />,
      title: "ATS Analysis",
      description:
        "Advanced ATS scoring with detailed section-level breakdowns and optimization suggestions.",
    },
    {
      icon: <Briefcase size={28} />,
      title: "Job Matching",
      description:
        "Compare resumes against job descriptions and discover critical skill gaps.",
    },
    {
      icon: <Brain size={28} />,
      title: "AI Resume Review",
      description:
        "Receive personalized strengths, weaknesses, and resume improvement suggestions.",
    },
    {
      icon: <MessageSquareText size={28} />,
      title: "Interview Prep",
      description:
        "Generate technical, project-based, and behavioral interview questions.",
    },
    {
      icon: <Trophy size={28} />,
      title: "Resume Benchmark",
      description:
        "Benchmark your resume against industry standards and peer profiles.",
    },
    {
      icon: <Sparkles size={28} />,
      title: "Role Readiness",
      description:
        "Evaluate readiness for Backend, Full Stack, Software, and AI Engineer roles.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* LEFT */}

            <div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Build a Resume
                <span className="block text-blue-500">
                  That Gets Interviews
                </span>
              </h1>

              <p className="mt-8 text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                Analyze ATS compatibility, benchmark your profile,
                match job descriptions, generate interview questions,
                and receive AI-powered recommendations.
              </p>

              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => scrollToSection("upload")}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-700 transition"
                >
                  Analyze Resume
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => scrollToSection("features")}
                  className="rounded-xl border border-slate-700 px-8 py-4 font-semibold hover:border-blue-500 transition"
                >
                  Explore Features
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <h3 className="text-4xl font-bold text-blue-500">
              ATS
            </h3>

            <p className="mt-3 text-slate-400">
              Smart ATS scoring and optimization.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <h3 className="text-4xl font-bold text-green-500">
              AI
            </h3>

            <p className="mt-3 text-slate-400">
              Gemini-powered resume intelligence.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <h3 className="text-4xl font-bold text-purple-500">
              Jobs
            </h3>

            <p className="mt-3 text-slate-400">
              Career readiness and job matching.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold">
            Everything You Need
          </h2>

          <p className="mt-4 text-lg text-slate-400">
            A complete AI-powered resume analysis platform.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* UPLOAD */}

      <section
        id="upload"
        className="max-w-5xl mx-auto px-6 pb-28"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">
            Upload Your Resume
          </h2>

          <p className="mt-4 text-slate-400">
            Get ATS scores, AI insights, and career recommendations instantly.
          </p>
        </div>

        <UploadCard />
      </section>

      {/* FOOTER */}

      <footer className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-bold text-lg">
              AI Resume Analyzer
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              Built with React, FastAPI and Gemini AI
            </p>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 AI Resume Analyzer
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;