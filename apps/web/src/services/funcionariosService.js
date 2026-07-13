import { api } from "./api.js";

const FUNCIONARIOS_KEY = "@arroz:funcionarios";

function readLocalFuncionarios() {
  try {
    return JSON.parse(localStorage.getItem(FUNCIONARIOS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalFuncionarios(funcionarios) {
  localStorage.setItem(FUNCIONARIOS_KEY, JSON.stringify(funcionarios));
}

function normalizeFuncionario(item) {
  return {
    id: item?.id || crypto.randomUUID(),
    nome: item?.nome || item?.name || "",
    usuario: item?.usuario || item?.username || item?.login || "",
    senha: item?.senha || item?.password || "",
    email: item?.email || "",
    telefone: item?.telefone || item?.phone || "",
    cargo: item?.cargo || item?.role || "FUNCIONARIO",
    perfil: item?.perfil || item?.role || "FUNCIONARIO",
    status: item?.status || "ATIVO",
    permissoes: item?.permissoes || item?.permissions || [],
    criadoEm: item?.criadoEm || item?.created_at || new Date().toISOString(),
  };
}

export async function getFuncionarios() {
  const response = await api.get("/employees");

  if (response.ok && Array.isArray(response.data)) {
    const funcionarios = response.data.map(normalizeFuncionario);
    saveLocalFuncionarios(funcionarios);
    return funcionarios;
  }

  if (response.ok && Array.isArray(response.data?.employees)) {
    const funcionarios = response.data.employees.map(normalizeFuncionario);
    saveLocalFuncionarios(funcionarios);
    return funcionarios;
  }

  return readLocalFuncionarios();
}

export async function createFuncionario(payload) {
  const funcionario = normalizeFuncionario(payload);

  const response = await api.post("/employees", funcionario);

  if (response.ok) {
    const saved = normalizeFuncionario(response.data?.employee || response.data || funcionario);

    const locais = readLocalFuncionarios();
    const atualizados = [saved, ...locais.filter((item) => item.id !== saved.id)];
    saveLocalFuncionarios(atualizados);

    return {
      success: true,
      source: "backend",
      data: saved,
    };
  }

  const locais = readLocalFuncionarios();
  const atualizados = [funcionario, ...locais.filter((item) => item.id !== funcionario.id)];
  saveLocalFuncionarios(atualizados);

  return {
    success: true,
    source: "localStorage",
    data: funcionario,
  };
}

export async function updateFuncionario(id, payload) {
  const funcionario = normalizeFuncionario({ ...payload, id });

  const locais = readLocalFuncionarios();
  const atualizados = locais.map((item) =>
    String(item.id) === String(id) ? funcionario : item
  );

  saveLocalFuncionarios(atualizados);

  return {
    success: true,
    data: funcionario,
  };
}

export async function deleteFuncionario(id) {
  const locais = readLocalFuncionarios();
  const atualizados = locais.filter((item) => String(item.id) !== String(id));

  saveLocalFuncionarios(atualizados);

  return {
    success: true,
  };
}

export function getFuncionariosLocal() {
  return readLocalFuncionarios();
}
