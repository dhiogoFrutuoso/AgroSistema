import { api } from "../../../services/api.js";
import jsPDF from "jspdf";

export function parseKey(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export function num(value, digits = 2) {
  return Number(value || 0).toLocaleString("pt-BR", {
    maximumFractionDigits: digits
  });
}

export function uid(prefix = "painel") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function audit(acao, descricao, nivel = "INFO") {
  const user = parseKey("@arroz:user", {});
  const lista = parseKey("@arroz:auditoria", []);

  lista.unshift({
    id: uid("audit"),
    usuario: user.nome || user.name || user.usuario || user.username || "Sistema",
    modulo: "Painel",
    acao,
    descricao,
    nivel,
    dataHora: new Date().toISOString()
  });

  localStorage.setItem("@arroz:auditoria", JSON.stringify(lista.slice(0, 1000)));
}

export function getDadosERP() {
  const funcionarios = parseKey("@arroz:funcionarios", []);
  const gps = parseKey("@arroz:gps:areas", []);
  const talhoes = parseKey("@arroz:talhoes", []);
  const estoque = parseKey("@arroz:estoque", []);
  const maquinas = parseKey("@arroz:maquinas", []);
  const plantio = parseKey("@arroz:plantio", []);
  const colheita = parseKey("@arroz:colheita", []);
  const irrigacao = parseKey("@arroz:irrigacao", []);
  const documentos = parseKey("@arroz:documentos", []);
  const auditoria = parseKey("@arroz:auditoria", []);
  const financeiro = parseKey("@arroz:financeiro", []);
  const operador = parseKey("@arroz:operador", []);
  const arquivos = parseKey("@arroz:db:arquivos", []);
  const configuracoes = parseKey("@arroz:configuracoes", {});
  const operadorResumo = parseKey("@arroz:operador:resumo", {});
  const documentosResumo = parseKey("@arroz:documentos:resumo", {});
  const configuracoesResumo = parseKey("@arroz:configuracoes:resumo", {});

  return {
    funcionarios,
    gps,
    talhoes,
    estoque,
    maquinas,
    plantio,
    colheita,
    irrigacao,
    documentos,
    auditoria,
    financeiro,
    operador,
    arquivos,
    configuracoes,
    operadorResumo,
    documentosResumo,
    configuracoesResumo
  };
}

export function sum(lista, campos) {
  return (lista || []).reduce((total, item) => {
    const valor = campos.reduce((acc, campo) => {
      const n = Number(item?.[campo] || 0);
      return acc + (Number.isFinite(n) ? n : 0);
    }, 0);
    return total + valor;
  }, 0);
}

export function uniqueCount(lista, campo) {
  return new Set((lista || []).map((item) => item?.[campo]).filter(Boolean)).size;
}

export function groupBySum(lista, chave, campo) {
  const map = {};
  (lista || []).forEach((item) => {
    const nome = item?.[chave] || "Sem nome";
    map[nome] = (map[nome] || 0) + Number(item?.[campo] || 0);
  });

  return Object.entries(map)
    .map(([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 10);
}

export function groupByCount(lista, chave) {
  const map = {};
  (lista || []).forEach((item) => {
    const nome = item?.[chave] || "Sem nome";
    map[nome] = (map[nome] || 0) + 1;
  });

  return Object.entries(map)
    .map(([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 10);
}

export function getResumoPainel() {
  const d = getDadosERP();

  const areaGps = sum(d.gps, ["areaHa", "area"]);
  const areaTalhoes = sum(d.talhoes, ["areaHa", "area"]);
  const areaPlantio = sum(d.plantio, ["areaHa", "area"]);
  const areaColheita = sum(d.colheita, ["areaHa", "area"]);
  const areaIrrigacao = sum(d.irrigacao, ["hectares", "areaHa", "area"]);
  const areaTotal = Math.max(areaGps + areaTalhoes, areaPlantio, areaColheita, areaIrrigacao);

  const custoPlantio = sum(d.plantio, ["custos", "custoTotal"]);
  const custoColheita = sum(d.colheita, ["custoTotal"]);
  const custoIrrigacao = sum(d.irrigacao, ["valorTotal"]);
  const custoOperador = sum(d.operador, ["custoTotal"]);
  const custoEstoque = d.estoque.reduce((s, i) => s + Number(i.preco || 0) * Number(i.quantidade || 0), 0);

  const receitaOperador = sum(d.operador, ["valorTotal"]);
  const lucroOperador = sum(d.operador, ["lucroLiquido"]);
  const gastoOleoOperador = sum(d.operador, ["gastoOleo"]);
  const horasOperador = sum(d.operador, ["horasTrabalhadas"]);

  const producaoKg = sum(d.colheita, ["pesoLiquido", "peso"]);
  const dividaIrrigacao = sum(d.irrigacao, ["valorDevido"]);
  const valorFinanceiro = sum(d.financeiro, ["valor"]);
  const custoTotal = custoPlantio + custoColheita + custoIrrigacao + custoOperador;
  const resultadoOperacional = receitaOperador - custoTotal;

  const estoqueCritico = d.estoque.filter((i) => Number(i.quantidade || 0) <= Number(i.minimo || 0)).length;
  const maquinasOperando = d.maquinas.filter((m) => String(m.status || "").toUpperCase() === "OPERANDO").length;
  const maquinasManutencao = d.maquinas.filter((m) => String(m.status || "").toUpperCase() === "MANUTENCAO").length;
  const funcionariosAtivos = d.funcionarios.filter((f) => String(f.status || "ATIVO").toUpperCase() !== "INATIVO").length;
  const assinaturasOperador = d.operador.filter((o) => o.assinaturaCliente || o.status === "ASSINADO").length;

  return {
    ...d,
    resumo: {
      areaGps,
      areaTalhoes,
      areaPlantio,
      areaColheita,
      areaIrrigacao,
      areaTotal,
      custoPlantio,
      custoColheita,
      custoIrrigacao,
      custoOperador,
      custoEstoque,
      custoTotal,
      receitaOperador,
      lucroOperador,
      gastoOleoOperador,
      horasOperador,
      producaoKg,
      dividaIrrigacao,
      valorFinanceiro,
      resultadoOperacional,
      estoqueCritico,
      maquinasOperando,
      maquinasManutencao,
      funcionariosAtivos,
      assinaturasOperador,
      totalDocumentos: d.documentos.length || d.documentosResumo.total || 0,
      totalArquivos: d.arquivos.length,
      totalAuditoria: d.auditoria.length,
      totalFuncionarios: d.funcionarios.length,
      totalTalhoes: d.talhoes.length + d.gps.length,
      totalMaquinas: d.maquinas.length,
      totalPlantio: d.plantio.length,
      totalColheita: d.colheita.length,
      totalIrrigacao: d.irrigacao.length,
      totalOperador: d.operador.length,
      clientesOperador: uniqueCount(d.operador, "cliente"),
      maquinasOperador: uniqueCount(d.operador, "maquinaAgricola"),
      atualizadoEm: new Date().toISOString()
    },
    graficos: {
      custos: [
        { nome: "Plantio", valor: custoPlantio },
        { nome: "Colheita", valor: custoColheita },
        { nome: "Irrigacao", valor: custoIrrigacao },
        { nome: "Operador", valor: custoOperador },
        { nome: "Estoque", valor: custoEstoque }
      ],
      areas: [
        { nome: "GPS", valor: areaGps },
        { nome: "Talhoes", valor: areaTalhoes },
        { nome: "Plantio", valor: areaPlantio },
        { nome: "Colheita", valor: areaColheita },
        { nome: "Irrigacao", valor: areaIrrigacao }
      ],
      registros: [
        { nome: "Funcionarios", valor: d.funcionarios.length },
        { nome: "Talhoes", valor: d.talhoes.length + d.gps.length },
        { nome: "Estoque", valor: d.estoque.length },
        { nome: "Maquinas", valor: d.maquinas.length },
        { nome: "Plantio", valor: d.plantio.length },
        { nome: "Colheita", valor: d.colheita.length },
        { nome: "Irrigacao", valor: d.irrigacao.length },
        { nome: "Operador", valor: d.operador.length },
        { nome: "Documentos", valor: d.documentos.length || d.documentosResumo.total || 0 },
        { nome: "Auditoria", valor: d.auditoria.length }
      ],
      status: [
        { nome: "Estoque critico", valor: estoqueCritico },
        { nome: "Maquinas manutencao", valor: maquinasManutencao },
        { nome: "Irrigacao devendo", valor: dividaIrrigacao },
        { nome: "Pendencias operador", valor: d.operador.filter((o) => ["ABERTO", "PENDENTE"].includes(o.status)).length }
      ],
      operadorHoras: groupBySum(d.operador, "nomeOperador", "horasTrabalhadas"),
      operadorLucroMaquina: groupBySum(d.operador, "maquinaAgricola", "lucroLiquido"),
      operadorClientes: groupBySum(d.operador, "cliente", "valorTotal"),
      irrigacaoEmpresas: groupBySum(d.irrigacao, "empresaAgua", "valorDevido"),
      estoqueCategorias: groupByCount(d.estoque, "categoria"),
      auditoriaModulos: groupByCount(d.auditoria, "modulo")
    }
  };
}

export function exportarPainelJSON() {
  const payload = getResumoPainel();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "painel-executivo-arroz.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  audit("EXPORTACAO", "Painel exportado em JSON");
}

export function exportarPainelPDF() {
  const { resumo, graficos } = getResumoPainel();
  const doc = new jsPDF();
  const now = new Date().toLocaleString("pt-BR");

  doc.setFontSize(16);
  doc.text("ARROZ DOS FERREIRAS - PAINEL EXECUTIVO", 14, 18);
  doc.setFontSize(10);
  doc.text(`Gerado em: ${now}`, 14, 28);

  let y = 42;
  const lines = [
    `Area total: ${num(resumo.areaTotal)} ha`,
    `Custo total: ${money(resumo.custoTotal)}`,
    `Receita operador: ${money(resumo.receitaOperador)}`,
    `Lucro operador: ${money(resumo.lucroOperador)}`,
    `Irrigacao devendo: ${money(resumo.dividaIrrigacao)}`,
    `Producao colhida: ${num(resumo.producaoKg / 1000)} t`,
    `Estoque critico: ${resumo.estoqueCritico}`,
    `Maquinas operando: ${resumo.maquinasOperando}`,
    `Funcionarios ativos: ${resumo.funcionariosAtivos}`,
    `Documentos: ${resumo.totalDocumentos}`,
    `Auditoria: ${resumo.totalAuditoria}`
  ];

  lines.forEach((line) => {
    doc.text(line, 14, y);
    y += 7;
  });

  y += 6;
  doc.setFontSize(12);
  doc.text("Custos por modulo", 14, y);
  y += 8;
  doc.setFontSize(9);

  graficos.custos.forEach((item) => {
    doc.text(`${item.nome}: ${money(item.valor)}`, 18, y);
    y += 6;
  });

  y += 4;
  doc.setFontSize(12);
  doc.text("Registros por modulo", 14, y);
  y += 8;
  doc.setFontSize(9);

  graficos.registros.forEach((item) => {
    if (y > 280) {
      doc.addPage();
      y = 18;
    }
    doc.text(`${item.nome}: ${item.valor}`, 18, y);
    y += 6;
  });

  doc.save("painel-executivo-arroz-dos-ferreiras.pdf");
  audit("EXPORTACAO", "Painel exportado em PDF");
}
function extractArray(data, keys = []) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

async function getApiList(path, localKey, keys = []) {
  const response = await api.get(path);

  if (response.ok) {
    const list = extractArray(response.data, keys);
    localStorage.setItem(localKey, JSON.stringify(list));
    return list;
  }

  return parseKey(localKey, []);
}

export async function getDadosERPApiFirst() {
  const [
    funcionarios,
    gps,
    talhoes,
    estoque,
    maquinas,
    plantio,
    colheita,
    irrigacao,
    documentos,
    auditoria,
    financeiro
  ] = await Promise.all([
    getApiList("/employees", "@arroz:funcionarios", ["employees", "funcionarios"]),
    getApiList("/maps", "@arroz:gps:areas", ["maps", "mapas", "areas"]),
    getApiList("/plots", "@arroz:talhoes", ["plots", "talhoes"]),
    getApiList("/inventory", "@arroz:estoque", ["inventory", "estoque", "produtos"]),
    getApiList("/machines", "@arroz:maquinas", ["machines", "maquinas"]),
    getApiList("/plantings", "@arroz:plantio", ["plantings", "plantios"]),
    getApiList("/harvests", "@arroz:colheita", ["harvests", "colheitas"]),
    getApiList("/irrigations", "@arroz:irrigacao", ["irrigations", "irrigacoes"]),
    getApiList("/documents", "@arroz:documentos", ["documents", "documentos"]),
    getApiList("/audit", "@arroz:auditoria", ["audit", "auditoria"]),
    getApiList("/finance", "@arroz:financeiro", ["finance", "financeiro", "lancamentos"])
  ]);

  const operador = parseKey("@arroz:operador", []);
  const arquivos = parseKey("@arroz:db:arquivos", []);
  const configuracoes = parseKey("@arroz:configuracoes", {});
  const operadorResumo = parseKey("@arroz:operador:resumo", {});
  const documentosResumo = parseKey("@arroz:documentos:resumo", {});
  const configuracoesResumo = parseKey("@arroz:configuracoes:resumo", {});

  return {
    funcionarios,
    gps,
    talhoes,
    estoque,
    maquinas,
    plantio,
    colheita,
    irrigacao,
    documentos,
    auditoria,
    financeiro,
    operador,
    arquivos,
    configuracoes,
    operadorResumo,
    documentosResumo,
    configuracoesResumo
  };
}

export async function getResumoPainelApiFirst() {
  await getDadosERPApiFirst();
  return getResumoPainel();
}
