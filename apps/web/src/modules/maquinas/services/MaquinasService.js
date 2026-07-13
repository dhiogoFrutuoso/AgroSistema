import { api } from "../../../services/api.js";

const STORAGE_KEY = "@arroz:maquinas";

function extractArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.machines)) return data.machines;
  if (Array.isArray(data?.maquinas)) return data.maquinas;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

export function getMaquinasLocal() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMaquinas(maquinas) {
  try {
    const safeData = (maquinas || []).map(item => ({ 
      ...item, 
      imagemMaquina: item.imagemMaquina ? "salvo-no-bd" : "" 
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.warn("Aviso: Limite de armazenamento local excedido.");
  }
}

export async function getMaquinas() {
  try {
    const response = await api.get("/machines");

    if (response && response.ok) {
      const lista = extractArray(response.data).map(item => ({
        ...item,
        id: item._id || item.id
      }));
      saveMaquinas(lista);
      return lista;
    }
  } catch (error) {
    console.warn("API de máquinas inacessível. Usando cache local.", error);
  }

  return getMaquinasLocal();
}

export async function createMaquina(maquina) {
  const response = await api.post("/machines", maquina);
  
  if (!response.ok) {
    throw new Error(response.error || "Erro ao cadastrar máquina no banco de dados.");
  }

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  const lista = await getMaquinasLocal();
  saveMaquinas([finalItem, ...lista]);
  return finalItem;
}

export async function updateMaquina(id, dados) {
  const response = await api.put(`/machines/${id}`, dados);

  if (!response.ok) {
    throw new Error(response.error || "Erro ao atualizar máquina no banco de dados.");
  }

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  const lista = await getMaquinasLocal();
  const atualizado = lista.map((item) => (String(item.id) === String(id) ? finalItem : item));
  
  saveMaquinas(atualizado);
  return atualizado;
}

export async function deleteMaquina(id) {
  const response = await api.delete(`/machines/${id}`);

  if (!response.ok) {
    throw new Error(response.error || "Erro ao excluir máquina no banco de dados.");
  }

  const atualizado = getMaquinasLocal().filter((item) => String(item.id) !== String(id) && String(item._id) !== String(id));
  saveMaquinas(atualizado);
  return atualizado;
}

export async function getIndicadores() {
  const maquinas = await getMaquinas();

  return {
    total: maquinas.length,
    operando: maquinas.filter((item) => item.status === "OPERANDO").length,
    manutencao: maquinas.filter((item) => item.status === "MANUTENCAO").length,
    parada: maquinas.filter((item) => item.status === "PARADA").length,
    disponivel: maquinas.filter((item) => item.status === "DISPONIVEL").length
  };
}