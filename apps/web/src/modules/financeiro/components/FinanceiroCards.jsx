import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Landmark,
  Receipt
} from "lucide-react";

function money(value) {
  return Number(value || 0).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  );
}

export default function FinanceiroCards({
  saldo,
  receitas,
  despesas,
  lancamentos,
  pendentes
}) {
  const cards = [
    {
      titulo: "Saldo Atual",
      valor: money(saldo),
      icon: Wallet,
      color:
        "from-green-600 to-emerald-500"
    },
    {
      titulo: "Receitas",
      valor: money(receitas),
      icon: TrendingUp,
      color:
        "from-blue-600 to-cyan-500"
    },
    {
      titulo: "Despesas",
      valor: money(despesas),
      icon: TrendingDown,
      color:
        "from-red-600 to-rose-500"
    },
    {
      titulo: "Pendentes",
      valor: pendentes,
      icon: Receipt,
      color:
        "from-yellow-500 to-orange-500"
    },
    {
      titulo: "Lancamentos",
      valor: lancamentos,
      icon: DollarSign,
      color:
        "from-purple-600 to-fuchsia-500"
    },
    {
      titulo: "Fluxo Caixa",
      valor: money(receitas - despesas),
      icon: Landmark,
      color:
        "from-emerald-600 to-green-500"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.titulo}
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-white/[0.04]
              p-6
              shadow-2xl
              backdrop-blur-xl
            "
          >
            <div
              className={`
                absolute
                right-0
                top-0
                h-24
                w-24
                rounded-full
                bg-gradient-to-br
                ${card.color}
                opacity-20
                blur-2xl
              `}
            />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  {card.titulo}
                </p>

                <h3 className="mt-2 text-3xl font-black text-white">
                  {card.valor}
                </h3>
              </div>

              <div
                className={`
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  ${card.color}
                  text-white
                  shadow-lg
                `}
              >
                <Icon size={26} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
