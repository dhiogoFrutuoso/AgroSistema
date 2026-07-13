export default function PageHeader({
  eyebrow = "Gestão empresarial",
  title,
  description,
  action
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl md:flex-row md:items-center">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-500">
          {eyebrow}
        </p>

        <h1 className="mt-2 text-3xl font-black md:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-3xl text-slate-300">
            {description}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}
