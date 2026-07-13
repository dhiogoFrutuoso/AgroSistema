import { api } from "../../../services/api.js";

const STORAGE_KEY = "@arroz:plantio";
const FINANCEIRO_KEY = "@arroz:financeiro";
const AUDITORIA_KEY = "@arroz:auditoria";

function safeParse(value, fallback = []) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data || []));
  window.dispatchEvent(new Event("storage"));
}

function uid(prefix = "plt") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getPlantiosLocal() {
  return safeParse(localStorage.getItem(STORAGE_KEY), []);
}

export function savePlantios(data) {
  try {
    const safeData = (data || []).map(item => ({ ...item, anexo: item.anexo ? "salvo-no-bd" : "" }));
    write(STORAGE_KEY, safeData);
  } catch (error) {
    console.warn("Limite de memória excedido no navegador.");
  }
}

export async function getPlantiosApiFirst() {
  try {
    const response = await api.get("/plantings");
    if (response && response.ok) {
      const lista = response.data.map(item => ({ ...item, id: item._id || item.id }));
      savePlantios(lista);
      return lista;
    }
  } catch (err) {
    console.warn("API inacessível. Usando local.");
  }
  return getPlantiosLocal();
}

function calcularCustos(payload) {
  const sementes = Number(payload.sementes || 0);
  const insumos = Number(payload.insumos || 0);
  const custoMaquina = Number(payload.custoMaquina || 0);
  const maoObra = Number(payload.maoObra || 0);
  const outrosCustos = Number(payload.outrosCustos || 0);
  const custoTotal = sementes + insumos + custoMaquina + maoObra + outrosCustos;
  
  return { ...payload, sementes, insumos, custoMaquina, maoObra, outrosCustos, custoTotal };
}

export async function createPlantioApiFirst(payload) {
  const lista = await getPlantiosApiFirst();
  const registro = calcularCustos(payload);

  const response = await api.post("/plantings", registro);
  if (!response.ok) throw new Error(response.error || "Erro ao salvar no BD.");

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  savePlantios([finalItem, ...lista]);
  registrarAuditoria("CADASTRO", `Plantio criado: ${finalItem.fazenda} / ${finalItem.talhao}`);
  registrarFinanceiro(finalItem);

  return finalItem;
}

export async function updatePlantioApiFirst(id, payload) {
  const lista = await getPlantiosApiFirst();
  const registro = calcularCustos(payload);

  const response = await api.put(`/plantings/${id}`, registro);
  if (!response.ok) throw new Error(response.error || "Erro ao atualizar no BD.");

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  const atualizados = lista.map((item) => (String(item.id) === String(id) ? finalItem : item));
  
  savePlantios(atualizados);
  registrarAuditoria("EDICAO", `Plantio atualizado: ${finalItem.fazenda} / ${finalItem.talhao}`);
  return finalItem;
}

export async function deletePlantioApiFirst(id) {
  const response = await api.delete(`/plantings/${id}`);
  if (!response.ok) throw new Error(response.error || "Erro ao excluir no BD.");

  const lista = safeParse(localStorage.getItem(STORAGE_KEY), []);
  const atualizados = lista.filter((item) => String(item.id) !== String(id) && String(item._id) !== String(id));
  
  savePlantios(atualizados);
  registrarAuditoria("EXCLUSAO", `Plantio removido: ${id}`, "ALERTA");
  return true;
}

export async function getResumoPlantioApiFirst() {
  const plantios = await getPlantiosApiFirst();
  const areaTotal = plantios.reduce((acc, item) => acc + Number(item.area || 0), 0);
  const custoTotal = plantios.reduce((acc, item) => acc + Number(item.custoTotal || 0), 0);

  return {
    total: plantios.length,
    areaTotal,
    custoTotal,
    custoPorHa: areaTotal > 0 ? custoTotal / areaTotal : 0,
    planejados: plantios.filter((item) => item.status === "PLANEJADO").length,
    andamento: plantios.filter((item) => item.status === "EM_ANDAMENTO").length,
    concluidos: plantios.filter((item) => item.status === "CONCLUIDO").length
  };
}

function registrarFinanceiro(plantio) {
  const valor = Number(plantio.custoTotal || 0);
  if (valor <= 0) return;

  const financeiro = safeParse(localStorage.getItem(FINANCEIRO_KEY), []);
  financeiro.unshift({
    id: uid("fin"),
    tipo: "DESPESA",
    modulo: "Plantio",
    descricao: `Custo Plantio - ${plantio.cultura || "Arroz"} - ${plantio.talhao || "Talhão"}`,
    valor,
    categoria: "Plantio",
    status: "PAGO",
    dataLancamento: plantio.dataInicio || new Date().toISOString().slice(0, 10),
    origemId: plantio.id || plantio._id,
    criadoEm: new Date().toISOString()
  });

  localStorage.setItem(FINANCEIRO_KEY, JSON.stringify(financeiro.slice(0, 800)));
}

function registrarAuditoria(acao, descricao, nivel = "INFO") {
  const auditoria = safeParse(localStorage.getItem(AUDITORIA_KEY), []);
  const user = safeParse(localStorage.getItem("@arroz:user"), { nome: "Sistema" });

  auditoria.unshift({ id: uid("audit"), usuario: user.nome || "Sistema", modulo: "Plantio", acao, descricao, nivel, dataHora: new Date().toISOString() });
  localStorage.setItem(AUDITORIA_KEY, JSON.stringify(auditoria.slice(0, 500)));
}