import { ChartNoAxesCombined, ClipboardList, MapPinned, Route } from "lucide-react";

export default function IrrigacaoIntegracoes({ talhoes, financeiro, auditoria, rotas }) {
  const items = [
    { label: "Talhoes/GPS", value: talhoes.length, icon: MapPinned, tone: "bg-blue-500/10 text-blue-300" },
    { label: "Financeiro", value: financeiro.length, icon: ChartNoAxesCombined, tone: "bg-rose-500/10 text-rose-300" },
    { label: "Auditoria", value: auditoria.length, icon: ClipboardList, tone: "bg-amber-500/10 text-amber-300" },
    { label: "Rotas Marcadas", value: rotas, icon: Route, tone: "bg-cyan-500/10 text-cyan-300" }
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <h2 className="text-3xl font-black text-white">Integracoes</h2>
      <p className="mt-2 text-base text-slate-400">Vinculo opcional com talhoes, financeiro, auditoria e rota.</p>

      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/40 p-6">
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-3xl ${item.tone}`}>
                <Icon size={26} />
              </div>
              <p className="text-sm uppercase tracking-widest text-slate-400">{item.label}</p>
              <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
