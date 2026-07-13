import jsPDF from "jspdf";

export function gerarRelatorioTalhao(talhao) {
  const pdf = new jsPDF();

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("ARROZ DOS FERREIRAS", 20, 20);

  pdf.setFontSize(14);
  pdf.text("Relatório do Talhão", 20, 32);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);

  const linhas = [
    `Talhão: ${talhao.nome || "-"}`,
    `Fazenda: ${talhao.fazenda || "-"}`,
    `Cultura: ${talhao.cultura || "-"}`,
    `Área: ${talhao.area || "-"}`,
    `Perímetro: ${talhao.perimetro || "-"}`,
    `Status: ${talhao.status || "-"}`,
    `Data de emissão: ${new Date().toLocaleDateString("pt-BR")}`
  ];

  let y = 50;

  linhas.forEach((linha) => {
    pdf.text(linha, 20, y);
    y += 9;
  });

  y += 8;

  pdf.setFont("helvetica", "bold");
  pdf.text("Coordenadas GPS:", 20, y);
  y += 9;

  pdf.setFont("helvetica", "normal");

  if (Array.isArray(talhao.coordenadas) && talhao.coordenadas.length > 0) {
    talhao.coordenadas.forEach((ponto, index) => {
      pdf.text(`${index + 1}. Lat: ${ponto[0]} | Lng: ${ponto[1]}`, 20, y);
      y += 8;
    });
  } else {
    pdf.text("Sem coordenadas vinculadas.", 20, y);
    y += 8;
  }

  y += 8;

  pdf.setFont("helvetica", "bold");
  pdf.text("Resumo de Gastos:", 20, y);
  y += 9;

  pdf.setFont("helvetica", "normal");

  const gastos = talhao.gastos || [];

  if (gastos.length === 0) {
    pdf.text("Nenhum gasto lançado ainda.", 20, y);
  } else {
    gastos.forEach((gasto) => {
      pdf.text(`${gasto.descricao} - R$ ${gasto.valor}`, 20, y);
      y += 8;
    });
  }

  pdf.save(`relatorio-${talhao.nome || "talhao"}.pdf`);
}
