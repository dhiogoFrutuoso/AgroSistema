import {
  AlertTriangle,
  ShieldAlert,
  Clock3
} from "lucide-react";

export default function EstoqueAlertas({
  produtos = []
}) {

  const hoje =
    new Date();

  const estoqueBaixo =
    produtos.filter(
      item =>
        Number(item.quantidade || 0) <=
        Number(item.minimo || 0)
    );

  const vencidos =
    produtos.filter(item => {

      if (!item.validade) {
        return false;
      }

      return (
        new Date(item.validade) <
        hoje
      );

    });

  const vencendo =
    produtos.filter(item => {

      if (!item.validade) {
        return false;
      }

      const dias =
        (
          new Date(item.validade) -
          hoje
        ) /
        (1000 * 60 * 60 * 24);

      return (
        dias >= 0 &&
        dias <= 30
      );

    });

  const cards = [
    {
      titulo: "Estoque Baixo",
      valor: estoqueBaixo.length,
      icon: AlertTriangle,
      cor: "text-yellow-400"
    },
    {
      titulo: "Produtos Vencidos",
      valor: vencidos.length,
      icon: ShieldAlert,
      cor: "text-red-400"
    },
    {
      titulo: "Vencendo em 30 Dias",
      valor: vencendo.length,
      icon: Clock3,
      cor: "text-orange-400"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">

      {cards.map(card => {

        const Icon = card.icon;

        return (

          <div
            key={card.titulo}
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.04]
              p-6
              shadow-2xl
              backdrop-blur-xl
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-400">
                  {card.titulo}
                </p>

                <h3 className="mt-2 text-4xl font-black text-white">
                  {card.valor}
                </h3>

              </div>

              <Icon
                size={34}
                className={card.cor}
              />

            </div>

          </div>

        );

      })}

    </div>
  );
}
