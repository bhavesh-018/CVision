import { useEffect, useState } from "react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import OverviewSection from "../components/dashboard/OverviewSection";
import TabNavigation from "../components/dashboard/TabNavigation";

import AtsTab from "../components/dashboard/AtsTab";
import JobMatchTab from "../components/dashboard/JobMatchTab";
import ReviewTab from "../components/dashboard/ReviewTab";
import BenchmarkTab from "../components/dashboard/BenchmarkTab";
import ReadinessTab from "../components/dashboard/ReadinessTab";
import InterviewTab from "../components/dashboard/InterviewTab";
import RewriteTab from "../components/dashboard/RewriteTab";
import Navbar from "../components/Navbar";
import UploadCard from "../components/UploadCard";

function Dashboard() {
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState("ats");

  useEffect(() => {
    const storedData = localStorage.getItem("analysis");

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setAnalysis(parsed);
        if (parsed.job_match) {
          setActiveTab("job_match");
        }
      } catch (e) {
        console.error("Error parsing analysis data", e);
      }
    }
  }, []);

  if (!analysis) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <UploadCard />
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
    ...(analysis.job_match
      ? [{ id: "job_match", label: "Target JD Match" }]
      : []),
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
          jobMatch={analysis.job_match}
          onNavigateToJdMatch={() => setActiveTab("job_match")}
        />

        <div className="mt-10">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <div className="mt-8">
          {activeTab === "job_match" && (
            <JobMatchTab analysis={analysis} />
          )}

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