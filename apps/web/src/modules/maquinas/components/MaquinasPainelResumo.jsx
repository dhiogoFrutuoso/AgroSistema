import { BarChart3 } from "lucide-react";

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

export default function MaquinasPainelResumo() {
  function gerarResumo() {
    const maquinas = read("@arroz:maquinas");
    const manutencoes = read("@arroz:maquinas:manutencoes");
    const abastecimentos = read("@arroz:maquinas:abastecimentos");
    const documentos = read("@arroz:maquinas:documentos");

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

    const resumo = {
      total: maquinas.length,
      operando: maquinas.filter((item) => item.status === "OPERANDO").length,
      manutencao: maquinas.filter((item) => item.status === "MANUTENCAO").length,
      parada: maquinas.filter((item) => item.status === "PARADA").length,
      disponivel: maquinas.filter((item) => item.status === "DISPONIVEL").length,
      totalManutencoes: manutencoes.length,
      totalAbastecimentos: abastecimentos.length,
      totalDocumentos: documentos.length,
      custoManutencao,
      custoCombustivel,
      custoTotal: custoManutencao + custoCombustivel,
      litros,
      atualizadoEm: new Date().toISOString()
    };

    write("@arroz:maquinas:resumo", resumo);

    alert("Resumo de maquinas enviado para o Painel.");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-white">
          Integracao com Painel
        </h2>
        <p className="text-sm text-slate-400">
          Gera um resumo consolidado da frota para o painel principal.
        </p>
      </div>

      <button
        onClick={gerarResumo}
        className="flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 font-black text-white hover:bg-purple-500"
      >
        <BarChart3 size={18} />
        Enviar resumo para Painel
      </button>
    </div>
  );
}
