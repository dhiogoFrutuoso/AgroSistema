import { api } from "../../../services/api.js";

const TALHOES_KEY = "@arroz:talhoes";
const GPS_KEY = "@arroz:gps:areas";
const REL_KEY = "@arroz:talhoes:relatorios";
const AUDIT_KEY = "@arroz:auditoria";

export function parseStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value || []));
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.warn("Aviso: Limite de armazenamento local excedido. O cache offline não foi atualizado.");
  }
}

function extractArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.plots)) return data.plots;
  if (Array.isArray(data?.talhoes)) return data.talhoes;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

export function uid(prefix = "talhao") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function audit(acao, descricao, nivel = "INFO") {
  const user = parseStorage("@arroz:user", {});
  const lista = parseStorage(AUDIT_KEY, []);
  lista.unshift({
    id: uid("audit"),
    usuario: user.nome || user.name || user.usuario || user.username || "Sistema",
    modulo: "Talhões",
    acao,
    descricao,
    nivel,
    dataHora: new Date().toISOString()
  });
  writeStorage(AUDIT_KEY, lista.slice(0, 800));
}

export function getGpsAreas() {
  return parseStorage(GPS_KEY, []);
}

export function getTalhoesRaw() {
  return parseStorage(TALHOES_KEY, []);
}

export function saveTalhoes(lista) {
  // Remove a imagem gigante em Base64 antes de salvar no localStorage para evitar QuotaExceededError
  const safeData = (lista || []).map(item => ({ ...item, imagemMapa: "" }));
  writeStorage(TALHOES_KEY, safeData);
}

export function sincronizarGpsComTalhoes() {
  const gps = getGpsAreas();
  const talhoes = getTalhoesRaw();

  const existentes = new Set(talhoes.map((t) => String(t.gpsAreaId || t.id || t._id)));

  const novos = gps
    .filter((g) => !existentes.has(String(g.id)))
    .map((g) => ({
      ...g,
      gpsAreaId: g.id,
      nome: g.nome || "Talhão GPS",
      fazenda: g.fazenda || "",
      cultura: g.cultura || "Arroz",
      safra: g.safra || "",
      areaHa: Number(g.areaHa || 0),
      perimetroM: Number(g.perimetroM || 0),
      coordenadas: g.coordenadas || [],
      centro: g.centro || null,
      imagemMapa: g.imagemMapa || "",
      origem: "GPS",
      status: "ATIVO"
    }));

  if (novos.length > 0) {
    novos.forEach(async (novoItem) => {
      await api.post("/plots", novoItem);
    });
    audit("IMPORTAÇÃO", `${novos.length} talhões importados automaticamente do GPS`);
  }
}

export async function getDados() {
  sincronizarGpsComTalhoes();
  const response = await api.get("/plots");

  if (response.ok) {
    const dados = extractArray(response.data).map(item => ({
      ...item,
      id: item._id || item.id
    }));
    saveTalhoes(dados);
    return dados;
  }
  return getTalhoesRaw();
}

export function getRelatorios() {
  return parseStorage(REL_KEY, []);
}

export function saveRelatorios(lista) {
  writeStorage(REL_KEY, lista || []);
}

export async function createRegistro(payload) {
  const item = {
    nome: payload.nome || "Talhão Manual",
    fazenda: payload.fazenda || "",
    cultura: payload.cultura || "Arroz",
    safra: payload.safra || "",
    areaHa: Number(payload.areaHa || 0),
    perimetroM: Number(payload.perimetroM || 0),
    imagemMapa: payload.imagemMapa || "",
    origem: payload.origem || "MANUAL",
    status: payload.status || "ATIVO",
    observacoes: payload.observacoes || ""
  };

  const response = await api.post("/plots", item);
  
  if (response.ok) {
    audit("CADASTRO", `Talhão cadastrado: ${item.nome}`);
    return { ...response.data, id: response.data._id || response.data.id };
  } else {
    throw new Error(response.error || "Erro ao criar talhão na API.");
  }
}

