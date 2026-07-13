import jsPDF from "jspdf";
import { FileText } from "lucide-react";
import { audit, money, num } from "../services/OperadorService.js";

export default function OperadorRelatorios({ linhas, resumo }) {
  function baixarPDF() {
    const doc = new jsPDF();
    const now = new Date().toLocaleString("pt-BR");

    doc.setFontSize(16);
    doc.text("ARROZ DOS FERREIRAS", 14, 18);
    doc.setFontSize(12);
    doc.text("Relatorio de Servico do Operador", 14, 28);
    doc.setFontSize(9);
    doc.text(`Gerado em: ${now}`, 14, 36);

    let y = 48;

    linhas.forEach((l, index) => {
      if (y > 250) {
        doc.addPage();
        y = 18;
      }

      doc.setFontSize(11);
      doc.text(`${index + 1}. ${l.nomeOperador || "Operador"} - ${l.cliente || "Cliente"}`, 14, y);
      y += 7;

      doc.setFontSize(8);
      const linhasTexto = [
        `Data: ${l.data || "-"} | Maquina: ${l.maquinaAgricola || "-"} | Fazenda: ${l.fazenda || "-"} | Talhao: ${l.talhao || "-"}`,
        `Servico: ${l.servico || "-"} | Inicio: ${l.horaInicio || "-"} | Fim: ${l.horaFim || "-"} | Horas: ${num(l.horasTrabalhadas)}`,
        `Valor horario: ${money(l.valorHorario)} | Valor total: ${money(l.valorTotal)}`,
        `Litros oleo: ${num(l.litrosOleo)} | Valor litro oleo: ${money(l.valorLitroOleo)} | Gasto oleo: ${money(l.gastoOleo)}`,
        `Outros gastos: ${money(l.outrosGastos)} | Custo total: ${money(l.custoTotal)} | Lucro liquido: ${money(l.lucroLiquido)}`,
        `Status: ${l.status} | Financeiro: ${l.tipoLancamentoFinanceiro}`,
        `Observacoes: ${String(l.observacoes || "-").slice(0, 120)}`
      ];

      linhasTexto.forEach((txt) => {
        doc.text(txt, 18, y);
        y += 5;
      });

      if (l.assinaturaCliente) {
        doc.text("Assinatura digital do cliente:", 18, y);
        y += 4;
        try {
          doc.addImage(l.assinaturaCliente, "PNG", 18, y, 55, 25);
          y += 30;
        } catch {
          doc.text("Assinatura registrada.", 18, y);
          y += 6;
        }
      }

      y += 5;
    });

    if (y > 235) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.text("Total Geral", 14, y);
    y += 8;
    doc.setFontSize(9);
    doc.text(`Registros: ${resumo.totalRegistros}`, 18, y); y += 6;
    doc.text(`Horas: ${num(resumo.totalHoras)}`, 18, y); y += 6;
    doc.text(`Total bruto: ${money(resumo.totalBruto)}`, 18, y); y += 6;
    doc.text(`Gasto oleo: ${money(resumo.gastoOleo)}`, 18, y); y += 6;
    doc.text(`Custo total: ${money(resumo.custoTotal)}`, 18, y); y += 6;
    doc.text(`Lucro liquido: ${money(resumo.lucroLiquido)}`, 18, y);

    doc.save("relatorio-operador.pdf");
    audit("EXPORTACAO", "PDF de operador exportado");
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
      <h2 className="text-2xl font-black text-white">Relatorio PDF</h2>
      <p className="mt-1 text-sm text-slate-400">PDF completo com assinatura digital do cliente.</p>

      <button onClick={baixarPDF} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-black text-slate-950">
        <FileText size={18} /> Baixar PDF
      </button>
    </section>
  );
}
