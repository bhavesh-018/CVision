import {
  Target,
  CheckCircle,
  AlertTriangle,
  BookOpen,
} from "lucide-react";

function ReadinessTab({ analysis }) {
  const readiness =
    analysis.readiness || {};

  const readinessScore =
    readiness.readiness_score || 0;

  const role =
    readiness.role || "Not Specified";

  const readinessLevel =
    readiness.readiness_level || "Unknown";

  const matchingSkills =
    readiness.matching_skills || [];

  const missingSkills =
    readiness.missing_skills || [];

  const strengths =
    readiness.strengths || [];

  const roadmap =
    readiness.roadmap || [];

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-purple-500/20 p-4">
            <Target
              size={32}
              className="text-purple-400"
            />
          </div>

          <div>

            <h2 className="text-3xl font-bold">
              Role Readiness Analysis
            </h2>

            <p className="mt-2 text-slate-400">
              Evaluate your readiness for your target role
              and discover the skills needed to improve.
            </p>

          </div>

        </div>

      </div>

      {/* Readiness Score */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="rounded-3xl border border-purple-500/20 bg-purple-500/5 p-8">

          <h3 className="text-lg text-slate-400">
            Target Role
          </h3>

          <h2 className="mt-3 text-4xl font-bold text-purple-400">
            {role}
          </h2>

          <p className="mt-3 text-slate-400">
            {readinessLevel}
          </p>

        </div>

        <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-8">

          <h3 className="text-lg text-slate-400">
            Readiness Score
          </h3>

          <h2 className="mt-3 text-6xl font-bold text-green-400">
            {readinessScore}%
          </h2>

          <div className="mt-6 h-3 rounded-full bg-slate-800 overflow-hidden">

            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
              style={{
                width: `${readinessScore}%`,
              }}
            />

          </div>

        </div>

      </div>

      {/* Matching vs Missing */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Matching Skills */}

        <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-8">

          <div className="flex items-center gap-3 mb-6">

            <CheckCircle
              size={24}
              className="text-green-400"
            />

            <h3 className="text-2xl font-bold text-green-400">
              Matching Skills
            </h3>

          </div>

          <div className="flex flex-wrap gap-3">

            {matchingSkills.length > 0 ? (

              matchingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-green-400"
                >
                  {skill}
                </span>
              ))

            ) : (

              <p className="text-slate-400">
                No matching skills found.
              </p>

            )}

          </div>

        </div>

        {/* Missing Skills */}

        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">

          <div className="flex items-center gap-3 mb-6">

            <AlertTriangle
              size={24}
              className="text-red-400"
            />

            <h3 className="text-2xl font-bold text-red-400">
              Missing Skills
            </h3>

          </div>

          <div className="flex flex-wrap gap-3">

            {missingSkills.length > 0 ? (

              missingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-400"
                >
                  {skill}
                </span>
              ))

            ) : (

              <p className="text-slate-400">
                No missing skills detected.
              </p>

            )}

          </div>

        </div>

      </div>

      {/* Strengths */}

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <h3 className="text-2xl font-bold mb-6">
          Role Strengths
        </h3>

        <div className="space-y-4">

          {strengths.length > 0 ? (

            strengths.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <p className="text-slate-300">
                  {item}
                </p>
              </div>
            ))

          ) : (

            <p className="text-slate-400">
              No strengths available.
            </p>

          )}

        </div>

      </div>

      {/* Learning Roadmap */}

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <div className="flex items-center gap-3 mb-8">

          <BookOpen
            size={24}
            className="text-yellow-400"
          />

          <h3 className="text-2xl font-bold">
            Learning Roadmap
          </h3>

        </div>

        <div className="space-y-4">

          {roadmap.length > 0 ? (

            roadmap.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5"
              >
                <div className="flex items-center gap-4">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-black font-bold">
                    {index + 1}
                  </div>

                  <p className="text-slate-300">
                    {item}
                  </p>

                </div>
              </div>
            ))

          ) : (

            <p className="text-slate-400">
              No roadmap available.
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default ReadinessTab;