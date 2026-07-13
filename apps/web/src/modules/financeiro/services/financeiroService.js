import { api } from "../../../services/api.js";

const STORAGE_KEY = "@arroz:financeiro";

function extractArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.finance)) return data.finance;
  if (Array.isArray(data?.financeiro)) return data.financeiro;
  if (Array.isArray(data?.lancamentos)) return data.lancamentos;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

export function getLancamentos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLancamentos(data) {
  try {
    // Removemos os comprovantes (Base64) do cache local para não estourar a memória do navegador. 
    // O banco de dados guarda eles com segurança de qualquer forma.
    const safeData = (data || []).map(item => ({ 
      ...item, 
      comprovante: item.comprovante ? "salvo-no-bd" : "" 
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.warn("Aviso: Limite de armazenamento local excedido.");
  }
}

export async function getLancamentosApiFirst() {
  const response = await api.get("/finance");

  if (response.ok) {
    const lancamentos = extractArray(response.data).map(item => ({
      ...item,
      id: item._id || item.id
    }));
    saveLancamentos(lancamentos);
    return lancamentos;
  }

  return getLancamentos();
}

// Estrutura detalhada do Lançamento Financeiro
export function normalizeLancamento(payload) {
  return {
    tipo: payload.tipo || "DESPESA",
    descricao: payload.descricao || "",
    categoria: payload.categoria || "Geral",
    valor: Number(payload.valor || 0),
    dataLancamento: payload.dataLancamento || new Date().toISOString().slice(0, 10),
    dataVencimento: payload.dataVencimento || "",
    status: payload.status || "PENDENTE",
    formaPagamento: payload.formaPagamento || "Dinheiro",
    
    // Novos campos detalhados
    fornecedor: payload.fornecedor || "",
    centroCusto: payload.centroCusto || "Geral",
    contaBancaria: payload.contaBancaria || "Caixa Central",
    competencia: payload.competencia || new Date().toISOString().slice(0, 7),
    comprovante: payload.comprovante || "",
    
    // Vínculos
    fazenda: payload.fazenda || "",
    talhao: payload.talhao || "",
    responsavel: payload.responsavel || "",
    observacoes: payload.observacoes || "",
    
    criadoEm: payload.criadoEm || new Date().toISOString(),
    atualizadoEm: new Date().toISOString()
  };
}

export async function createLancamentoApiFirst(payload) {
  const novo = normalizeLancamento(payload);
  
  const response = await api.post("/finance", novo);

  if (!response.ok) {
    throw new Error(response.error || "Erro ao criar lançamento no banco de dados.");
  }

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  const items = getLancamentos();
  saveLancamentos([finalItem, ...items]);

  return finalItem;
}

export async function updateLancamentoApiFirst(id, payload) {
  const updateData = normalizeLancamento(payload);
  
  const response = await api.put(`/finance/${id}`, updateData);

  if (!response.ok) {
    throw new Error(response.error || "Erro ao atualizar lançamento no banco de dados.");
  }

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  const items = getLancamentos();
  const updated = items.map((item) => (String(item.id) === String(id) ? finalItem : item));
  
  saveLancamentos(updated);

  return updated;
}

export async function deleteLancamentoApiFirst(id) {
  const response = await api.delete(`/finance/${id}`);

  if (!response.ok) {
    throw new Error(response.error || "Erro ao excluir lançamento no banco de dados.");
  }

  const items = getLancamentos();
  const updated = items.filter((item) => String(item.id) !== String(id) && String(item._id) !== String(id));
  saveLancamentos(updated);

  return updated;
}

// Funções de Resumo e Dashboard
export function getReceitas() {
  return getLancamentos().filter((item) => item.tipo === "RECEITA");
}

export function getDespesas() {
  return getLancamentos().filter((item) => item.tipo === "DESPESA");
}

export function getReceitaTotal() {
  return getReceitas().reduce((acc, item) => acc + Number(item.valor || 0), 0);
}

export function getDespesaTotal() {
  return getDespesas().reduce((acc, item) => acc + Number(item.valor || 0), 0);
}

export function getSaldoAtual() {
  return getReceitaTotal() - getDespesaTotal();
}

export function getPendentes() {
  return getLancamentos().filter((item) => item.status === "PENDENTE");
}

export function getDashboardFinanceiro() {
  return {
    receitas: getReceitaTotal(),
    despesas: getDespesaTotal(),
    saldo: getSaldoAtual(),
    pendentes: getPendentes().length,
    totalLancamentos: getLancamentos().length
  };
}

export function exportFinanceiroJSON() {
  return JSON.stringify(getLancamentos(), null, 2);
}

export function exportFinanceiroCSV() {
  const rows = getLancamentos();

  const headers = [
    "id", "tipo", "descricao", "categoria", "valor", "dataLancamento", 
    "status", "fornecedor", "centroCusto", "contaBancaria", "fazenda"
  ];

  const csv = [
    headers.join(";"),
    ...rows.map((row) =>
      headers.map((h) => '"' + String(row[h] ?? "").replaceAll('"', '""') + '"').join(";")
    )
  ].join("\n");

  return csv;
}