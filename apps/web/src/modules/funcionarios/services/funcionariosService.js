import jsPDF from "jspdf";
import { api } from "../../../services/api.js";

const FUNC_KEY = "@arroz:funcionarios";
const AUDIT_KEY = "@arroz:auditoria";

export const DEFAULT_PERMISSOES = {
  painel: true, funcionarios: false, fazendas: true, talhoes: true, mapas: true,
  financeiro: false, estoque: true, maquinas: true, plantio: true, colheita: true,
  irrigacao: true, documentos: true, relatorios: false, auditoria: false, configuracoes: false
};

export const FULL_PERMISSOES = Object.keys(DEFAULT_PERMISSOES).reduce((acc, key) => {
  acc[key] = true;
  return acc;
}, {});

export const MODULOS = [
  ["painel", "Painel"], ["funcionarios", "Funcionarios"], ["fazendas", "Fazendas"],
  ["talhoes", "Talhoes"], ["mapas", "Mapas/GPS"], ["financeiro", "Financeiro"],
  ["estoque", "Estoque"], ["maquinas", "Maquinas"], ["plantio", "Plantio"],
  ["colheita", "Colheita"], ["irrigacao", "Irrigacao"], ["documentos", "Documentos"],
  ["relatorios", "Relatorios"], ["auditoria", "Auditoria"], ["configuracoes", "Configuracoes"]
];

export function parseStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function uid(prefix = "func") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function normalizeUsuario(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
}

export function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

export async function checkIsAdmin() {
  try {
    const userData = localStorage.getItem("@arroz:user");
    if (!userData) return false;

    const user = JSON.parse(userData);
    const tipo = String(user.tipo || user.role || user.perfil || "").toUpperCase();
    const status = String(user.status || "ATIVO").toUpperCase();

    return (tipo === "ADMIN" || tipo === "ADMINISTRADOR") && status !== "BLOQUEADO";
  } catch (error) {
    return false;
  }
}

export function audit(acao, descricao, nivel = "INFO") {
  const lista = parseStorage(AUDIT_KEY, []);
  lista.unshift({
    id: uid("audit"),
    usuario: "Sistema",
    modulo: "Funcionarios",
    acao,
    descricao,
    nivel,
    dataHora: new Date().toISOString()
  });
  localStorage.setItem(AUDIT_KEY, JSON.stringify(lista.slice(0, 900)));
}

export function getFuncionarios() {
  const lista = parseStorage(FUNC_KEY, []);
  return lista.map((f) => ({
    ...f,
    permissoes: { ...DEFAULT_PERMISSOES, ...(f.permissoes || {}) }
  }));
}

export function saveFuncionarios(lista) {
  localStorage.setItem(FUNC_KEY, JSON.stringify(lista || []));
  return lista || [];
}

export function normalizeFuncionarioApi(item = {}) {
  return {
    id: item.id || uid("func"),
    nome: item.nome || item.name || "",
    cpf: item.cpf || "",
    rg: item.rg || "",
    dataNascimento: item.dataNascimento || item.data_nascimento || "",
    telefone: item.telefone || item.phone || "",
    email: item.email || "",
    endereco: item.endereco || item.address || "",
    cidade: item.cidade || item.city || "",
    estado: item.estado || item.state || "",
    cargo: item.cargo || item.role || "",
    salario: Number(item.salario || item.salary || 0),
    dataAdmissao: item.dataAdmissao || item.data_admissao || "",
    usuario: normalizeUsuario(item.usuario || item.username || item.login || ""),
    senha: item.senha || item.password || "",
    foto: item.foto || item.photo || "",
    perfil: item.perfil || item.role || "OPERADOR",
    tipo: item.tipo || "FUNCIONARIO",
    status: item.status || "ATIVO",
    acessoLiberado: item.acessoLiberado ?? item.acesso_liberado ?? item.status !== "BLOQUEADO",
    permissoes: { ...DEFAULT_PERMISSOES, ...(item.permissoes || item.permissions || {}) },
    ultimoLogin: item.ultimoLogin || item.ultimo_login || "",
    criadoEm: item.criadoEm || item.created_at || new Date().toISOString(),
    atualizadoEm: item.atualizadoEm || item.updated_at || new Date().toISOString()
  };
}

