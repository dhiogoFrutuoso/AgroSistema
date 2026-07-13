import { api } from "../../../services/api.js";
import jsPDF from "jspdf";
import { baixarArquivo, money, num } from "../utils/relatoriosUtils.js";

const AUDIT_KEY = "@arroz:auditoria";
const RELATORIOS_KEY = "@arroz:relatorios";
const RESUMO_KEY = "@arroz:relatorios:resumo";

function parse(value, fallback = []) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

function uid(prefix = "rel") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function getUserName() {
  const user = parse(localStorage.getItem("@arroz:user"), {});
  return user.nome || user.name || user.usuario || user.username || "Sistema";
}

export function audit(acao, descricao, nivel = "INFO") {
  const lista = parse(localStorage.getItem(AUDIT_KEY), []);
  lista.unshift({ id: uid("audit"), usuario: getUserName(), modulo: "Relatórios", acao, descricao, nivel, dataHora: new Date().toISOString() });
  localStorage.setItem(AUDIT_KEY, JSON.stringify(lista.slice(0, 900)));
}

export function getRegistrosRelatoriosLocal() {
  return parse(localStorage.getItem(RELATORIOS_KEY), []);
}

export function saveRegistrosRelatorios(lista) {
  localStorage.setItem(RELATORIOS_KEY, JSON.stringify(lista || []));
  window.dispatchEvent(new Event("storage"));
}

export async function getRegistrosRelatoriosApiFirst() {
  try {
    const response = await api.get("/reports");
    if (response && response.ok) {
      const registros = response.data.map(item => ({ ...item, id: item._id || item.id }));
      saveRegistrosRelatorios(registros);
      return registros;
    }
  } catch (err) {
    console.warn("API de Relatórios inacessível. Usando local.");
  }
  return getRegistrosRelatoriosLocal();
}

export async function criarRegistroRelatorioApiFirst(payload) {
  const lista = await getRegistrosRelatoriosApiFirst();
  const registro = {
    titulo: payload.titulo || "Relatório ERP",
    modulo: payload.modulo || "GERAL",
    tipo: payload.tipo || "EXECUTIVO",
    responsavel: payload.responsavel || getUserName(),
    periodoInicio: payload.periodoInicio || "",
    periodoFim: payload.periodoFim || "",
    observacoes: payload.observacoes || ""
  };

  const response = await api.post("/reports", registro);
  if (!response.ok) throw new Error("Erro ao salvar relatório no BD.");

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  saveRegistrosRelatorios([finalItem, ...lista]);
  audit("CADASTRO", `Relatório registrado: ${finalItem.titulo}`);
  return finalItem;
}

export async function atualizarRegistroRelatorioApiFirst(id, payload) {
  const lista = await getRegistrosRelatoriosApiFirst();
  const response = await api.put(`/reports/${id}`, payload);
  if (!response.ok) throw new Error("Erro ao atualizar relatório no BD.");

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  const atualizados = lista.map((item) => (String(item.id) === String(id) ? finalItem : item));
  saveRegistrosRelatorios(atualizados);
  audit("EDICAO", `Relatório editado: ${finalItem.titulo}`);
  return finalItem;
}

export async function excluirRegistroRelatorioApiFirst(id) {
  const response = await api.delete(`/reports/${id}`);
  if (!response.ok) throw new Error("Erro ao excluir relatório no BD.");

  const lista = getRegistrosRelatoriosLocal();
  const atualizada = lista.filter((i) => String(i.id) !== String(id) && String(i._id) !== String(id));
  saveRegistrosRelatorios(atualizada);
  audit("EXCLUSAO", `Relatório removido: ${id}`, "ALERTA");
  return true;
}

