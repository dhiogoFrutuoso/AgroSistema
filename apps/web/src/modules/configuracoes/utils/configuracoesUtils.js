export const TEMAS = ["ESCURO", "CLARO", "AGRICOLA", "DOURADO"];
export const DENSIDADES = ["COMPACTO", "NORMAL", "ESPACOSO"];

export const MODULOS_CONFIG = [
  "Painel",
  "Funcionarios",
  "Fazendas",
  "Talhoes",
  "Mapas/GPS",
  "Financeiro",
  "Estoque",
  "Maquinas",
  "Plantio",
  "Colheita",
  "Irrigacao",
  "Documentos",
  "Relatorios",
  "Auditoria",
  "Banco de Dados"
];

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
