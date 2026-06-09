import {
  Award,
  Trophy,
  Target,
  FileSearch,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

function OverviewSection({
  atsScore,
  benchmark,
  readiness,
  skills,
  strengths,
  weaknesses,
}) {
  return (
    <div>

      {/* KPI CARDS */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-green-500/10 to-green-500/5 p-8">

          <Award className="text-green-400 mb-4" />

          <h3 className="text-slate-400">
            ATS Score
          </h3>

          <h2 className="text-5xl font-bold text-green-400 mt-3">
            {atsScore}
          </h2>

        </div>

        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-8">

          <Trophy className="text-blue-400 mb-4" />

          <h3 className="text-slate-400">
            Benchmark
          </h3>

          <h2 className="text-5xl font-bold text-blue-400 mt-3">
            {benchmark?.overall_percentile || 0}
          </h2>

        </div>

        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-8">

          <Target className="text-purple-400 mb-4" />

          <h3 className="text-slate-400">
            Readiness
          </h3>

          <h2 className="text-5xl font-bold text-purple-400 mt-3">
            {readiness?.readiness_score || 0}
          </h2>

        </div>

        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 p-8">

          <FileSearch className="text-cyan-400 mb-4" />

          <h3 className="text-slate-400">
            Skills
          </h3>

          <h2 className="text-5xl font-bold text-cyan-400 mt-3">
            {skills.length}
          </h2>

        </div>

      </div>

      {/* STRENGTHS + WEAKNESSES */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="text-green-400" />
            <h2 className="text-2xl font-bold">
              Top Strengths
            </h2>
          </div>

          <ul className="space-y-4">

            {strengths.slice(0, 5).map((item, index) => (
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
              Areas To Improve
            </h2>
          </div>

          <ul className="space-y-4">

            {weaknesses.slice(0, 5).map((item, index) => (
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

export default OverviewSection;