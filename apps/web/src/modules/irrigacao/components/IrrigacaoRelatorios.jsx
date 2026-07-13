import jsPDF from "jspdf";
import { FileText } from "lucide-react";

function money(v) {
  return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function IrrigacaoRelatorios({ dados, resumo }) {
  function gerarPDF() {
    const doc = new jsPDF();
    const now = new Date().toLocaleString("pt-BR");

    doc.setFontSize(16);
    doc.text("ARROZ DOS FERREIRAS - Relatorio de Irrigacao", 14, 18);

    doc.setFontSize(10);
    doc.text(`Gerado em: ${now}`, 14, 27);
    doc.text(`Total de lancamentos: ${resumo.total}`, 14, 38);
    doc.text(`Hectares irrigados: ${Number(resumo.hectares || 0).toFixed(2)} ha`, 14, 45);
    doc.text(`Valor total: ${money(resumo.valorTotal)}`, 14, 52);
    doc.text(`Valor pago: ${money(resumo.valorPago)}`, 14, 59);
    doc.text(`Valor devendo: ${money(resumo.valorDevido)}`, 14, 66);

    let y = 82;
    doc.setFontSize(12);
    doc.text("Detalhamento por empresa, talhao e rota", 14, y);
    y += 8;
    doc.setFontSize(9);

    dados.slice(0, 25).forEach((item, index) => {
      if (y > 275) {
        doc.addPage();
        y = 18;
      }

      doc.text(`${index + 1}. Empresa: ${item.empresaAgua || "-"} | Mes: ${item.mesReferencia || "-"}`, 14, y);
      y += 5;
      doc.text(`Fazenda: ${item.fazenda || "-"} | Talhao: ${item.talhaoNome || "-"} | Cultura: ${item.cultura || "-"}`, 18, y);
      y += 5;
      doc.text(`Hectares: ${item.hectares || 0} | Lote ha: ${item.loteHa || 0} | Lotes: ${item.lotes || 0} | Valor/ha: ${money(item.valorHa)}`, 18, y);
      y += 5;
      doc.text(`Total: ${money(item.valorTotal)} | Pago: ${money(item.valorPago)} | Devendo: ${money(item.valorDevido)} | Status: ${item.statusPagamento}`, 18, y);
      y += 5;
      doc.text(`Rota para talhao: ${item.rotaParaTalhao ? "SIM" : "NAO"} | Obs rota: ${item.observacoesRota || "-"}`, 18, y);
      y += 8;
    });

    doc.save("relatorio-irrigacao.pdf");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <h2 className="text-3xl font-black text-white">Relatorio em PDF</h2>
      <p className="mb-5 mt-2 text-sm text-slate-400">Relatorio tecnico da irrigacao por hectare, talhao, empresa e divida.</p>

      <button onClick={gerarPDF} className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-6 py-4 font-black text-white shadow-xl shadow-blue-950/30 transition hover:bg-blue-400">
        <FileText size={20} /> Gerar relatorio PDF
      </button>
    </div>
  );
}
