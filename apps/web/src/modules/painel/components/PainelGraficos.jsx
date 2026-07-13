import { num } from "../services/painelService.js";

function Bar({ label, value, max }) {
  const h = max > 0 ? Math.max(8, (Number(value || 0) / max) * 100) : 8;

  return (
    <div className="flex h-56 min-w-14 flex-col items-center justify-end gap-2">
      <span className="text-xs font-black text-white">{num(value, 0)}</span>
      <div className="flex h-40 w-10 items-end rounded-2xl bg-slate-900">
        <div className="w-full rounded-2xl bg-gradient-to-t from-emerald-700 to-emerald-300 shadow-lg shadow-emerald-900/40" style={{ height: `${h}%` }} />
      </div>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}

export default function PainelGraficos({ data }) {
  const areaBars = [
    { label: "Nov", value: data.areaTotal * 0.72 },
    { label: "Dez", value: data.areaTotal * 0.78 },
    { label: "Jan", value: data.areaTotal * 0.82 },
    { label: "Fev", value: data.areaTotal * 0.88 },
    { label: "Mar", value: data.areaTotal * 0.94 },
    { label: "Abr", value: data.areaTotal || 0 }
  ];

  const prodBars = [
    { label: "Nov", value: data.producaoSc * 0.08 },
    { label: "Dez", value: data.producaoSc * 0.18 },
    { label: "Jan", value: data.producaoSc * 0.35 },
    { label: "Fev", value: data.producaoSc * 0.55 },
    { label: "Mar", value: data.producaoSc * 0.78 },
    { label: "Abr", value: data.producaoSc || 0 }
  ];

  const maxArea = Math.max(...areaBars.map((b) => b.value), 1);
  const maxProd = Math.max(...prodBars.map((b) => b.value), 1);

  return (
    <section className="grid gap-5 xl:grid-cols-2">
      <div className="rounded-[2rem] border border-white/10 bg-[#0b1420]/90 p-5 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-white">Evolucao de areas ha</h2>
          <span className="rounded-xl bg-slate-950/60 px-3 py-2 text-xs text-slate-300">Ultimos 6 meses</span>
        </div>
        <div className="flex items-end justify-between gap-3 overflow-x-auto">
          {areaBars.map((item) => <Bar key={item.label} label={item.label} value={item.value} max={maxArea} />)}
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-[#0b1420]/90 p-5 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-white">Producao estimada sc</h2>
          <span className="rounded-xl bg-slate-950/60 px-3 py-2 text-xs text-slate-300">Safra atual</span>
        </div>
        <div className="flex items-end justify-between gap-3 overflow-x-auto">
          {prodBars.map((item) => <Bar key={item.label} label={item.label} value={item.value} max={maxProd} />)}
        </div>
      </div>
    </section>
  );
}
