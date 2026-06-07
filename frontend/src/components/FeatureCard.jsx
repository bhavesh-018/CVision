function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="group rounded-3xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500">

      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <h3 className="mb-3 text-xl font-semibold">
        {title}
      </h3>

      <p className="text-slate-400 leading-relaxed">
        {description}
      </p>

    </div>
  );
}

export default FeatureCard;