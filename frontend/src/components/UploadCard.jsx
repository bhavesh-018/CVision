function UploadCard() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10">

      <div className="rounded-2xl border-2 border-dashed border-slate-700 p-16 text-center">

        <h3 className="text-2xl font-bold">
          Upload Resume
        </h3>

        <p className="mt-3 text-slate-400">
          Upload a PDF resume and receive AI-powered insights.
        </p>

        <input
          type="file"
          accept=".pdf"
          className="mx-auto mt-8 block"
        />

        <button className="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-medium hover:bg-blue-700">
          Analyze Resume
        </button>

      </div>

    </div>
  );
}

export default UploadCard;