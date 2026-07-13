import { Link2, Tractor, BarChart3 } from "lucide-react";

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export default function PlantioIntegracoes({ plantios = [] }) {
  const maquinas = read("@arroz:maquinas");

  const maquinasUsadas = maquinas.filter((maquina) =>
    plantios.some((plantio) =>
      String(plantio.maquina || "")
        .toLowerCase()
        .includes(String(maquina.nome || "").toLowerCase())
    )
  );

  const areaTotal = plantios.reduce((acc, item) => acc + Number(item.area || 0), 0);
  const custoTotal = plantios.reduce((acc, item) => acc + Number(item.custoTotal || 0), 0);

  function enviarPainel() {
    const resumo = {
      total: plantios.length,
      areaTotal,
      custoTotal,
      custoPorHa: areaTotal > 0 ? custoTotal / areaTotal : 0,
      maquinasUsadas: maquinasUsadas.length,
      planejados: plantios.filter((item) => item.status === "PLANEJADO").length,
      andamento: plantios.filter((item) => item.status === "EM_ANDAMENTO").length,
      concluidos: plantios.filter((item) => item.status === "CONCLUIDO").length,
      atualizadoEm: new Date().toISOString()
    };

    write("@arroz:plantio:resumo", resumo);

    alert("Resumo de plantio enviado para o Painel.");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-white">Integracoes do Plantio</h2>
        <p className="text-sm text-slate-400">
          Maquinas utilizadas e resumo consolidado para o Painel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Maquinas vinculadas</p>
              <h3 className="mt-2 text-4xl font-black text-white">{maquinasUsadas.length}</h3>
            </div>
            <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-400">
              <Tractor size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Area integrada</p>
              <h3 className="mt-2 text-4xl font-black text-white">
                {Number(areaTotal || 0).toLocaleString("pt-BR")} ha
              </h3>
            </div>
            <div className="rounded-2xl bg-green-500/10 p-3 text-green-400">
              <Link2 size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Custo integrado</p>
              <h3 className="mt-2 text-2xl font-black text-white">{money(custoTotal)}</h3>
            </div>
            <div className="rounded-2xl bg-red-500/10 p-3 text-red-400">
              <BarChart3 size={24} />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={enviarPainel}
        className="mt-5 flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 font-black text-white hover:bg-purple-500"
      >
        <BarChart3 size={18} />
        Enviar resumo para Painel
      </button>
    </div>
  );
}
