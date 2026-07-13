export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  tone = "green"
}) {
  const tones = {
    green: "from-green-600/30 to-emerald-500/10 text-emerald-300",
    gold: "from-yellow-600/30 to-amber-500/10 text-yellow-300",
    blue: "from-sky-600/30 to-cyan-500/10 text-sky-300",
    red: "from-red-600/30 to-orange-500/10 text-red-300"
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-400">{title}</p>
          <h2 className="mt-3 text-4xl font-black text-white">{value}</h2>
          <p className="mt-2 text-sm font-bold text-emerald-400">{subtitle}</p>
        </div>

        <div className={`rounded-2xl bg-gradient-to-br p-4 ${tones[tone]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
