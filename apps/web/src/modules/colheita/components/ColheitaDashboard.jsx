import { Activity, Banknote, CheckCircle2, Gauge, MapPinned, PackageCheck } from "lucide-react";

function money(v) {
  return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function num(v, d = 2) {
  return Number(v || 0).toLocaleString("pt-BR", { maximumFractionDigits: d });
}

export default function ColheitaDashboard({ resumo }) {
  const cards = [
    { label: "Colheitas", value: resumo.total, icon: Activity, tone: "bg-emerald-500/10 text-emerald-300" },
    { label: "Area Total", value: `${num(resumo.area)} ha`, icon: MapPinned, tone: "bg-blue-500/10 text-blue-300" },
    { label: "Custo Total", value: money(resumo.custos), icon: Banknote, tone: "bg-rose-500/10 text-rose-300" },
    { label: "Produtividade", value: `${num(resumo.produtividadeMedia)} kg/ha`, icon: Gauge, tone: "bg-amber-500/10 text-amber-300" },
    { label: "Peso Liquido", value: `${num(resumo.peso)} kg`, icon: PackageCheck, tone: "bg-indigo-500/10 text-indigo-300" },
    { label: "Concluidas", value: resumo.finalizadas, icon: CheckCircle2, tone: "bg-teal-500/10 text-teal-300" }
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
