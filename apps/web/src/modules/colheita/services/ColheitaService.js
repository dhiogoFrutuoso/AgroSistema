import { api } from "../../../services/api.js";

const STORAGE_KEY = "@arroz:colheita";
const AUDIT_KEY = "@arroz:auditoria";
const FINANCEIRO_KEY = "@arroz:financeiro";
const RESUMO_KEY = "@arroz:colheita:resumo";

function safeParse(value, fallback = []) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

function uid(prefix = "colheita") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function saveDados(dados) {
  try {
    const safeData = (dados || []).map(item => ({ ...item, ticketBalanca: item.ticketBalanca ? "salvo-no-bd" : "" }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
  } catch (error) {
    console.warn("Aviso: Limite de armazenamento local excedido.");
  }
}

export async function getDadosApiFirst() {
  try {
    const response = await api.get("/harvests");
    if (response && response.ok) {
      const lista = response.data.map(item => ({ ...item, id: item._id || item.id }));
      saveDados(lista);
      return lista;
    }
  } catch (err) {
    console.warn("API inacessível. Usando cache local.");
  }
  return safeParse(localStorage.getItem(STORAGE_KEY), []);
}

function montarCalculos(payload) {
  const pesoLiquido = Math.max(0, Number(payload.pesoBruto || 0) - Number(payload.tara || 0));
  const produtividade = Number(payload.areaHa || 0) > 0 ? pesoLiquido / Number(payload.areaHa || 1) : 0;
  const custoTotal = Number(payload.custoMaoObra || 0) + Number(payload.custoMaquina || 0) + Number(payload.custoCombustivel || 0) + Number(payload.outrosCustos || 0);

  return { ...payload, pesoLiquido, produtividade, custoTotal };
}

export async function createRegistroApiFirst(payload) {
  const dados = await getDadosApiFirst();
  const calculados = montarCalculos(payload);

  const response = await api.post("/harvests", calculados);
  if (!response.ok) throw new Error(response.error || "Erro ao salvar no Banco de Dados.");

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  saveDados([finalItem, ...dados]);
  registrarAuditoria("CADASTRO", `Colheita: ${finalItem.fazenda} / ${finalItem.talhao}`);
  registrarFinanceiro(finalItem);

  return finalItem;
}

export async function updateRegistroApiFirst(id, payload) {
  const dados = await getDadosApiFirst();
  const calculados = montarCalculos(payload);

  const response = await api.put(`/harvests/${id}`, calculados);
  if (!response.ok) throw new Error(response.error || "Erro ao atualizar no Banco de Dados.");

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  const atualizados = dados.map((item) => (String(item.id) === String(id) ? finalItem : item));
  
  saveDados(atualizados);
  registrarAuditoria("EDICAO", `Colheita atualizada: ${finalItem.fazenda} / ${finalItem.talhao}`);

  return finalItem;
}

export async function deleteRegistroApiFirst(id) {
  const response = await api.delete(`/harvests/${id}`);
  if (!response.ok) throw new Error(response.error || "Erro ao excluir no Banco de Dados.");

  const dados = safeParse(localStorage.getItem(STORAGE_KEY), []);
  const atualizados = dados.filter((item) => String(item.id) !== String(id) && String(item._id) !== String(id));
  
  saveDados(atualizados);
  registrarAuditoria("EXCLUSAO", `Colheita excluída: ${id}`, "ALERTA");
  return true;
}

export function getResumo() {
  const dados = safeParse(localStorage.getItem(STORAGE_KEY), []);

  const total = dados.length;
  const area = dados.reduce((s, i) => s + Number(i.areaHa || 0), 0);
  const peso = dados.reduce((s, i) => s + Number(i.pesoLiquido || 0), 0);
  const custos = dados.reduce((s, i) => s + Number(i.custoTotal || 0), 0);
  const finalizadas = dados.filter((i) => i.status === "FINALIZADA").length;
  const andamento = dados.filter((i) => i.status === "EM_ANDAMENTO").length;
  const produtividadeMedia = area > 0 ? peso / area : 0;

  return { total, area, peso, custos, finalizadas, andamento, produtividadeMedia, atualizadoEm: new Date().toISOString() };
}

export function enviarResumoPainel() {
  const resumo = getResumo();
  localStorage.setItem(RESUMO_KEY, JSON.stringify(resumo));
  registrarAuditoria("EXPORTACAO", "Resumo de colheita enviado para Painel");
  return resumo;
}

export function registrarFinanceiro(registro) {
  const financeiro = safeParse(localStorage.getItem(FINANCEIRO_KEY), []);
  const custoTotal = Number(registro.custoTotal || 0);

  if (custoTotal <= 0) return;

  financeiro.unshift({
    id: uid("fin"),
    tipo: "DESPESA",
    modulo: "Colheita",
    descricao: `Custo Colheita - ${registro.cultura || "Arroz"} / ${registro.talhao || "Talhao"}`,
    valor: custoTotal,
    categoria: "Operacao Agricola",
    status: "PAGO",
    data: registro.dataInicio || new Date().toISOString().slice(0, 10),
    origemId: registro.id || registro._id,
    criadoEm: new Date().toISOString()
  });

  localStorage.setItem(FINANCEIRO_KEY, JSON.stringify(financeiro.slice(0, 800)));
}

export function registrarAuditoria(acao, descricao, nivel = "INFO") {
  const auditoria = safeParse(localStorage.getItem(AUDIT_KEY), []);
  const user = safeParse(localStorage.getItem("@arroz:user"), { nome: "Sistema" });

  auditoria.unshift({ id: uid("audit"), usuario: user.nome || "Sistema", modulo: "Colheita", acao, descricao, nivel, dataHora: new Date().toISOString() });
  localStorage.setItem(AUDIT_KEY, JSON.stringify(auditoria.slice(0, 500)));
}

// Funções de exportação
export function exportarJSON() {
  const blob = new Blob([JSON.stringify(safeParse(localStorage.getItem(STORAGE_KEY), []), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "colheita.json"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

export function exportarCSV() {
  const dados = safeParse(localStorage.getItem(STORAGE_KEY), []);
  const headers = ["safra", "fazenda", "talhao", "cultura", "areaHa", "operador", "maquina", "pesoBruto", "tara", "pesoLiquido", "produtividade", "custoTotal", "status"];
  const rows = dados.map((item) => headers.map((h) => `"${String(item[h] ?? "").replaceAll('"', '""')}"`).join(";"));
  const blob = new Blob([[headers.join(";"), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "colheita.csv"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}