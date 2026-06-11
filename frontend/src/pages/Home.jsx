import React from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  FileSearch,
  Briefcase,
  MessageSquareText,
  Sparkles,
  ArrowRight,
  GitFork,
  Globe,
  Trophy,
  Upload,
  ChevronRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import UploadCard from "../components/UploadCard";

const TOOLS = [
  {
    icon: <FileSearch size={24} />,
    color: "from-blue-600 to-blue-500",
    badge: "Core",
    title: "Resume Chat",
    description: "Ask any question about your resume. Get instant, AI-powered answers from your own document.",
    href: "/chat",
    cta: "Open Chat",
  },
  {
    icon: <GitFork size={24} />,
    color: "from-slate-600 to-slate-500",
    badge: "Profile Intel",
    title: "GitHub Analysis",
    description: "Analyze your codebase quality, tech stack diversity, and compare your GitHub skills vs your resume.",
    href: "/github",
    cta: "Analyze GitHub",
  },
  {
    icon: <Globe size={24} />,
    color: "from-sky-600 to-sky-500",
    badge: "Profile Intel",
    title: "LinkedIn Check",
    description: "Score your LinkedIn profile completeness and detect alignment issues vs your uploaded resume.",
    href: "/linkedin",
    cta: "Check LinkedIn",
  },
  {
    icon: <Briefcase size={24} />,
    color: "from-green-600 to-emerald-500",
    badge: "Job Hunt",
    title: "Job Matcher",
    description: "Browse open roles scored against your resume in real-time, with AI advice on how to apply.",
    href: "/jobs",
    cta: "Find Jobs",
  },
  {
    icon: <Brain size={24} />,
    color: "from-purple-600 to-indigo-500",
    badge: "AI Coaching",
    title: "Career Coach",
    description: "Your 24/7 AI career advisor. Interview prep, skill gap analysis, and personalized career roadmaps.",
    href: "/coach",
    cta: "Start Coaching",
  },
  {
    icon: <MessageSquareText size={24} />,
    color: "from-amber-600 to-orange-500",
    badge: "Analysis",
    title: "Dashboard",
    description: "View your full resume analysis — ATS score, missing skills, role readiness, and benchmarks.",
    href: "/dashboard",
    cta: "View Dashboard",
  },
];

const STATS = [
  { label: "ATS Optimization", value: "AI-Powered", color: "text-blue-400" },
  { label: "Profile Analysis", value: "Multi-Source", color: "text-purple-400" },
  { label: "Career Tools", value: "5 Modules", color: "text-emerald-400" },
];

export default function Home() {
  const scrollToUpload = () => {
    document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-8">
              <Sparkles size={14} />
              Powered by Gemini 2.5 Flash
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
              Your AI-Powered
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Career Operating System
              </span>
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-12">
              Resume analysis, GitHub intelligence, LinkedIn alignment, job matching,
              and a 24/7 AI career coach — all in one platform.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={scrollToUpload}
                className="flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-bold hover:bg-blue-700 transition-all hover:scale-105 shadow-xl shadow-blue-600/20"
              >
                <Upload size={18} />
                Upload Resume
                <ArrowRight size={18} />
              </button>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-2xl border border-slate-700 px-8 py-4 font-bold hover:border-blue-500 hover:text-blue-300 transition-all"
              >
                View Dashboard
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur p-8 text-center"
            >
              <h3 className={`text-3xl font-black mb-2 ${stat.color}`}>{stat.value}</h3>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Five Powerful Tools</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Every tool works together, using your resume as context to give you hyper-personalized insights.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.title}
              to={tool.href}
              className="group flex flex-col rounded-3xl border border-slate-800 bg-slate-900 p-7 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.color} mb-5 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {tool.icon}
              </div>

              {/* Badge */}
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                {tool.badge}
              </span>

              <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">{tool.description}</p>

              {/* CTA */}
              <div className="flex items-center gap-1 text-sm font-semibold text-blue-400 mt-5 group-hover:gap-2 transition-all">
                {tool.cta} <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* UPLOAD SECTION */}
      <section id="upload" className="max-w-5xl mx-auto px-6 pb-28">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black mb-4">Get Started Now</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Upload your resume to unlock all five AI tools instantly.
          </p>
        </div>
        <UploadCard />
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-bold text-lg">CVision</h3>
            <p className="text-sm text-slate-400 mt-1">Built with React, FastAPI & Gemini AI</p>
          </div>
          <p className="text-sm text-slate-500">© 2026 CVision — All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}