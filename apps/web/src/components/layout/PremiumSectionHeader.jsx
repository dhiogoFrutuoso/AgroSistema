export default function PremiumSectionHeader({
  title,
  subtitle,
  stats = []
}) {
  return (
    <div className="mb-6">

      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
          ARROZ DOS FERREIRAS
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">
          {title}
        </h1>

        <p className="mt-2 text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="
              premium-card-hover
              rounded-3xl
              border border-white/10
              bg-white/[0.04]
              p-5
            "
          >
            <p className="text-xs uppercase tracking-widest text-slate-400">
              {item.label}
            </p>

            <h2 className="mt-2 text-3xl font-black text-emerald-400">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

    </div>
  );
}
