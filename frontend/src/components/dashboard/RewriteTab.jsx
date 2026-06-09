import {
  Sparkles,
  ArrowRight,
  FileText,
} from "lucide-react";

function RewriteTab({ analysis }) {
  const rewrite =
    analysis.rewrite || {};

  const improvedBullets =
    rewrite.improved_bullets || [];

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-emerald-500/10 to-green-500/10 p-8">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-emerald-500/20 p-4">

            <Sparkles
              size={32}
              className="text-emerald-400"
            />

          </div>

          <div>

            <h2 className="text-3xl font-bold">
              Resume Rewrite Assistant
            </h2>

            <p className="mt-2 text-slate-400">
              AI-generated improvements to make your resume
              stronger, more impactful, and recruiter-friendly.
            </p>

          </div>

        </div>

      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">

          <h4 className="text-slate-400">
            Rewritten Bullets
          </h4>

          <h3 className="text-5xl font-bold text-emerald-400 mt-3">
            {improvedBullets.length}
          </h3>

        </div>

        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-6">

          <h4 className="text-slate-400">
            Sections Improved
          </h4>

          <h3 className="text-5xl font-bold text-blue-400 mt-3">
            {
              new Set(
                improvedBullets.map(
                  (item) => item.section
                )
              ).size
            }
          </h3>

        </div>

        <div className="rounded-3xl border border-purple-500/20 bg-purple-500/5 p-6">

          <h4 className="text-slate-400">
            AI Enhancement
          </h4>

          <h3 className="text-3xl font-bold text-purple-400 mt-5">
            Active
          </h3>

        </div>

      </div>

      {/* Rewrite Cards */}

      {improvedBullets.length > 0 ? (

        <div className="space-y-8">

          {improvedBullets.map(
            (item, index) => (

              <div
                key={index}
                className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden"
              >

                {/* Top */}

                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800">

                  <div className="flex items-center gap-3">

                    <FileText
                      size={20}
                      className="text-blue-400"
                    />

                    <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-2 text-sm text-blue-400">
                      {item.section}
                    </span>

                  </div>

                  <span className="text-slate-500">
                    Rewrite #{index + 1}
                  </span>

                </div>

                {/* Content */}

                <div className="grid lg:grid-cols-2">

                  {/* Original */}

                  <div className="p-8 border-b lg:border-b-0 lg:border-r border-slate-800">

                    <h3 className="text-red-400 font-semibold text-lg mb-5">
                      Original Version
                    </h3>

                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">

                      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {item.original}
                      </p>

                    </div>

                  </div>

                  {/* Improved */}

                  <div className="p-8">

                    <h3 className="text-green-400 font-semibold text-lg mb-5">
                      AI Improved Version
                    </h3>

                    <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">

                      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {item.improved}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Bottom */}

                <div className="border-t border-slate-800 bg-slate-950 px-8 py-4">

                  <div className="flex items-center gap-2 text-emerald-400">

                    <ArrowRight size={16} />

                    <span className="text-sm">
                      Enhanced for clarity, impact, and ATS optimization
                    </span>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      ) : (

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">

          <h3 className="text-2xl font-bold mb-4">
            No Rewrite Suggestions Available
          </h3>

          <p className="text-slate-400">
            Your resume did not require any major rewrites.
          </p>

        </div>

      )}

    </div>
  );
}

export default RewriteTab;