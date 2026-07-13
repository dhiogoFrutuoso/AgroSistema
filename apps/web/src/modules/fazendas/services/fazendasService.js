import { api } from "../../../services/api.js";

const STORAGE_KEY = "@arroz:fazendas";

function readLocal(fallback = []) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    window.dispatchEvent(new Event("storage"));
  } catch {
    // Mantem a tela funcionando mesmo se o storage falhar.
  }
}

function extractArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.farms)) return data.farms;
  if (Array.isArray(data?.fazendas)) return data.fazendas;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

export async function listarFazendasApiFirst() {
  const response = await api.get("/farms");

  if (response.ok) {
    const list = extractArray(response.data);
    writeLocal(list);

    return {
      ok: true,
      source: "api",
      data: list,
      error: null,
    };
  }

  return {
    ok: false,
    source: "localStorage",
    data: readLocal([]),
    error: response.error || "API indisponivel",
  };
}

export async function salvarFazendaApiFirst(fazenda) {
  const response = await api.post("/farms", fazenda);

  if (response.ok) {
    return {
      ok: true,
      source: "api",
      data: response.data || fazenda,
      error: null,
    };
  }

  return {
    ok: false,
    source: "localStorage",
    data: fazenda,
    error: response.error || "API indisponivel",
  };
}
