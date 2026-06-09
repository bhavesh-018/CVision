import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
function AtsTab({ analysis }) {
  const breakdown =
    analysis.ats?.breakdown ||
    analysis.breakdown ||
    {};

  const suggestions =
    analysis.evaluation?.suggestions ||
    analysis.suggestions ||
    [];

  return (
    <div className="space-y-8">

      {/* ATS Breakdown */}

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <h2 className="text-3xl font-bold mb-8">
          ATS Breakdown
        </h2>

        <div className="space-y-6">

          {Object.entries(breakdown).map(
            ([key, value]) => (
              <div key={key}>

                <div className="flex justify-between mb-3">

                  <span className="capitalize text-slate-300">
                    {key}
                  </span>

                  <span className="font-semibold text-white">
                    {value}
                  </span>

                </div>

                <div className="h-3 rounded-full bg-slate-800 overflow-hidden">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{
                      width: `${value * 4}%`,
                    }}
                  />

                </div>

              </div>
            )
          )}

        </div>

      </div>

      {/* ATS Suggestions */}

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <h2 className="text-3xl font-bold mb-8">
          ATS Optimization Suggestions
        </h2>

        <div className="space-y-4">

          {suggestions.length > 0 ? (

            suggestions.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5"
              >
                <p className="text-slate-300">
                  {item}
                </p>
              </div>
            ))

          ) : (

            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">

              <p className="text-green-400">
                Your resume already looks well optimized for ATS systems.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* ATS Summary */}

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <h2 className="text-3xl font-bold mb-8">
          ATS Summary
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">

            <h3 className="text-green-400 font-semibold mb-2">
              Strengths
            </h3>

            <p className="text-slate-300">
              Technical skills, projects, and experience sections detected successfully.
            </p>

          </div>

          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">

            <h3 className="text-yellow-400 font-semibold mb-2">
              Improvements
            </h3>

            <p className="text-slate-300">
              Add more quantified achievements and measurable business impact.
            </p>

          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">

            <h3 className="text-blue-400 font-semibold mb-2">
              Recommendation
            </h3>

            <p className="text-slate-300">
              Tailor your resume for every job description before applying.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AtsTab;