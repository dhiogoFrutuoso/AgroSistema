import {
  Tractor,
  Wrench,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export default function MaquinasDashboard({
  indicadores
}) {

  const cards = [

    {
      titulo:
        "Total",
      valor:
        indicadores.total || 0,
      icon:
        Tractor,
      cor:
        "text-blue-400"
    },

    {
      titulo:
        "Operando",
      valor:
        indicadores.operando || 0,
      icon:
        CheckCircle,
      cor:
        "text-green-400"
    },

    {
      titulo:
        "Manutencao",
      valor:
        indicadores.manutencao || 0,
      icon:
        Wrench,
      cor:
        "text-yellow-400"
    },

    {
      titulo:
        "Paradas",
      valor:
        indicadores.parada || 0,
      icon:
        AlertTriangle,
      cor:
        "text-red-400"
    }

  ];

  return (

    <div
      className="
        grid
        gap-4
        md:grid-cols-4
      "
    >

      {cards.map(card => {

        const Icon =
          card.icon;

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

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    text-slate-400
                  "
                >
                  {card.titulo}
                </p>

                <h2
                  className="
                    mt-2
                    text-4xl
                    font-black
                    text-white
                  "
                >
                  {card.valor}
                </h2>

              </div>

              <Icon
                size={36}
                className={
                  card.cor
                }
              />

            </div>

          </div>

        );

      })}

    </div>

  );
}