// LOGICA DE COLETA (Pode manter no cache local para gerar PDF super rápido)
export function coletarDados() {
  const funcionarios = parse(localStorage.getItem("@arroz:funcionarios"), []);
  const gps = parse(localStorage.getItem("@arroz:gps:areas"), []);
  const talhoes = parse(localStorage.getItem("@arroz:talhoes"), []);
  const estoque = parse(localStorage.getItem("@arroz:estoque"), []);
  const maquinas = parse(localStorage.getItem("@arroz:maquinas"), []);
  const plantio = parse(localStorage.getItem("@arroz:plantio"), []);
  const colheita = parse(localStorage.getItem("@arroz:colheita"), []);
  const irrigacao = parse(localStorage.getItem("@arroz:irrigacao"), []);
  const documentos = parse(localStorage.getItem("@arroz:documentos"), []);
  const financeiro = parse(localStorage.getItem("@arroz:financeiro"), []);
  const auditoria = parse(localStorage.getItem("@arroz:auditoria"), []);

  const areas = [...gps, ...talhoes];
  const areaTotal = areas.reduce((s, i) => s + Number(i.areaHa || i.area || 0), 0) || plantio.reduce((s, i) => s + Number(i.area || i.areaHa || 0), 0);
  const custoPlantio = plantio.reduce((s, i) => s + Number(i.custos || i.custoTotal || 0), 0);
  const custoColheita = colheita.reduce((s, i) => s + Number(i.custoTotal || 0), 0);
  const custoIrrigacao = irrigacao.reduce((s, i) => s + Number(i.valorTotal || 0), 0);
  const dividaIrrigacao = irrigacao.reduce((s, i) => s + Number(i.valorDevido || 0), 0);
  const valorEstoque = estoque.reduce((s, i) => s + Number(i.preco || 0) * Number(i.quantidade || 0), 0);
  const movimentacaoFinanceira = financeiro.reduce((s, i) => s + Number(i.valor || 0), 0);
  const producaoKg = colheita.reduce((s, i) => s + Number(i.pesoLiquido || 0), 0);

  const maquinasOperando = maquinas.filter((m) => String(m.status || "").toUpperCase() === "OPERANDO").length;
  const maquinasManutencao = maquinas.filter((m) => String(m.status || "").toUpperCase() === "MANUTENCAO").length;
  const estoqueCritico = estoque.filter((i) => Number(i.quantidade || 0) <= Number(i.minimo || 0)).length;

  return {
    funcionarios, gps, talhoes, estoque, maquinas, plantio, colheita, irrigacao, documentos, financeiro, auditoria,
    resumo: {
      funcionarios: funcionarios.length, areas: areas.length, areaTotal,
      estoque: estoque.length, estoqueCritico, maquinas: maquinas.length, maquinasOperando, maquinasManutencao,
      plantio: plantio.length, colheita: colheita.length, irrigacao: irrigacao.length, documentos: documentos.length,
      auditoria: auditoria.length, custoPlantio, custoColheita, custoIrrigacao, dividaIrrigacao,
      valorEstoque, movimentacaoFinanceira, custoTotal: custoPlantio + custoColheita + custoIrrigacao + valorEstoque + movimentacaoFinanceira,
      producaoKg, atualizadoEm: new Date().toISOString()
    }
  };
}

export function getResumo() { return coletarDados().resumo; }

export function enviarResumoPainel() {
  const resumo = getResumo();
  localStorage.setItem(RESUMO_KEY, JSON.stringify(resumo));
  audit("EXPORTACAO", "Resumo de relatórios enviado para Painel");
  return resumo;
}

export function exportarJSON() {
  const payload = { geradoEm: new Date().toISOString(), dados: coletarDados(), historico: getRegistrosRelatoriosLocal() };
  baixarArquivo("relatorios-geral.json", JSON.stringify(payload, null, 2), "application/json");
  audit("EXPORTACAO", "JSON geral de relatórios exportado");
}

export function exportarCSV() {
  const { resumo } = coletarDados();
  const rows = Object.entries(resumo).map(([campo, valor]) => `"${campo}";"${String(valor).replaceAll('"', '""')}"`);
  baixarArquivo("relatorio-resumo.csv", ["campo;valor", ...rows].join("\n"), "text/csv;charset=utf-8;");
  audit("EXPORTACAO", "CSV de relatório exportado");
}

function bloco(doc, titulo, linhas, yInicial) {
  let y = yInicial;
  doc.setFontSize(13); doc.text(titulo, 14, y); y += 8;
  doc.setFontSize(9);
  linhas.forEach((linha) => {
    if (y > 278) { doc.addPage(); y = 18; }
    doc.text(linha, 18, y); y += 6;
  });
  return y + 4;
}

