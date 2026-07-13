export const CATEGORIAS_DOCUMENTOS = [
  "Funcionarios", "Fazendas", "Talhoes", "Maquinas", "Plantio", "Colheita",
  "Irrigacao", "Financeiro", "Estoque", "Contratos", "Relatorios", "Juridico",
  "Fiscal", "Ambiental", "Outros"
];

export const PRIORIDADES_DOCUMENTOS = ["CRITICO", "ALTO", "MEDIO", "BAIXO"];

export const TIPOS_PERMITIDOS = ["pdf", "png", "jpg", "jpeg", "webp", "doc", "docx", "xls", "xlsx", "csv", "txt"];

export function formatBytes(bytes = 0) {
  const value = Number(bytes || 0);
  if (value <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(value) / Math.log(1024));
  return `${(value / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

export function getExtensao(nome = "") {
  return String(nome).split(".").pop().toLowerCase();
}

export function getTipoDocumento(ext = "") {
  const e = String(ext).toLowerCase();
  if (e === "pdf") return "PDF";
  if (["png", "jpg", "jpeg", "webp"].includes(e)) return "IMAGEM";
  if (["xls", "xlsx", "csv"].includes(e)) return "PLANILHA";
  if (["doc", "docx"].includes(e)) return "DOCUMENTO";
  if (e === "txt") return "TEXTO";
  return "OUTRO";
}

export function prioridadeClass(prioridade) {
  const p = String(prioridade || "").toUpperCase();
  if (p === "CRITICO") return "bg-red-500/20 text-red-400";
  if (p === "ALTO") return "bg-amber-500/20 text-amber-400";
  if (p === "MEDIO") return "bg-blue-500/20 text-blue-400";
  return "bg-emerald-500/20 text-emerald-400";
}

export function tipoClass(tipo) {
  const t = String(tipo || "").toUpperCase();
  if (t === "PDF") return "bg-red-500/20 text-red-400";
  if (t === "IMAGEM") return "bg-emerald-500/20 text-emerald-400";
  if (t === "PLANILHA") return "bg-green-500/20 text-green-400";
  if (t === "DOCUMENTO") return "bg-blue-500/20 text-blue-400";
  return "bg-slate-500/20 text-slate-400";
}

export function mesLabel(iso = "") {
  if (!iso) return "Sem data";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Sem data";
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}