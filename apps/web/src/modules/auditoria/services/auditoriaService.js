import { api } from "../../../services/api.js";
import jsPDF from "jspdf";

const AUDIT_KEY = "@arroz:auditoria";
const RESUMO_KEY = "@arroz:auditoria:resumo";

function parse(value, fallback = []) { try { return value ? JSON.parse(value) : fallback; } catch { return fallback; } }
function uid(prefix = "audit") { return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`; }

export function getUser() { return parse(localStorage.getItem("@arroz:user"), {}); }

export function isAdmin() {
  const user = getUser();
  const perfil = String(user.perfil || user.role || user.tipo || "").toUpperCase();
  const usuario = String(user.usuario || user.username || "").toLowerCase();
  return perfil === "ADMIN" || usuario === "admin";
}

export function getAuditoriaLocal() { return parse(localStorage.getItem(AUDIT_KEY), []); }

export function saveAuditoria(lista) {
  localStorage.setItem(AUDIT_KEY, JSON.stringify(lista || []));
  window.dispatchEvent(new Event("storage"));
  return lista || [];
}

export async function getAuditoriaApiFirst() {
  try {
    const response = await api.get("/audit");
    if (response && response.ok) {
      const lista = response.data.map(item => ({ ...item, id: item._id || item.id }));
      saveAuditoria(lista);
      return lista;
    }
  } catch (err) {
    console.warn("API de Auditoria indisponível. Usando local.");
  }
  return getAuditoriaLocal();
}

export function registrarAuditoria(acao, descricao, nivel = "INFO", modulo = "Auditoria") {
  const user = getUser();
  const novoRegistro = {
    usuario: user.nome || user.name || user.usuario || user.username || "Sistema",
    modulo, acao, descricao, nivel, dataHora: new Date().toISOString()
  };

  // Envia pra API silenciosamente (sem await para não travar a UI)
  api.post("/audit", novoRegistro).catch(() => {});

  // Salva no local storage rápido
  const lista = getAuditoriaLocal();
  lista.unshift({ ...novoRegistro, id: uid() });
  saveAuditoria(lista.slice(0, 1200));
}

export async function deleteRegistroApiFirst(id) {
  const response = await api.delete(`/audit/${id}`);
  if (!response.ok) throw new Error("Erro ao excluir auditoria no BD.");
  const atualizada = getAuditoriaLocal().filter((item) => String(item.id) !== String(id) && String(item._id) !== String(id));
  saveAuditoria(atualizada);
  registrarAuditoria("EXCLUSAO", `Registro removido: ${id}`, "ALERTA");
  return true;
}

export async function limparAuditoriaApiFirst() {
  const user = getUser();
  await api.post("/audit/clear", { usuario: user.nome || "Admin" });
  saveAuditoria([]);
  return true;
}

export function gerarEventoTeste() {
  registrarAuditoria("CADASTRO", "Evento manual de teste criado na auditoria via painel", "INFO");
}

export function getResumo() {
  const lista = getAuditoriaLocal();
  const hoje = new Date().toISOString().slice(0, 10);

  return {
    total: lista.length,
    hojeTotal: lista.filter((i) => String(i.dataHora || "").slice(0, 10) === hoje).length,
    criticos: lista.filter((i) => String(i.nivel || "").toUpperCase() === "CRITICO").length,
    alertas: lista.filter((i) => String(i.nivel || "").toUpperCase() === "ALERTA").length,
    logins: lista.filter((i) => String(i.acao || "").toUpperCase() === "LOGIN").length,
    exclusoes: lista.filter((i) => String(i.acao || "").toUpperCase() === "EXCLUSAO").length,
    exportacoes: lista.filter((i) => String(i.acao || "").toUpperCase() === "EXPORTACAO").length,
    usuariosUnicos: new Set(lista.map((i) => i.usuario || "Sistema")).size,
    modulosUnicos: new Set(lista.map((i) => i.modulo || "Sistema")).size,
    atualizadoEm: new Date().toISOString()
  };
}

export function enviarResumoPainel() {
  localStorage.setItem(RESUMO_KEY, JSON.stringify(getResumo()));
  registrarAuditoria("EXPORTACAO", "Resumo de auditoria enviado para Painel", "INFO");
}

export function baixarArquivo(nome, conteudo, tipo) {
  const blob = new Blob([conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = nome;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

export function exportarJSON(lista = getAuditoriaLocal()) {
  baixarArquivo("auditoria.json", JSON.stringify(lista, null, 2), "application/json");
  registrarAuditoria("EXPORTACAO", "Auditoria exportada em JSON", "INFO");
}

export function exportarCSV(lista = getAuditoriaLocal()) {
  const headers = ["usuario", "modulo", "acao", "descricao", "nivel", "dataHora"];
  const rows = lista.map((item) => headers.map((h) => `"${String(item[h] ?? "").replaceAll('"', '""')}"`).join(";"));
  baixarArquivo("auditoria.csv", [headers.join(";"), ...rows].join("\n"), "text/csv;charset=utf-8;");
  registrarAuditoria("EXPORTACAO", "Auditoria exportada em CSV", "INFO");
}

export function exportarPDF(lista = getAuditoriaLocal()) {
  const resumo = getResumo(); const doc = new jsPDF(); const now = new Date().toLocaleString("pt-BR");
  doc.setFontSize(16); doc.text("ARROZ DOS FERREIRAS - RELATORIO DE AUDITORIA", 14, 18);
  doc.setFontSize(10); doc.text(`Gerado em: ${now}`, 14, 28); doc.text(`Total de registros: ${resumo.total}`, 14, 38); doc.text(`Eventos hoje: ${resumo.hojeTotal}`, 14, 45); doc.text(`Alertas: ${resumo.alertas}`, 14, 52); doc.text(`Criticos: ${resumo.criticos}`, 14, 59);
  
  let y = 75; doc.setFontSize(12); doc.text("Registros", 14, y); y += 8; doc.setFontSize(8);
  lista.slice(0, 65).forEach((item, index) => {
    if (y > 280) { doc.addPage(); y = 18; }
    doc.text(`${index + 1}. ${item.dataHora ? new Date(item.dataHora).toLocaleString('pt-BR',{timeZone:'UTC'}) : "-"} | Usuário: ${item.usuario || "-"} | Módulo: ${item.modulo || "-"} | ${item.acao || "-"}`, 14, y); y += 5;
    doc.text(`${String(item.descricao || "-").slice(0, 145)} | Nivel: ${item.nivel || "INFO"}`, 18, y); y += 7;
  });
  doc.save("relatorio-auditoria.pdf"); registrarAuditoria("EXPORTACAO", "Auditoria exportada em PDF", "INFO");
}