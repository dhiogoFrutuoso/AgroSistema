export const AUDITORIA_ACOES = ["TODOS", "LOGIN", "LOGOUT", "CADASTRO", "EDICAO", "EXCLUSAO", "UPLOAD", "DOWNLOAD", "VISUALIZACAO", "IMPORTACAO", "EXPORTACAO"];
export const AUDITORIA_NIVEIS = ["TODOS", "INFO", "ALERTA", "CRITICO"];
export const AUDITORIA_MODULOS = ["TODOS", "Login", "Painel", "Funcionários", "Fazendas", "Talhões", "Mapas/GPS", "Financeiro", "Estoque", "Máquinas", "Plantio", "Colheita", "Irrigação", "Documentos", "Relatórios", "Auditoria", "Configurações"];

export function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("pt-BR", { timeZone: 'UTC' });
}

export function nivelClass(nivel) {
  const n = String(nivel || "INFO").toUpperCase();
  if (n === "CRITICO") return "bg-red-500/20 text-red-400 border-red-500/30";
  if (n === "ALERTA") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
}

export function acaoClass(acao) {
  const a = String(acao || "").toUpperCase();
  if (a === "EXCLUSAO") return "bg-red-500/20 text-red-400";
  if (a === "EDICAO") return "bg-blue-500/20 text-blue-400";
  if (a === "CADASTRO") return "bg-emerald-500/20 text-emerald-400";
  if (a === "LOGIN") return "bg-indigo-500/20 text-indigo-400";
  if (a === "EXPORTACAO" || a === "DOWNLOAD") return "bg-amber-500/20 text-amber-400";
  return "bg-slate-500/20 text-slate-400";
}