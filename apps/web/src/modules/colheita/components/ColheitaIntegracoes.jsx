import { Boxes, ChartNoAxesCombined, ClipboardList, MapPinned, Tractor } from "lucide-react";

export default function ColheitaIntegracoes({ talhoes, maquinas, financeiro, auditoria }) {
  const items = [
    { label: "Talhoes/GPS", value: talhoes.length, icon: MapPinned },
    { label: "Maquinas", value: maquinas.length, icon: Tractor },
    { label: "Financeiro", value: financeiro.length, icon: ChartNoAxesCombined },
    { label: "Auditoria", value: auditoria.length, icon: ClipboardList },
    { label: "Banco local", value: "localStorage", icon: Boxes }
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <h2 className="text-xl font-black text-white">Integracoes</h2>
      <p className="mb-5 text-sm text-slate-400">Conexao local com modulos existentes do ERP.</p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
              <Icon className="mb-3 text-emerald-300" size={24} />
              <p className="text-xs uppercase tracking-widest text-slate-400">{item.label}</p>
              <p className="mt-1 text-lg font-black text-white">{item.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
