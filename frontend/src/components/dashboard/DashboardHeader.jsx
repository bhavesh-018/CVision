function DashboardHeader({ filename }) {
  return (
    <div className="mb-10">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div>
          <h1 className="text-5xl font-bold tracking-tight">
            Resume Dashboard
          </h1>

          <p className="mt-3 text-slate-400 text-lg">
            AI-powered resume intelligence and career insights
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-4">

          <p className="text-sm text-slate-500">
            Resume File
          </p>

          <h3 className="mt-1 font-semibold text-white">
            {filename || "Resume.pdf"}
          </h3>

        </div>

      </div>

    </div>
  );
}

export default DashboardHeader;