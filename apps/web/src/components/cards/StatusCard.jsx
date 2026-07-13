export default function StatusCard({ label, value, tone = "green" }) {
  const tones = {
    green: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    gold: "text-yellow-300 bg-yellow-500/10 border-yellow-500/20",
    red: "text-red-300 bg-red-500/10 border-red-500/20",
    blue: "text-sky-300 bg-sky-500/10 border-sky-500/20"
  };

  return (
    <div className={`rounded-2xl border p-4 ${tones[tone] || tones.green}`}>
      <p className="text-xs font-black uppercase tracking-[0.18em] opacity-80">
        {label}
      </p>
      <h3 className="mt-2 text-2xl font-black">{value}</h3>
    </div>
  );
}
