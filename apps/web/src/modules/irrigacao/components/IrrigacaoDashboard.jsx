import { Banknote, CheckCircle2, Droplets, MapPinned, Package, TriangleAlert } from "lucide-react";

function money(v) {
  return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function num(v) {
  return Number(v || 0).toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

export default function IrrigacaoDashboard({ resumo }) {
  const cards = [
    { label: "Irrigacoes", value: resumo.total, icon: Droplets, tone: "bg-blue-500/10 text-blue-300" },
    { label: "Hectares", value: `${num(resumo.hectares)} ha`, icon: MapPinned, tone: "bg-cyan-500/10 text-cyan-300" },
    { label: "Valor Total", value: money(resumo.valorTotal), icon: Banknote, tone: "bg-rose-500/10 text-rose-300" },
    { label: "Devendo", value: money(resumo.valorDevido), icon: TriangleAlert, tone: "bg-amber-500/10 text-amber-300" },
    { label: "Lotes", value: resumo.lotes, icon: Package, tone: "bg-indigo-500/10 text-indigo-300" },
    { label: "Pagos", value: resumo.pagos, icon: CheckCircle2, tone: "bg-emerald-500/10 text-emerald-300" }
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-lg text-slate-400">{card.label}</p>
                <p className="mt-4 text-4xl font-black tracking-tight text-white">{card.value}</p>
              </div>
              <div className={`flex h-16 w-16 items-center justify-center rounded-3xl ${card.tone}`}>
                <Icon size={32} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