export function gerarPDFExecutivo(config = {}) {
  const dados = coletarDados(); const r = dados.resumo; const doc = new jsPDF(); const now = new Date().toLocaleString("pt-BR");
  doc.setFontSize(16); doc.text("ARROZ DOS FERREIRAS - RELATÓRIO EXECUTIVO", 14, 18);
  doc.setFontSize(10); doc.text(`Gerado em: ${now}`, 14, 28); doc.text(`Responsável: ${config.responsavel || getUserName()}`, 14, 35); doc.text(`Tipo: ${config.tipo || "EXECUTIVO"} | Módulo: ${config.modulo || "GERAL"}`, 14, 42);

  let y = 56;
  y = bloco(doc, "Resumo Geral", [`Funcionários: ${r.funcionarios}`, `Talhões/GPS: ${r.areas}`, `Área total: ${num(r.areaTotal)} ha`, `Estoque: ${r.estoque} itens`, `Estoque crítico: ${r.estoqueCritico} itens`, `Máquinas: ${r.maquinas}`, `Máquinas operando: ${r.maquinasOperando}`, `Máquinas em manutenção: ${r.maquinasManutencao}`, `Documentos: ${r.documentos}`, `Auditoria: ${r.auditoria} registros`], y);
  y = bloco(doc, "Financeiro e Custos", [`Custo plantio: ${money(r.custoPlantio)}`, `Custo colheita: ${money(r.custoColheita)}`, `Custo irrigação: ${money(r.custoIrrigacao)}`, `Dívida irrigação: ${money(r.dividaIrrigacao)}`, `Valor em estoque: ${money(r.valorEstoque)}`, `Movimentação financeira: ${money(r.movimentacaoFinanceira)}`, `Custo total consolidado: ${money(r.custoTotal)}`], y);
  y = bloco(doc, "Operação Agrícola", [`Plantios cadastrados: ${r.plantio}`, `Colheitas cadastradas: ${r.colheita}`, `Irrigações cadastradas: ${r.irrigacao}`, `Produção colhida: ${num(r.producaoKg)} kg`, `Produção colhida em toneladas: ${num(r.producaoKg / 1000)} t`], y);

  if (config.observacoes) y = bloco(doc, "Observações", [String(config.observacoes).slice(0, 500)], y);
  doc.save("relatorio-executivo-arroz-dos-ferreiras.pdf"); audit("EXPORTACAO", "PDF executivo exportado");
}

export function gerarPDFModulo(modulo = "GERAL", config = {}) {
  const dados = coletarDados(); const key = String(modulo || "GERAL").toLowerCase(); const doc = new jsPDF(); const now = new Date().toLocaleString("pt-BR");
  doc.setFontSize(16); doc.text(`ARROZ DOS FERREIRAS - RELATÓRIO ${String(modulo).toUpperCase()}`, 14, 18);
  doc.setFontSize(10); doc.text(`Gerado em: ${now}`, 14, 28); doc.text(`Responsável: ${config.responsavel || getUserName()}`, 14, 35);
  const mapa = { funcionarios: dados.funcionarios, talhoes: dados.talhoes, gps: dados.gps, estoque: dados.estoque, maquinas: dados.maquinas, plantio: dados.plantio, colheita: dados.colheita, irrigacao: dados.irrigacao, documentos: dados.documentos, financeiro: dados.financeiro, auditoria: dados.auditoria };
  const lista = mapa[key] || []; let y = 50;

  if (!lista.length) doc.text("Nenhum registro encontrado para este módulo.", 14, y);

  lista.slice(0, 55).forEach((item, index) => {
    if (y > 278) { doc.addPage(); y = 18; }
    const titulo = item.nome || item.titulo || item.descricao || item.empresaAgua || item.fazenda || item.usuario || item.id || "Registro";
    doc.setFontSize(9); doc.text(`${index + 1}. ${String(titulo).slice(0, 80)}`, 14, y); y += 5;
    const detalhes = Object.entries(item).filter(([k, v]) => !["arquivo", "imagemMapa", "coordenadas", "comprovante", "ticketBalanca", "anexo"].includes(k) && typeof v !== "object").slice(0, 6).map(([k, v]) => `${k}: ${String(v).slice(0, 35)}`).join(" | ");
    doc.setFontSize(7); doc.text(String(detalhes).slice(0, 150), 18, y); y += 7;
  });

  doc.save(`relatorio-${String(modulo).toLowerCase()}.pdf`); audit("EXPORTACAO", `PDF do módulo ${modulo} exportado`);
}