export async function updateRegistro(id, payload) {
  const response = await api.put(`/plots/${id}`, {
    ...payload,
    areaHa: Number(payload.areaHa || 0),
    perimetroM: Number(payload.perimetroM || 0)
  });

  if (response.ok) {
    audit("EDIÇÃO", `Talhão atualizado: ${payload.nome || id}`);
    return { ...response.data, id: response.data._id || response.data.id };
  } else {
    throw new Error(response.error || "Erro ao atualizar talhão na API.");
  }
}

export async function deleteRegistro(id) {
  const response = await api.delete(`/plots/${id}`);
  
  if (response.ok) {
    const talhoes = getTalhoesRaw();
    const talhoesAtualizados = talhoes.filter((i) => String(i.id) !== String(id) && String(i._id) !== String(id));
    saveTalhoes(talhoesAtualizados);
    audit("EXCLUSÃO", `Talhão excluído ID: ${id}`, "ALERTA");
    return true;
  } else {
    throw new Error(response.error || "Erro ao excluir talhão na API.");
  }
}

export function createRelatorio(talhaoId, payload) {
  const relatorios = getRelatorios();
  const indexExistente = relatorios.findIndex(r => r.talhaoId === talhaoId);

  const relatorio = {
    id: indexExistente >= 0 ? relatorios[indexExistente].id : uid("rel"),
    talhaoId,
    responsavel: payload.responsavel || "",
    solo: payload.solo || "",
    topografia: payload.topografia || "",
    irrigacao: payload.irrigacao || "",
    manejo: payload.manejo || "",
    riscos: payload.riscos || "",
    recomendacoes: payload.recomendacoes || "",
    observacoes: payload.observacoes || "",
    criadoEm: indexExistente >= 0 ? relatorios[indexExistente].criadoEm : new Date().toISOString()
  };

  if (indexExistente >= 0) {
    relatorios[indexExistente] = relatorio;
  } else {
    relatorios.unshift(relatorio);
  }

  saveRelatorios(relatorios);
  audit(indexExistente >= 0 ? "EDIÇÃO" : "CADASTRO", `Relatório técnico ${indexExistente >= 0 ? 'atualizado' : 'criado'} para talhão ${talhaoId}`);
  return relatorio;
}

export function getResumo() {
  const dados = getTalhoesRaw();
  const total = dados.length;
  const areaTotal = dados.reduce((s, i) => s + Number(i.areaHa || 0), 0);
  const perimetroTotal = dados.reduce((s, i) => s + Number(i.perimetroM || 0), 0);
  const comImagem = dados.filter((i) => i.imagemMapa).length;
  const gps = dados.filter((i) => i.origem === "GPS" || i.gpsAreaId).length;
  const ativos = dados.filter((i) => String(i.status || "ATIVO").toUpperCase() === "ATIVO").length;

  return {
    total,
    areaTotal,
    perimetroTotal,
    comImagem,
    gps,
    ativos,
    atualizadoEm: new Date().toISOString()
  };
}

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

export function exportarCSV() {
  const dados = getTalhoesRaw();
  const headers = ["nome", "fazenda", "cultura", "safra", "areaHa", "perimetroM", "origem", "status"];
  const rows = dados.map((item) =>
    headers.map((h) => `"${String(item[h] ?? "").replaceAll('"','""')}"`).join(";")
  );

  baixarArquivo("talhoes.csv", [headers.join(";"), ...rows].join("\n"), "text/csv;charset=utf-8;");
  audit("EXPORTAÇÃO", "CSV de talhões exportado");
}

export function exportarJSON() {
  baixarArquivo("talhoes.json", JSON.stringify(getTalhoesRaw(), null, 2), "application/json");
  audit("EXPORTAÇÃO", "JSON de talhões exportado");
}