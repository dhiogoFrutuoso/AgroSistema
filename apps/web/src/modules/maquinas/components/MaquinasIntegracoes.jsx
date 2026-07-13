import { Sprout, Wheat, Link2 } from "lucide-react";

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export default function MaquinasIntegracoes() {
  const maquinas = read("@arroz:maquinas");
  const plantios = read("@arroz:plantio");
  const colheitas = read("@arroz:colheita");

  const maquinasUsadasPlantio = maquinas.filter((maquina) =>
    plantios.some((plantio) =>
      String(plantio.maquina || "").toLowerCase().includes(String(maquina.nome || "").toLowerCase())
    )
  );

  const maquinasUsadasColheita = maquinas.filter((maquina) =>
    colheitas.some((colheita) =>
      String(colheita.maquina || "").toLowerCase().includes(String(maquina.nome || "").toLowerCase())
    )
  );

  const cards = [
    {
      titulo: "Integradas ao Plantio",
      valor: maquinasUsadasPlantio.length,
      icon: Sprout,
      classe: "text-green-400 bg-green-500/10"
    },
    {
      titulo: "Integradas a Colheita",
      valor: maquinasUsadasColheita.length,
      icon: Wheat,
      classe: "text-yellow-400 bg-yellow-500/10"
    },
    {
      titulo: "Total de Maquinas",
      valor: maquinas.length,
      icon: Link2,
      classe: "text-blue-400 bg-blue-500/10"
    }
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-white">
          Integracoes Operacionais
        </h2>
        <p className="text-sm text-slate-400">
          Leitura automatica de maquinas relacionadas ao plantio e colheita.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
                  <h3 className="mt-2 text-4xl font-black text-white">{card.valor}</h3>
                </div>

                <div className={"rounded-2xl p-3 " + card.classe}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-4 font-black text-white">Maquinas no Plantio</h3>

          <div className="space-y-2">
            {maquinasUsadasPlantio.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-950/60 p-3 text-slate-200">
                {item.nome}
              </div>
            ))}

            {maquinasUsadasPlantio.length === 0 && (
              <p className="text-sm text-slate-400">Nenhuma maquina vinculada ao plantio.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-4 font-black text-white">Maquinas na Colheita</h3>

          <div className="space-y-2">
            {maquinasUsadasColheita.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-950/60 p-3 text-slate-200">
                {item.nome}
              </div>
            ))}

            {maquinasUsadasColheita.length === 0 && (
              <p className="text-sm text-slate-400">Nenhuma maquina vinculada a colheita.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
