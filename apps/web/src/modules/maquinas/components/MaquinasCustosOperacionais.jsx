import { DollarSign, Fuel, Wrench, TrendingDown } from "lucide-react";

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export default function MaquinasCustosOperacionais() {
  const manutencoes = read("@arroz:maquinas:manutencoes");
  const abastecimentos = read("@arroz:maquinas:abastecimentos");

  const custoManutencao = manutencoes.reduce(
    (acc, item) => acc + Number(item.custoTotal || 0),
    0
  );

  const custoCombustivel = abastecimentos.reduce(
    (acc, item) => acc + Number(item.valorTotal || 0),
    0
  );

  const litros = abastecimentos.reduce(
    (acc, item) => acc + Number(item.litros || 0),
    0
  );

  const custoTotal = custoManutencao + custoCombustivel;

  const cards = [
    {
      titulo: "Custo Total",
      valor: money(custoTotal),
      icon: DollarSign,
      classe: "text-red-400 bg-red-500/10"
    },
    {
      titulo: "Manutencoes",
      valor: money(custoManutencao),
      icon: Wrench,
      classe: "text-yellow-400 bg-yellow-500/10"
    },
    {
      titulo: "Combustivel",
      valor: money(custoCombustivel),
      icon: Fuel,
      classe: "text-blue-400 bg-blue-500/10"
    },
    {
      titulo: "Litros",
      valor: Number(litros || 0).toLocaleString("pt-BR"),
      icon: TrendingDown,
      classe: "text-emerald-400 bg-emerald-500/10"
    }
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-white">
          Custos Operacionais
        </h2>
        <p className="text-sm text-slate-400">
          Consolidado de manutencoes, abastecimentos e custo total da frota.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.titulo}
              className="rounded-3xl border border-white/10 bg-slate-950/50 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{card.titulo}</p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    {card.valor}
                  </h3>
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
