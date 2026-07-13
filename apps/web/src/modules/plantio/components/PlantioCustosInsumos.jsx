import { DollarSign, Package, Sprout, TrendingDown } from "lucide-react";

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export default function PlantioCustosInsumos({ plantios = [] }) {
  const custoSementes = plantios.reduce((acc, item) => acc + Number(item.sementes || 0), 0);
  const custoInsumos = plantios.reduce((acc, item) => acc + Number(item.insumos || 0), 0);
  const custoMaquinas = plantios.reduce((acc, item) => acc + Number(item.custoMaquina || 0), 0);
  const custoTotal = plantios.reduce((acc, item) => acc + Number(item.custoTotal || 0), 0);

  const cards = [
    { titulo: "Sementes", valor: money(custoSementes), icon: Sprout, classe: "text-green-400 bg-green-500/10" },
    { titulo: "Insumos", valor: money(custoInsumos), icon: Package, classe: "text-blue-400 bg-blue-500/10" },
    { titulo: "Maquinas", valor: money(custoMaquinas), icon: TrendingDown, classe: "text-yellow-400 bg-yellow-500/10" },
    { titulo: "Custo Total", valor: money(custoTotal), icon: DollarSign, classe: "text-red-400 bg-red-500/10" }
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-white">Custos e Insumos</h2>
        <p className="text-sm text-slate-400">Resumo financeiro dos custos do plantio.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.titulo} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{card.titulo}</p>
                  <h3 className="mt-2 text-2xl font-black text-white">{card.valor}</h3>
                </div>

                <div className={"rounded-2xl p-3 " + card.classe}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
