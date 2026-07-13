export default function GpsStats({ hectares, perimetro }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
        <p className="text-xs font-black uppercase tracking-widest text-emerald-300">
          Área Total
        </p>

        <h2 className="mt-2 text-4xl font-black text-emerald-400">
          {hectares}
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          hectares
        </p>
      </div>

      <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-5">
        <p className="text-xs font-black uppercase tracking-widest text-yellow-300">
          Perímetro
        </p>

        <h2 className="mt-2 text-4xl font-black text-yellow-400">
          {perimetro}
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          metros
        </p>
      </div>
    </div>
  );
}
