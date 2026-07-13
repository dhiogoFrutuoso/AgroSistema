export const MODULOS_RELATORIO = [
  "GERAL",
  "FUNCIONARIOS",
  "TALHOES",
  "GPS",
  "ESTOQUE",
  "MAQUINAS",
  "PLANTIO",
  "COLHEITA",
  "IRRIGACAO",
  "DOCUMENTOS",
  "FINANCEIRO",
  "AUDITORIA"
];

export const TIPOS_RELATORIO = [
  "EXECUTIVO",
  "OPERACIONAL",
  "FINANCEIRO",
  "TECNICO",
  "AUDITORIA"
];

export function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export function num(value, digits = 2) {
  return Number(value || 0).toLocaleString("pt-BR", {
    maximumFractionDigits: digits
  });
}

export function parseDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("pt-BR");
}

export function baixarArquivo(nome, conteudo, tipo) {
  const blob = new Blob([conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
