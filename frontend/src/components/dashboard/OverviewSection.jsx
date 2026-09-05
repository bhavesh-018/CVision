import {
  Award,
  Trophy,
  Target,
  FileSearch,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  Sparkles
} from "lucide-react";

function OverviewSection({
  atsScore,
  benchmark,
  readiness,
  skills,
  strengths,
  weaknesses,
  jobMatch = null,
  onNavigateToJdMatch = null,
}) {
  return (
    <div>
      {/* TARGET JD BANNER (IF MATCHED) */}
      {jobMatch && (
        <div className="mb-8 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Briefcase size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                  Target Job Match
                </span>
                <span className="text-xs text-slate-400">
                  {jobMatch.match_level}
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">
                {jobMatch.match_score}% Match Against Target Job
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {jobMatch.matching_skills.length} matching skills • {jobMatch.critical_missing_skills.length} critical gaps detected
              </p>
            </div>
          </div>

          {onNavigateToJdMatch && (
            <button
              onClick={onNavigateToJdMatch}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition shadow-lg shadow-purple-600/20 flex items-center gap-2"
            >
              <Sparkles size={15} />
              View JD Match Breakdown
            </button>
          )}
        </div>
      )}

      {/* KPI CARDS */}
      <div className={`grid md:grid-cols-2 ${jobMatch ? "xl:grid-cols-5" : "xl:grid-cols-4"} gap-6 mb-8`}>
        {jobMatch && (
          <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-purple-500/5 p-8 shadow-lg">
            <Briefcase className="text-purple-400 mb-4" />
            <h3 className="text-slate-400 text-sm font-medium">JD Match</h3>
            <h2 className="text-5xl font-extrabold text-purple-400 mt-3">
              {jobMatch.match_score}%
            </h2>
          </div>
        )}

        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-green-500/10 to-green-500/5 p-8">
          <Award className="text-green-400 mb-4" />
          <h3 className="text-slate-400 text-sm font-medium">ATS Score</h3>
          <h2 className="text-5xl font-extrabold text-green-400 mt-3">
            {atsScore}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-8">
          <Trophy className="text-blue-400 mb-4" />
          <h3 className="text-slate-400 text-sm font-medium">Benchmark</h3>
          <h2 className="text-5xl font-extrabold text-blue-400 mt-3">
            {benchmark?.overall_percentile || 0}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-8">
          <Target className="text-purple-400 mb-4" />
          <h3 className="text-slate-400 text-sm font-medium">Readiness</h3>
          <h2 className="text-5xl font-extrabold text-purple-400 mt-3">
            {readiness?.readiness_score || (typeof readiness === 'object' && Object.values(readiness)[0]?.readiness_score) || 0}%
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 p-8">
          <FileSearch className="text-cyan-400 mb-4" />
          <h3 className="text-slate-400 text-sm font-medium">Skills Found</h3>
          <h2 className="text-5xl font-extrabold text-cyan-400 mt-3">
            {skills.length}
          </h2>
        </div>
      </div>

      {/* STRENGTHS + WEAKNESSES */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="text-green-400" />
            <h2 className="text-2xl font-bold text-white">Top Strengths</h2>
          </div>
          <ul className="space-y-4">
            {strengths.slice(0, 5).map((item, index) => (
              <li key={index} className="text-slate-300 text-sm leading-relaxed">
                • {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Areas To Improve</h2>
          </div>
          <ul className="space-y-4">
            {weaknesses.slice(0, 5).map((item, index) => (
              <li key={index} className="text-slate-300 text-sm leading-relaxed">
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