export async function syncFuncionariosFromBackend() {
  const response = await api.get("/employees");

  if (!response.ok) {
    return { success: false, source: "localStorage", funcionarios: getFuncionarios() };
  }

  const raw = Array.isArray(response.data)
    ? response.data
    : response.data?.employees || response.data?.funcionarios || response.data?.data || [];

  const funcionarios = raw.map(normalizeFuncionarioApi);
  saveFuncionarios(funcionarios);

  return { success: true, source: "backend", funcionarios };
}

export async function createFuncionarioBackend(payload) {
  const response = await api.post("/employees", payload);

  if (!response.ok) {
    return {
      success: false,
      source: "localStorage",
      error: response.error
    };
  }

  return {
    success: true,
    source: "backend",
    data: normalizeFuncionarioApi(response.data?.employee || response.data?.funcionario || response.data)
  };
}

export function validateFuncionario(payload, ignoreId = null) {
  const funcionarios = getFuncionarios();
  const usuario = normalizeUsuario(payload.usuario);
  const cpf = onlyDigits(payload.cpf);

  if (!String(payload.nome || "").trim()) throw new Error("Informe o nome completo.");
  if (!usuario) throw new Error("Informe o usuario.");
  if (!String(payload.senha || "").trim() && !ignoreId) throw new Error("Informe a senha.");
  if (usuario === "admin") throw new Error("O usuario admin e reservado ao dono do sistema.");

  const usuarioExiste = funcionarios.some((f) => String(f.id) !== String(ignoreId) && normalizeUsuario(f.usuario) === usuario);
  if (usuarioExiste) throw new Error("Usuario ja cadastrado.");

  if (cpf) {
    const cpfExiste = funcionarios.some((f) => String(f.id) !== String(ignoreId) && onlyDigits(f.cpf) === cpf);
    if (cpfExiste) throw new Error("CPF ja cadastrado.");
  }

  return true;
}

export function createFuncionario(payload) {
  validateFuncionario(payload);
  const funcionarios = getFuncionarios();
  const isAdmin = String(payload.perfil || "").toUpperCase() === "ADMIN";

  const item = {
    id: uid("func"),
    nome: String(payload.nome || "").trim(),
    cpf: onlyDigits(payload.cpf),
    rg: payload.rg || "",
    dataNascimento: payload.dataNascimento || "",
    telefone: payload.telefone || "",
    email: payload.email || "",
    endereco: payload.endereco || "",
    cidade: payload.cidade || "",
    estado: payload.estado || "",
    cargo: payload.cargo || "",
    salario: Number(payload.salario || 0),
    dataAdmissao: payload.dataAdmissao || new Date().toISOString().slice(0, 10),
    usuario: normalizeUsuario(payload.usuario),
    senha: String(payload.senha || "").trim(),
    foto: payload.foto || "",
    perfil: payload.perfil || "OPERADOR",
    tipo: "FUNCIONARIO",
    status: payload.status || "ATIVO",
    acessoLiberado: payload.status !== "BLOQUEADO",
    permissoes: isAdmin ? { ...FULL_PERMISSOES } : { ...DEFAULT_PERMISSOES, ...(payload.permissoes || {}) },
    ultimoLogin: payload.ultimoLogin || "",
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString()
  };

  saveFuncionarios([item, ...funcionarios]);
  audit("CADASTRO", `Funcionario criado: ${item.nome}`);
  return item;
}

export function updateFuncionario(id, payload) {
  validateFuncionario(payload, id);
  const funcionarios = getFuncionarios();
  let atualizado = null;

  const lista = funcionarios.map((f) => {
    if (String(f.id) !== String(id)) return f;

    const isAdmin = String(payload.perfil || f.perfil || "").toUpperCase() === "ADMIN";

    atualizado = {
      ...f,
      ...payload,
      cpf: onlyDigits(payload.cpf),
      salario: Number(payload.salario || 0),
      usuario: normalizeUsuario(payload.usuario),
      permissoes: isAdmin ? { ...FULL_PERMISSOES } : { ...DEFAULT_PERMISSOES, ...(payload.permissoes || f.permissoes || {}) },
      acessoLiberado: payload.status !== "BLOQUEADO",
      atualizadoEm: new Date().toISOString()
    };
    return atualizado;
  });

  saveFuncionarios(lista);
  audit("EDICAO", `Funcionario editado: ${atualizado?.nome || id}`);
  return atualizado;
}

