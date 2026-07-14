import jsPDF from "jspdf";
import { FileText } from "lucide-react";
import { getMaquinas } from "../services/MaquinasService.js";

export default function MaquinasRelatorios() {
  function gerarPdf() {
    const maquinas = getMaquinas();

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("ARROZ DOS FERREIRAS", 14, 15);

    doc.setFontSize(12);
    doc.text("Relatorio de Maquinas", 14, 25);
    doc.text("Gerado em: " + new Date().toLocaleString("pt-BR"), 14, 32);

    let y = 45;

    if (maquinas.length === 0) {
      doc.text("Nenhuma maquina cadastrada.", 14, y);
    }

    maquinas.forEach((item, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(12);
      doc.text(String(index + 1) + ". " + (item.nome || "Sem nome"), 14, y);

      y += 7;
      doc.setFontSize(10);
      doc.text("Codigo: " + (item.codigo || "-"), 18, y);
      y += 6;
      doc.text("Marca/Modelo: " + (item.marca || "-") + " / " + (item.modelo || "-"), 18, y);
      y += 6;
      doc.text("Placa: " + (item.placa || "-") + " | Ano: " + (item.ano || "-"), 18, y);
      y += 6;
      doc.text("Operador: " + (item.operador || "-"), 18, y);
      y += 6;
      doc.text("Fazenda: " + (item.fazenda || "-") + " | Talhao: " + (item.talhao || "-"), 18, y);
      y += 6;
      doc.text("Horimetro: " + (item.horimetro || 0) + " | Status: " + (item.status || "-"), 18, y);
      y += 10;
    });

    doc.save("relatorio-maquinas.pdf");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-white">Relatorios</h2>
        <p className="text-sm text-slate-400">Gere relatorio PDF da frota cadastrada.</p>
      </div>

      <button
        onClick={gerarPdf}
        className="flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-black text-white hover:bg-red-500"
      >
        <FileText size={18} />
        Gerar PDF
      </button>
    </div>
  );
}
