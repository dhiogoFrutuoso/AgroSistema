const ABASTECIMENTOS_KEY = "@arroz:maquinas:abastecimentos";
const FINANCEIRO_KEY = "@arroz:financeiro";
const AUDITORIA_KEY = "@arroz:auditoria";

function read(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function id() {
  return crypto.randomUUID?.() || String(Date.now());
}

export function getAbastecimentos() {
  return read(ABASTECIMENTOS_KEY);
}

export function createAbastecimento(payload) {
  const lista = read(ABASTECIMENTOS_KEY);

  const registro = {
    id: id(),
    maquinaId: payload.maquinaId || "",
    maquinaNome: payload.maquinaNome || "",
    data: payload.data || new Date().toISOString().slice(0, 10),
    combustivel: payload.combustivel || "Diesel",
    litros: Number(payload.litros || 0),
    valorLitro: Number(payload.valorLitro || 0),
    valorTotal: Number(payload.valorTotal || 0),
    posto: payload.posto || "",
    responsavel: payload.responsavel || "",
    horimetro: Number(payload.horimetro || 0),
    observacoes: payload.observacoes || "",
    criadoEm: new Date().toISOString()
  };

  write(ABASTECIMENTOS_KEY, [registro, ...lista]);

  registrarAuditoria("ABASTECIMENTO", "Abastecimento registrado: " + registro.maquinaNome);

  if (registro.valorTotal > 0) {
    registrarFinanceiro(registro);
  }

  return registro;
}

export function deleteAbastecimento(idRegistro) {
  const updated = read(ABASTECIMENTOS_KEY).filter(item => item.id !== idRegistro);
  write(ABASTECIMENTOS_KEY, updated);
  registrarAuditoria("EXCLUSAO", "Abastecimento removido");
  return updated;
}

function registrarFinanceiro(abastecimento) {
  const financeiro = read(FINANCEIRO_KEY);

  const lancamento = {
    id: id(),
    tipo: "DESPESA",
    descricao: "Abastecimento - " + abastecimento.maquinaNome,
    categoria: "Combustivel",
    valor: Number(abastecimento.valorTotal || 0),
    dataLancamento: abastecimento.data,
    dataVencimento: abastecimento.data,
    status: "PENDENTE",
    formaPagamento: "",
    fazenda: "",
    talhao: "",
    responsavel: abastecimento.responsavel || "",
    observacoes: abastecimento.observacoes || "",
    criadoEm: new Date().toISOString()
  };

  write(FINANCEIRO_KEY, [lancamento, ...financeiro]);
}

function registrarAuditoria(acao, descricao) {
  const auditoria = read(AUDITORIA_KEY);

  const registro = {
    id: id(),
    usuario: "Sistema",
    modulo: "Maquinas",
    acao,
    descricao,
    nivel: "INFO",
    dataHora: new Date().toISOString()
  };

  write(AUDITORIA_KEY, [registro, ...auditoria]);
}

export function getResumoAbastecimentos() {
  const dados = read(ABASTECIMENTOS_KEY);

  const litros = dados.reduce((acc, item) => acc + Number(item.litros || 0), 0);
  const custoTotal = dados.reduce((acc, item) => acc + Number(item.valorTotal || 0), 0);

  return {
    total: dados.length,
    litros,
    custoTotal,
    mediaLitro: litros > 0 ? custoTotal / litros : 0
  };
}
