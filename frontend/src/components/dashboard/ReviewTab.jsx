import {
  Brain,
  CheckCircle,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

function ReviewTab({ analysis }) {
  const review =
    analysis.review || {};

  const strengths =
    review.strengths || [];

  const weaknesses =
    review.weaknesses || [];

  const improvements =
    review.ats_improvements || [];

  const feedback =
    review.overall_feedback ||
    "No feedback available.";

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-8">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-purple-500/20 p-4">
            <Brain
              size={32}
              className="text-purple-400"
            />
          </div>

          <div>

            <h2 className="text-3xl font-bold">
              AI Resume Review
            </h2>

            <p className="text-slate-400 mt-2">
              AI-generated analysis of your resume quality,
              strengths, weaknesses, and optimization opportunities.
            </p>

          </div>

        </div>

      </div>

      {/* Cards */}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Strengths */}

        <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-8">

          <div className="flex items-center gap-3 mb-6">

            <CheckCircle
              size={24}
              className="text-green-400"
            />

            <h3 className="text-xl font-bold text-green-400">
              Strengths
            </h3>

          </div>

          <div className="space-y-4">

            {strengths.length > 0 ? (

              strengths.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-slate-950/50 p-4"
                >
                  <p className="text-slate-300">
                    {item}
                  </p>
                </div>
              ))

            ) : (

              <p className="text-slate-400">
                No strengths found.
              </p>

            )}

          </div>

        </div>

        {/* Weaknesses */}

        <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-8">

          <div className="flex items-center gap-3 mb-6">

            <AlertTriangle
              size={24}
              className="text-yellow-400"
            />

            <h3 className="text-xl font-bold text-yellow-400">
              Weaknesses
            </h3>

          </div>

          <div className="space-y-4">

            {weaknesses.length > 0 ? (

              weaknesses.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-slate-950/50 p-4"
                >
                  <p className="text-slate-300">
                    {item}
                  </p>
                </div>
              ))

            ) : (

              <p className="text-slate-400">
                No weaknesses found.
              </p>

            )}

          </div>

        </div>

        {/* ATS Improvements */}

        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8">

          <div className="flex items-center gap-3 mb-6">

            <Sparkles
              size={24}
              className="text-blue-400"
            />

            <h3 className="text-xl font-bold text-blue-400">
              Improvements
            </h3>

          </div>

          <div className="space-y-4">

            {improvements.length > 0 ? (

              improvements.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-slate-950/50 p-4"
                >
                  <p className="text-slate-300">
                    {item}
                  </p>
                </div>
              ))

            ) : (

              <p className="text-slate-400">
                No improvements available.
              </p>

            )}

          </div>

        </div>

      </div>

      {/* Overall Feedback */}

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <h3 className="text-2xl font-bold mb-6">
          Overall Feedback
        </h3>

        <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800">

          <p className="text-slate-300 leading-relaxed text-lg">
            {feedback}
          </p>

        </div>

      </div>

    </div>
  );
}

export default ReviewTab;