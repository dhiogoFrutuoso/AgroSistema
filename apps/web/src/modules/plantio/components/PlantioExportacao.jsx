import { Download, FileJson, FileSpreadsheet } from "lucide-react";

function baixar(nome, conteudo, tipo) {
  const blob = new Blob([conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PlantioExportacao({ plantios = [] }) {
  function exportarJson() {
    baixar("plantio-backup.json", JSON.stringify(plantios, null, 2), "application/json");
  }

  function exportarCsv() {
    if (!plantios.length) {
      alert("Nenhum plantio para exportar.");
      return;
    }

    const colunas = [
      "id", "safra", "fazenda", "talhao", "cultura", "variedade", "area",
      "dataInicio", "dataFim", "operador", "maquina", "sementes", "insumos",
      "custoMaquina", "maoObra", "outrosCustos", "custoTotal", "produtividadePrevista", "status", "observacoes"
    ];

    const linhas = plantios.map((item) =>
      colunas.map((coluna) => '"' + String(item[coluna] ?? "").replaceAll('"', '""') + '"').join(";")
    );

    const csv = [colunas.join(";"), ...linhas].join("\n");
    baixar("plantio.csv", csv, "text/csv;charset=utf-8");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-white">Exportação do Plantio</h2>
        <p className="text-sm text-slate-400">Backup local, CSV e JSON dos registros de plantio.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={exportarCsv} className="flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 font-black text-white hover:bg-green-500 transition-colors">
          <FileSpreadsheet size={18} /> Exportar CSV
        </button>
        <button onClick={exportarJson} className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-black text-white hover:bg-blue-500 transition-colors">
          <FileJson size={18} /> Exportar JSON
        </button>
        <button onClick={exportarJson} className="flex items-center gap-2 rounded-2xl bg-yellow-600 px-5 py-3 font-black text-white hover:bg-yellow-500 transition-colors">
          <Download size={18} /> Backup
        </button>
      </div>
    </div>
  );
}