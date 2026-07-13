import jsPDF from "jspdf";
import { FileText } from "lucide-react";

export default function ColheitaRelatorios({ dados, resumo }) {
  function gerarPDF() {
    const doc = new jsPDF();
    const now = new Date().toLocaleString("pt-BR");

    doc.setFontSize(16);
    doc.text("ARROZ DOS FERREIRAS - Relatorio de Colheita", 14, 18);

    doc.setFontSize(10);
    doc.text(`Gerado em: ${now}`, 14, 26);
    doc.text(`Total de operacoes: ${resumo.total}`, 14, 36);
    doc.text(`Area colhida: ${Number(resumo.area || 0).toFixed(2)} ha`, 14, 43);
    doc.text(`Peso liquido: ${Number(resumo.peso || 0).toFixed(2)} kg`, 14, 50);
    doc.text(`Produtividade media: ${Number(resumo.produtividadeMedia || 0).toFixed(2)} kg/ha`, 14, 57);
    doc.text(`Custos totais: R$ ${Number(resumo.custos || 0).toFixed(2)}`, 14, 64);

    let y = 78;
    doc.setFontSize(12);
    doc.text("Registros tecnicos", 14, y);
    y += 8;
    doc.setFontSize(9);

    dados.slice(0, 22).forEach((item, index) => {
      if (y > 275) {
        doc.addPage();
        y = 18;
      }

      doc.text(`${index + 1}. ${item.safra || "-"} | ${item.fazenda || "-"} | ${item.talhao || "-"} | ${item.cultura || "-"}`, 14, y);
      y += 5;
      doc.text(`Area: ${item.areaHa || 0} ha | Peso: ${item.pesoLiquido || 0} kg | Produtividade: ${Number(item.produtividade || 0).toFixed(2)} kg/ha | Status: ${item.status}`, 18, y);
      y += 5;
      doc.text(`Operador: ${item.operador || "-"} | Maquina: ${item.maquina || "-"} | Destino: ${item.destino || "-"}`, 18, y);
      y += 7;
    });

    doc.save("relatorio-colheita.pdf");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <h2 className="text-xl font-black text-white">Relatorios</h2>
      <p className="mb-5 text-sm text-slate-400">Relatorio tecnico completo em PDF usando jsPDF.</p>

      <button onClick={gerarPDF} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-black text-slate-950 transition hover:bg-emerald-400">
        <FileText size={18} /> Gerar PDF tecnico
      </button>
    </div>
  );
}
