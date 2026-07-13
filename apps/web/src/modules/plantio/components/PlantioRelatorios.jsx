import jsPDF from "jspdf";
import { FileText } from "lucide-react";

export default function PlantioRelatorios({ plantios = [] }) {
  function gerarPdf() {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("ARROZ DOS FERREIRAS", 14, 15);

    doc.setFontSize(12);
    doc.text("Relatório de Plantio", 14, 25);
    doc.text("Gerado em: " + new Date().toLocaleString("pt-BR"), 14, 32);

    let y = 45;

    if (plantios.length === 0) {
      doc.text("Nenhum plantio cadastrado.", 14, y);
    }

    plantios.forEach((item, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(12);
      doc.text(String(index + 1) + ". " + (item.talhao || "Sem talhão"), 14, y);

      y += 7;
      doc.setFontSize(10);
      doc.text("Safra: " + (item.safra || "-"), 18, y);
      y += 6;
      doc.text("Fazenda: " + (item.fazenda || "-"), 18, y);
      y += 6;
      doc.text("Cultura: " + (item.cultura || "-") + " | Variedade: " + (item.variedade || "-"), 18, y);
      y += 6;
      doc.text("Área: " + (item.area || 0) + " ha", 18, y);
      y += 6;
      doc.text("Início: " + (item.dataInicio ? new Date(item.dataInicio).toLocaleDateString("pt-BR", {timeZone: 'UTC'}) : "-") + " | Fim: " + (item.dataFim ? new Date(item.dataFim).toLocaleDateString("pt-BR", {timeZone: 'UTC'}) : "-"), 18, y);
      y += 6;
      doc.text("Operador: " + (item.operador || "-") + " | Máquina: " + (item.maquina || "-"), 18, y);
      y += 6;
      doc.text("Custo Total: R$ " + Number(item.custoTotal || 0).toLocaleString("pt-BR"), 18, y);
      y += 6;
      doc.text("Status: " + (item.status || "-"), 18, y);
      y += 10;
    });

    doc.save("relatorio-plantio.pdf");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-white">Relatórios de Plantio</h2>
        <p className="text-sm text-slate-400">Gere PDF técnico dos plantios cadastrados.</p>
      </div>

      <button onClick={gerarPdf} className="flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-black text-white hover:bg-red-500 transition-colors">
        <FileText size={18} /> Gerar PDF
      </button>
    </div>
  );
}