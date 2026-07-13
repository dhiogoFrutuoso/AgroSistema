const MANUTENCOES_KEY = "@arroz:maquinas:manutencoes";
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
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn("Aviso: Limite de armazenamento local excedido. Tente enviar imagens menores.", error);
  }
}

function id() {
  return crypto.randomUUID?.() || String(Date.now());
}

export function getManutencoes() {
  return read(MANUTENCOES_KEY);
}

export function createManutencao(payload) {
  const manutencoes = read(MANUTENCOES_KEY);

  const registro = {
    id: id(),
    maquinaId: payload.maquinaId || "",
    maquinaNome: payload.maquinaNome || "",
    tipo: payload.tipo || "PREVENTIVA",
    descricao: payload.descricao || "",
    oficina: payload.oficina || "",
    responsavel: payload.responsavel || "",
    data: payload.data || new Date().toISOString().slice(0, 10),
    horimetro: Number(payload.horimetro || 0),
    pecas: payload.pecas || "",
    custoPecas: Number(payload.custoPecas || 0),
    custoMaoObra: Number(payload.custoMaoObra || 0),
    custoTotal: Number(payload.custoTotal || 0),
    status: payload.status || "ABERTA",
    observacoes: payload.observacoes || "",
    comprovante: payload.comprovante || "", // NOVO: Base64 do recibo ou foto da OS
    criadoEm: new Date().toISOString()
  };

  const updated = [registro, ...manutencoes];
  write(MANUTENCOES_KEY, updated);

  registrarAuditoria("MANUTENCAO", "Manutencao registrada: " + registro.maquinaNome);

  if (registro.custoTotal > 0) {
    registrarFinanceiro(registro);
  }

  return registro;
}

export function updateManutencao(idRegistro, payload) {
  const manutencoes = read(MANUTENCOES_KEY);
  
  const updated = manutencoes.map(item => {
    if (item.id === idRegistro) {
      return { 
        ...item, 
        ...payload, 
        atualizadoEm: new Date().toISOString() 
      };
    }
    return item;
  });

  write(MANUTENCOES_KEY, updated);
  registrarAuditoria("EDICAO", "Manutencao atualizada: " + (payload.maquinaNome || ""));
  return updated;
}

export function deleteManutencao(idRegistro) {
  const updated = read(MANUTENCOES_KEY).filter(item => item.id !== idRegistro);
  write(MANUTENCOES_KEY, updated);
  registrarAuditoria("EXCLUSAO", "Manutencao removida");
  return updated;
}

function registrarFinanceiro(manutencao) {
  const financeiro = read(FINANCEIRO_KEY);

  const lancamento = {
    id: id(),
    tipo: "DESPESA",
    descricao: "Manutenção - " + manutencao.maquinaNome,
    categoria: "Máquinas",
    valor: Number(manutencao.custoTotal || 0),
    dataLancamento: manutencao.data,
    dataVencimento: manutencao.data,
    status: "PENDENTE",
    formaPagamento: "",
    fazenda: "",
    talhao: "",
    responsavel: manutencao.responsavel || "",
    observacoes: manutencao.descricao || "",
    criadoEm: new Date().toISOString()
  };

  write(FINANCEIRO_KEY, [lancamento, ...financeiro]);
}

function registrarAuditoria(acao, descricao) {
  const auditoria = read(AUDITORIA_KEY);

  const registro = {
    id: id(),
    usuario: "Sistema",
    modulo: "Máquinas",
    acao,
    descricao,
    nivel: "INFO",
    dataHora: new Date().toISOString()
  };

  write(AUDITORIA_KEY, [registro, ...auditoria]);
}

export function getResumoManutencoes() {
  const dados = read(MANUTENCOES_KEY);

  return {
    total: dados.length,
    abertas: dados.filter(item => item.status === "ABERTA").length,
    concluidas: dados.filter(item => item.status === "CONCLUIDA").length,
    custoTotal: dados.reduce((acc, item) => acc + Number(item.custoTotal || 0), 0)
  };
}