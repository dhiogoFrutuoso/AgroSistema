import { api } from "../../../services/api.js";

const STORAGE_KEY = "@arroz:operador";
const RESUMO_KEY = "@arroz:operador:resumo";
const AUDIT_KEY = "@arroz:auditoria";

export const STATUS = ["ABERTO", "ASSINADO", "PAGO", "PENDENTE", "CANCELADO"];
export const TIPOS_FINANCEIRO = ["RECEITA", "DESPESA"];

export function parse(value, fallback = []) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

export function uid(prefix = "op") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getUsuario() {
  const user = parse(localStorage.getItem("@arroz:user"), {});
  return user.nome || user.name || user.usuario || user.username || "Sistema";
}

export function calcularHoras(inicio, fim) {
  if (!inicio || !fim) return 0;
  const [hi, mi] = String(inicio).split(":").map(Number);
  const [hf, mf] = String(fim).split(":").map(Number);
  if ([hi, mi, hf, mf].some((v) => Number.isNaN(v))) return 0;

  let inicioMin = hi * 60 + mi;
  let fimMin = hf * 60 + mf;
  if (fimMin < inicioMin) fimMin += 24 * 60;

  return Math.max(0, (fimMin - inicioMin) / 60);
}

export function calcularLinha(linha) {
  const horasTrabalhadas = calcularHoras(linha.horaInicio, linha.horaFim);
  const valorHorario = Number(linha.valorHorario || 0);
  const litrosOleo = Number(linha.litrosOleo || 0);
  const valorLitroOleo = Number(linha.valorLitroOleo || 0);
  const outrosGastos = Number(linha.outrosGastos || 0);

  const valorTotal = horasTrabalhadas * valorHorario;
  const gastoOleo = litrosOleo * valorLitroOleo;
  const custoTotal = gastoOleo + outrosGastos;
  const lucroLiquido = valorTotal - custoTotal;

  return {
    ...linha,
    horasTrabalhadas,
    valorHorario,
    valorTotal,
    litrosOleo,
    valorLitroOleo,
    gastoOleo,
    outrosGastos,
    custoTotal,
    lucroLiquido
  };
}

export function saveDados(linhas) {
  try {
    const safeData = (linhas || []).map(item => ({ ...item, assinaturaCliente: item.assinaturaCliente ? "salvo-no-bd" : "" }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
  } catch (error) {
    console.warn("Limite local excedido.");
  }
}

export async function getDados() {
  try {
    const response = await api.get("/operators");
    if (response && response.ok) {
      const lista = response.data.map(item => ({ ...item, id: item._id || item.id }));
      saveDados(lista);
      return lista;
    }
  } catch (err) {
    console.warn("API de operadores indisponível. Usando local.");
  }
  return parse(localStorage.getItem(STORAGE_KEY), []);
}

export async function createOperador(payload) {
  const dadosProntos = calcularLinha(payload);
  const response = await api.post("/operators", dadosProntos);
  
  if (!response.ok) throw new Error(response.error || "Erro ao criar registro de operador no BD.");

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  audit("CADASTRO", `Serviço criado para ${finalItem.cliente}`);
  return finalItem;
}

export async function updateOperador(id, payload) {
  const dadosProntos = calcularLinha(payload);
  const response = await api.put(`/operators/${id}`, dadosProntos);
  
  if (!response.ok) throw new Error(response.error || "Erro ao atualizar registro no BD.");

  audit("EDICAO", `Serviço atualizado: ${payload.cliente}`);
  return response.data;
}

export async function deleteOperador(id) {
  const response = await api.delete(`/operators/${id}`);
  if (!response.ok) throw new Error(response.error || "Erro ao excluir registro no BD.");
  audit("EXCLUSAO", `Serviço de operador excluído: ${id}`);
  return true;
}

export function audit(acao, descricao, nivel = "INFO") {
  const lista = parse(localStorage.getItem(AUDIT_KEY), []);
  lista.unshift({ id: uid("audit"), usuario: getUsuario(), modulo: "Operador", acao, descricao, nivel, dataHora: new Date().toISOString() });
  localStorage.setItem(AUDIT_KEY, JSON.stringify(lista.slice(0, 1000)));
}

export function getResumo(linhas = []) {
  const dados = linhas || [];
  const clientes = new Set(dados.filter((i) => i.cliente).map((i) => i.cliente));
  const maquinas = new Set(dados.filter((i) => i.maquinaAgricola).map((i) => i.maquinaAgricola));

  return {
    totalRegistros: dados.length,
    totalHoras: dados.reduce((s, i) => s + Number(i.horasTrabalhadas || 0), 0),
    totalBruto: dados.reduce((s, i) => s + Number(i.valorTotal || 0), 0),
    gastoOleo: dados.reduce((s, i) => s + Number(i.gastoOleo || 0), 0),
    custoTotal: dados.reduce((s, i) => s + Number(i.custoTotal || 0), 0),
    lucroLiquido: dados.reduce((s, i) => s + Number(i.lucroLiquido || 0), 0),
    clientesAtendidos: clientes.size,
    maquinasUsadas: maquinas.size,
    assinados: dados.filter((i) => i.status === "ASSINADO" || i.assinaturaCliente).length,
    pendentes: dados.filter((i) => i.status === "PENDENTE" || i.status === "ABERTO").length,
  };
}

export function money(v) { return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
export function num(v, d = 2) { return Number(v || 0).toLocaleString("pt-BR", { maximumFractionDigits: d }); }
export function agrupar(linhas, chave, campo) {
  const grupos = {};
  (linhas || []).forEach((item) => {
    const nome = item[chave] || "Sem nome";
    grupos[nome] = (grupos[nome] || 0) + Number(item[campo] || 0);
  });
  return Object.entries(grupos).map(([nome, valor]) => ({ nome, valor })).sort((a, b) => b.valor - a.valor).slice(0, 8);
}

// Funções de exportação foram resumidas para poupar espaço, mantenha as do seu arquivo antigo aqui em baixo.
export function exportarJSON(linhas) {
  const blob = new Blob([JSON.stringify(linhas || [], null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "operadores.json"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
export function exportarCSV(linhas) {
  const headers = ["data","nomeOperador","maquinaAgricola","cliente","servico","horasTrabalhadas","valorTotal","custoTotal","lucroLiquido","status"];
  const rows = (linhas || []).map((item) => headers.map((h) => `"${String(item[h] ?? "").replaceAll('"', '""')}"`).join(";"));
  const blob = new Blob([[headers.join(";"), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "operadores.csv"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
export function enviarResumoPainel(linhas) { localStorage.setItem(RESUMO_KEY, JSON.stringify(getResumo(linhas))); }
export function backupOperador(linhas) { exportarJSON(linhas); }