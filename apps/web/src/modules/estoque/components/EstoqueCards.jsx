import {
  Package,
  AlertTriangle,
  Warehouse,
  DollarSign
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

export default function EstoqueCards({
  totalItens = 0,
  estoqueBaixo = 0,
  valorTotal = 0
}) {

  const cards = [
    {
      titulo: "Produtos",
      valor: totalItens,
      icon: Package,
      cor: "from-blue-600 to-cyan-500"
    },
    {
      titulo: "Estoque Baixo",
      valor: estoqueBaixo,
      icon: AlertTriangle,
      cor: "from-red-600 to-rose-500"
    },
    {
      titulo: "Locais",
      valor: "Depositos",
      icon: Warehouse,
      cor: "from-yellow-500 to-orange-500"
    },
    {
      titulo: "Valor Estoque",
      valor: money(valorTotal),
      icon: DollarSign,
      cor: "from-green-600 to-emerald-500"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      {cards.map(card => {

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
                ${card.cor}
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
                  ${card.cor}
                  text-white
                `}
              >
                <Icon size={24} />
              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
}