export function deleteFuncionario(id) {
  const funcionarios = getFuncionarios();
  const alvo = funcionarios.find((f) => String(f.id) === String(id));
  const lista = funcionarios.filter((f) => String(f.id) !== String(id));
  saveFuncionarios(lista);
  audit("EXCLUSAO", `Funcionario excluido: ${alvo?.nome || id}`, "ALERTA");
  return lista;
}

export function bloquearFuncionario(id) {
  const lista = getFuncionarios().map((f) =>
    String(f.id) === String(id)
      ? { ...f, status: "BLOQUEADO", acessoLiberado: false, atualizadoEm: new Date().toISOString() }
      : f
  );
  saveFuncionarios(lista);
  audit("BLOQUEIO", `Funcionario bloqueado: ${id}`, "ALERTA");
  return lista;
}

export function liberarFuncionario(id) {
  const lista = getFuncionarios().map((f) =>
    String(f.id) === String(id)
      ? { ...f, status: "ATIVO", acessoLiberado: true, atualizadoEm: new Date().toISOString() }
      : f
  );
  saveFuncionarios(lista);
  audit("LIBERACAO", `Funcionario liberado: ${id}`);
  return lista;
}

export function resetSenha(id, novaSenha = "123456") {
  const lista = getFuncionarios().map((f) =>
    String(f.id) === String(id)
      ? { ...f, senha: novaSenha, atualizadoEm: new Date().toISOString() }
      : f
  );
  saveFuncionarios(lista);
  audit("RESET_SENHA", `Senha resetada para funcionario: ${id}`, "ALERTA");
  return lista;
}

export function getResumoFuncionarios() {
  const lista = getFuncionarios();
  return {
    total: lista.length,
    ativos: lista.filter((f) => f.status === "ATIVO").length,
    bloqueados: lista.filter((f) => f.status === "BLOQUEADO").length,
    admins: lista.filter((f) => String(f.perfil || "").toUpperCase() === "ADMIN").length,
    operadores: lista.filter((f) => String(f.perfil || "").toUpperCase() !== "ADMIN").length
  };
}

export function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportCSV() {
  const lista = getFuncionarios();
  const headers = ["nome", "cpf", "usuario", "cargo", "telefone", "email", "status", "perfil", "criadoEm"];
  const rows = lista.map((f) => headers.map((h) => `"${String(f[h] ?? "").replaceAll('"', '""')}"`).join(";"));
  downloadFile("funcionarios.csv", [headers.join(";"), ...rows].join("\n"), "text/csv;charset=utf-8;");
  audit("EXPORTACAO", "CSV de funcionarios exportado");
}

export function exportJSON() {
  downloadFile("funcionarios.json", JSON.stringify(getFuncionarios(), null, 2), "application/json");
  audit("EXPORTACAO", "JSON de funcionarios exportado");
}

export function exportPDF() {
  const lista = getFuncionarios();
  const resumo = getResumoFuncionarios();
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("ARROZ DOS FERREIRAS - Funcionarios", 14, 18);
  doc.setFontSize(10);
  doc.text(`Total: ${resumo.total} | Ativos: ${resumo.ativos} | Bloqueados: ${resumo.bloqueados}`, 14, 28);

  let y = 42;
  lista.forEach((f, i) => {
    if (y > 280) {
      doc.addPage();
      y = 18;
    }
    doc.text(`${i + 1}. ${f.nome} | Usuario: ${f.usuario} | Cargo: ${f.cargo || "-"} | Status: ${f.status}`, 14, y);
    y += 7;
  });

  doc.save("funcionarios.pdf");
  audit("EXPORTACAO", "PDF de funcionarios exportado");
}