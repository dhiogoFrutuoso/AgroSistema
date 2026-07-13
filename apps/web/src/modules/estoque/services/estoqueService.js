import { api } from "../../../services/api.js";

const STORAGE_KEY = "@arroz:estoque";

function extractArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.inventory)) return data.inventory;
  if (Array.isArray(data?.estoque)) return data.estoque;
  if (Array.isArray(data?.produtos)) return data.produtos;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

export function getProdutos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveProdutos(produtos) {
  try {
    // Removemos imagens em Base64 do cache local para não estourar a memória (QuotaExceededError).
    const safeData = (produtos || []).map(item => ({ 
      ...item, 
      imagemProduto: item.imagemProduto ? "salvo-no-bd" : "" 
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.warn("Aviso: Limite de armazenamento local excedido no Estoque.");
  }
}

export async function getProdutosApiFirst() {
  const response = await api.get("/inventory");

  if (response.ok) {
    const produtos = extractArray(response.data).map(item => ({
      ...item,
      id: item._id || item.id
    }));
    saveProdutos(produtos);
    return produtos;
  }

  return getProdutos();
}

export function normalizeProduto(payload) {
  const qtd = Number(payload.quantidade || 0);
  const min = Number(payload.minimo || 0);
  const calcStatus = qtd <= 0 ? "ESGOTADO" : qtd <= min ? "BAIXO" : "DISPONÍVEL";

  return {
    nome: payload.nome || "",
    categoria: payload.categoria || "Geral",
    unidadeMedida: payload.unidadeMedida || "Unidades",
    quantidade: qtd,
    minimo: min,
    preco: Number(payload.preco || 0),
    lote: payload.lote || "",
    validade: payload.validade || "",
    fornecedor: payload.fornecedor || "",
    local: payload.local || "Depósito Principal",
    status: calcStatus,
    observacoes: payload.observacoes || "",
    imagemProduto: payload.imagemProduto || "",
    criadoEm: payload.criadoEm || new Date().toISOString(),
    atualizadoEm: new Date().toISOString()
  };
}

export async function createProdutoApiFirst(payload) {
  const novo = normalizeProduto(payload);

  const response = await api.post("/inventory", novo);
  
  if (!response.ok) {
    throw new Error(response.error || "Erro ao criar produto no banco de dados.");
  }

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  const produtos = getProdutos();
  saveProdutos([finalItem, ...produtos]);

  return finalItem;
}

export async function updateProdutoApiFirst(id, payload) {
  const updateData = normalizeProduto(payload);
  
  const response = await api.put(`/inventory/${id}`, updateData);

  if (!response.ok) {
    throw new Error(response.error || "Erro ao atualizar produto no banco de dados.");
  }

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  const produtos = getProdutos();
  const updated = produtos.map((item) => (String(item.id) === String(id) ? finalItem : item));
  
  saveProdutos(updated);

  return updated;
}

export async function deleteProdutoApiFirst(id) {
  const response = await api.delete(`/inventory/${id}`);

  if (!response.ok) {
    throw new Error(response.error || "Erro ao excluir produto do banco de dados.");
  }

  const produtos = getProdutos();
  const updated = produtos.filter((item) => String(item.id) !== String(id) && String(item._id) !== String(id));
  saveProdutos(updated);

  return updated;
}

export function getEstoqueResumo() {
  const produtos = getProdutos();

  const totalItens = produtos.length;

  const estoqueBaixo = produtos.filter(
    (item) => Number(item.quantidade) <= Number(item.minimo)
  ).length;

  const valorTotal = produtos.reduce(
    (acc, item) => acc + Number(item.quantidade || 0) * Number(item.preco || 0),
    0
  );

  return {
    totalItens,
    estoqueBaixo,
    valorTotal
  };
}