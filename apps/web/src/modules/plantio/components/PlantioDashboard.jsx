import {
  Sprout,
  MapPinned,
  DollarSign,
  CheckCircle,
  Clock3,
  Activity
} from "lucide-react";

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export default function PlantioDashboard({ resumo }) {
  const cards = [
    { titulo: "Plantios", valor: resumo.total || 0, icon: Sprout, classe: "text-green-400 bg-green-500/10" },
    { titulo: "Area Total", valor: Number(resumo.areaTotal || 0).toLocaleString("pt-BR") + " ha", icon: MapPinned, classe: "text-blue-400 bg-blue-500/10" },
    { titulo: "Custo Total", valor: money(resumo.custoTotal), icon: DollarSign, classe: "text-red-400 bg-red-500/10" },
    { titulo: "Custo por ha", valor: money(resumo.custoPorHa), icon: Activity, classe: "text-yellow-400 bg-yellow-500/10" },
    { titulo: "Em Andamento", valor: resumo.andamento || 0, icon: Clock3, classe: "text-orange-400 bg-orange-500/10" },
    { titulo: "Concluidos", valor: resumo.concluidos || 0, icon: CheckCircle, classe: "text-emerald-400 bg-emerald-500/10" }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.titulo}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{card.titulo}</p>
                <h2 className="mt-2 text-3xl font-black text-white">{card.valor}</h2>
              </div>

              <div className={"rounded-2xl p-3 " + card.classe}>
                <Icon size={26} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
