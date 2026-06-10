import { useEffect, useState } from "react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import OverviewSection from "../components/dashboard/OverviewSection";
import TabNavigation from "../components/dashboard/TabNavigation";

import AtsTab from "../components/dashboard/AtsTab";
import ReviewTab from "../components/dashboard/ReviewTab";
import BenchmarkTab from "../components/dashboard/BenchmarkTab";
import ReadinessTab from "../components/dashboard/ReadinessTab";
import InterviewTab from "../components/dashboard/InterviewTab";
import RewriteTab from "../components/dashboard/RewriteTab";
import Navbar from "../components/Navbar";


function Dashboard() {
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState("ats");

  useEffect(() => {
    const storedData = localStorage.getItem("analysis");

    if (storedData) {
      setAnalysis(JSON.parse(storedData));
    }
  }, []);

  if (!analysis) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
        <div className="text-center">

          <h2 className="text-4xl font-bold">
            No Resume Analysis Found
          </h2>

          <p className="mt-4 text-slate-400">
            Upload a resume first to view your dashboard.
          </p>

        </div>
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
    analysis.evaluation?.strengths || [];

  const weaknesses =
    analysis.evaluation?.weaknesses || [];

  const benchmark =
    analysis.benchmark || {};

  const readiness =
    analysis.readiness || {};

  const tabs = [
    {
      id: "ats",
      label: "ATS Analysis",
    },
    {
      id: "review",
      label: "AI Review",
    },
    {
      id: "benchmark",
      label: "Benchmark",
    },
    {
      id: "readiness",
      label: "Readiness",
    },
    {
      id: "interview",
      label: "Interview",
    },
    {
      id: "rewrite",
      label: "Rewrite",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">

        <DashboardHeader
          filename={analysis.filename}
        />

        <OverviewSection
          atsScore={atsScore}
          benchmark={benchmark}
          readiness={readiness}
          skills={skills}
          strengths={strengths}
          weaknesses={weaknesses}
        />

        <div className="mt-10">

          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

        </div>

        <div className="mt-8">

          {activeTab === "ats" && (
            <AtsTab analysis={analysis} />
          )}

          {activeTab === "review" && (
            <ReviewTab analysis={analysis} />
          )}

          {activeTab === "benchmark" && (
            <BenchmarkTab analysis={analysis} />
          )}

          {activeTab === "readiness" && (
            <ReadinessTab analysis={analysis} />
          )}

          {activeTab === "interview" && (
            <InterviewTab analysis={analysis} />
          )}

          {activeTab === "rewrite" && (
            <RewriteTab analysis={analysis} />
          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;