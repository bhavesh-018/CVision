import {
  Trophy,
  BarChart3,
  TrendingUp,
} from "lucide-react";

function BenchmarkTab({ analysis }) {
  const benchmark =
    analysis.benchmark || {};

  const overallPercentile =
    benchmark.overall_percentile || 0;

  const benchmarkLevel =
    benchmark.benchmark_level ||
    "Not Available";

  const categoryScores =
    benchmark.category_scores || {};

  const comparison =
    benchmark.comparison || {};

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-blue-500/20 p-4">
            <Trophy
              size={32}
              className="text-blue-400"
            />
          </div>

          <div>

            <h2 className="text-3xl font-bold">
              Resume Benchmark
            </h2>

            <p className="mt-2 text-slate-400">
              Compare your resume against industry standards
              and top-performing candidates.
            </p>

          </div>

        </div>

      </div>

      {/* KPI Cards */}

      <div className="grid md:grid-cols-2 gap-6">

        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8">

          <div className="flex items-center gap-3 mb-4">

            <TrendingUp
              size={24}
              className="text-blue-400"
            />

            <h3 className="text-lg font-semibold">
              Overall Percentile
            </h3>

          </div>

          <h2 className="text-6xl font-bold text-blue-400">
            {overallPercentile}
          </h2>

          <p className="mt-3 text-slate-400">
            Compared against benchmark resumes
          </p>

        </div>

        <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-8">

          <div className="flex items-center gap-3 mb-4">

            <Trophy
              size={24}
              className="text-green-400"
            />

            <h3 className="text-lg font-semibold">
              Benchmark Level
            </h3>

          </div>

          <h2 className="text-4xl font-bold text-green-400">
            {benchmarkLevel}
          </h2>

          <p className="mt-3 text-slate-400">
            Current resume standing
          </p>

        </div>

      </div>

      {/* Category Scores */}

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <div className="flex items-center gap-3 mb-8">

          <BarChart3
            size={24}
            className="text-purple-400"
          />

          <h3 className="text-2xl font-bold">
            Category Scores
          </h3>

        </div>

        <div className="space-y-6">

          {Object.entries(categoryScores).map(
            ([key, value]) => (
              <div key={key}>

                <div className="flex justify-between mb-3">

                  <span className="capitalize text-slate-300">
                    {key}
                  </span>

                  <span className="font-semibold">
                    {value}
                  </span>

                </div>

                <div className="h-3 rounded-full bg-slate-800 overflow-hidden">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{
                      width: `${value}%`,
                    }}
                  />

                </div>

              </div>
            )
          )}

        </div>

      </div>

      {/* Comparison Analysis */}

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <h3 className="text-2xl font-bold mb-8">
          Benchmark Comparison
        </h3>

        <div className="grid md:grid-cols-2 gap-6">

          {Object.entries(comparison).map(
            ([key, value]) => (

              <div
                key={key}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-6"
              >

                <h4 className="capitalize text-slate-400 mb-3">
                  {key}
                </h4>

                <p className="text-xl font-semibold">
                  {value}
                </p>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}

export default BenchmarkTab;