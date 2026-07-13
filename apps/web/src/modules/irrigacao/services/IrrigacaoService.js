import { api } from "../../../services/api.js";

const STORAGE_KEY = "@arroz:irrigacao";
const RESUMO_KEY = "@arroz:irrigacao:resumo";
const AUDIT_KEY = "@arroz:auditoria";
const FIN_KEY = "@arroz:financeiro";

function safeParse(value, fallback = []) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

function uid(prefix = "irr") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function saveDados(dados) {
  try {
    const safeData = (dados || []).map(item => ({ ...item, comprovante: item.comprovante ? "salvo-no-bd" : "" }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
  } catch (error) {
    console.warn("Aviso: Limite local excedido.");
  }
}

export async function getDadosApiFirst() {
  try {
    const response = await api.get("/irrigations");
    if (response && response.ok) {
      const lista = response.data.map(item => ({ ...item, id: item._id || item.id }));
      saveDados(lista);
      return lista;
    }
  } catch (err) {
    console.warn("API de irrigação indisponível. Usando local.");
  }
  return safeParse(localStorage.getItem(STORAGE_KEY), []);
}

export function calcularValores(payload) {
  const valorHa = Number(payload.valorHa || 0);
  const hectares = Number(payload.hectares || 0);
  const loteHa = Number(payload.loteHa || 5);
  const meses = Number(payload.meses || 1);

  const lotes = loteHa > 0 ? Math.ceil(hectares / loteHa) : 0;
  const valorMensal = hectares * valorHa;
  const valorTotal = valorMensal * meses;
  const valorPago = Number(payload.valorPago || 0);
  const valorDevido = Math.max(0, valorTotal - valorPago);

  return { valorHa, hectares, loteHa, meses, lotes, valorMensal, valorTotal, valorPago, valorDevido };
}

function montarRegistro(payload) {
  const calc = calcularValores(payload);
  return {
    ...payload,
    ...calc,
    statusPagamento: calc.valorDevido <= 0 ? "PAGO" : (calc.valorPago > 0 ? "PARCIAL" : "DEVENDO"),
    criadoEm: payload.criadoEm || new Date().toISOString(),
    atualizadoEm: new Date().toISOString()
  };
}

export async function createRegistroApiFirst(payload) {
  const dados = await getDadosApiFirst();
  const registro = montarRegistro(payload);

  const response = await api.post("/irrigations", registro);
  if (!response.ok) throw new Error(response.error || "Erro ao salvar no Banco de Dados.");

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  saveDados([finalItem, ...dados]);
  registrarAuditoria("CADASTRO", `Irrigação cadastrada para ${finalItem.empresaAgua}`);
  registrarFinanceiro(finalItem);

  return finalItem;
}

export async function updateRegistroApiFirst(id, payload) {
  const dados = await getDadosApiFirst();
  const registro = montarRegistro(payload);

  const response = await api.put(`/irrigations/${id}`, registro);
  if (!response.ok) throw new Error(response.error || "Erro ao atualizar no Banco de Dados.");

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  const atualizados = dados.map((item) => (String(item.id) === String(id) ? finalItem : item));
  
  saveDados(atualizados);
  registrarAuditoria("EDICAO", `Irrigação atualizada: ${finalItem.empresaAgua}`);
  return finalItem;
}

export async function deleteRegistroApiFirst(id) {
  const response = await api.delete(`/irrigations/${id}`);
  if (!response.ok) throw new Error(response.error || "Erro ao excluir no Banco de Dados.");

  const dados = safeParse(localStorage.getItem(STORAGE_KEY), []);
  const atualizados = dados.filter((item) => String(item.id) !== String(id) && String(item._id) !== String(id));
  
  saveDados(atualizados);
  registrarAuditoria("EXCLUSAO", `Irrigação excluída: ${id}`, "ALERTA");
  return true;
}

export function registrarFinanceiro(registro) {
  const valor = Number(registro.valorTotal || 0);
  if (valor <= 0) return;

  const financeiro = safeParse(localStorage.getItem(FIN_KEY), []);
  financeiro.unshift({
    id: uid("fin"),
    tipo: "DESPESA",
    modulo: "Irrigacao",
    descricao: `Irrigação Agranel - ${registro.empresaAgua} - ${registro.talhaoNome || "Talhão"}`,
    valor,
    categoria: "Irrigação",
    status: registro.statusPagamento === "PAGO" ? "PAGO" : "PENDENTE",
    data: registro.dataLancamento || new Date().toISOString().slice(0, 10),
    origemId: registro.id || registro._id,
    criadoEm: new Date().toISOString()
  });

  localStorage.setItem(FIN_KEY, JSON.stringify(financeiro.slice(0, 800)));
}

export function registrarAuditoria(acao, descricao, nivel = "INFO") {
  const lista = safeParse(localStorage.getItem(AUDIT_KEY), []);
  const user = safeParse(localStorage.getItem("@arroz:user"), { nome: "Sistema" });
  lista.unshift({ id: uid("audit"), usuario: user.nome || "Sistema", modulo: "Irrigação", acao, descricao, nivel, dataHora: new Date().toISOString() });
  localStorage.setItem(AUDIT_KEY, JSON.stringify(lista.slice(0, 500)));
}

export function getResumo() {
  const dados = safeParse(localStorage.getItem(STORAGE_KEY), []);
  const total = dados.length;
  const hectares = dados.reduce((s, i) => s + Number(i.hectares || 0), 0);
  const valorTotal = dados.reduce((s, i) => s + Number(i.valorTotal || 0), 0);
  const valorPago = dados.reduce((s, i) => s + Number(i.valorPago || 0), 0);
  const valorDevido = dados.reduce((s, i) => s + Number(i.valorDevido || 0), 0);
  const devendo = dados.filter((i) => Number(i.valorDevido || 0) > 0).length;
  const pagos = dados.filter((i) => i.statusPagamento === "PAGO").length;
  const lotes = dados.reduce((s, i) => s + Number(i.lotes || 0), 0);

  return { total, hectares, valorTotal, valorPago, valorDevido, devendo, pagos, lotes, atualizadoEm: new Date().toISOString() };
}

export function enviarResumoPainel() {
  localStorage.setItem(RESUMO_KEY, JSON.stringify(getResumo()));
  registrarAuditoria("EXPORTACAO", "Resumo de irrigação enviado para Painel");
}

export function exportarCSV() {
  const dados = safeParse(localStorage.getItem(STORAGE_KEY), []);
  const headers = ["empresaAgua", "mesReferencia", "fazenda", "talhaoNome", "hectares", "lotes", "valorTotal", "valorDevido", "statusPagamento"];
  const rows = dados.map((item) => headers.map((h) => `"${String(item[h] ?? "").replaceAll('"', '""')}"`).join(";"));
  const blob = new Blob([[headers.join(";"), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "irrigacao.csv"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

export function exportarJSON() {
  const blob = new Blob([JSON.stringify(safeParse(localStorage.getItem(STORAGE_KEY), []), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "irrigacao.json"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}