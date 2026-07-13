import { api } from "../../../services/api.js";

const CONFIG_KEY = "@arroz:configuracoes";
const AUDIT_KEY = "@arroz:auditoria";
const RESUMO_KEY = "@arroz:configuracoes:resumo";

export const TEMAS = ["AGRICOLA", "ESCURO", "CLARO", "DOURADO"];
export const DENSIDADES = ["COMPACTO", "NORMAL", "ESPACOSO"];

export const MODULOS = [
  "Painel", "Funcionários", "Fazendas", "Talhões", "Mapas/GPS", 
  "Financeiro", "Estoque", "Máquinas", "Plantio", "Colheita", 
  "Irrigação", "Documentos", "Relatórios", "Auditoria", "Configurações"
];

function uid(prefix = "cfg") { return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`; }

export function defaultConfig() {
  return {
    empresa: { nome: "ARROZ DOS FERREIRAS", razaoSocial: "", cnpj: "", telefone: "", email: "", endereco: "", cidade: "Icó", estado: "CE", responsavel: "" },
    aparencia: { tema: "AGRICOLA", densidade: "NORMAL", corPrincipal: "#22c55e", corDestaque: "#facc15", modoPremium: true, mostrarCards: true, mostrarGraficos: true },
    seguranca: { exigirSenha: true, bloquearAuditoriaFuncionario: true, permitirExportacao: true, permitirBackup: true, sessaoLocal: true },
    notificacoes: { estoqueCritico: true, irrigacaoDevendo: true, maquinasManutencao: true, documentosImportantes: true, auditoriaCritica: true },
    modulos: MODULOS.reduce((acc, item) => ({ ...acc, [item]: true }), {}),
    backup: { ultimoBackup: "", backupAutomatico: false, incluirArquivos: true, incluirAuditoria: true },
    historico: [],
    atualizadoEm: new Date().toISOString()
  };
}

export function getConfigLocal() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG_KEY));
    if (saved) return saved;
  } catch (e) {}
  return defaultConfig();
}

export function aplicarTema(config = getConfigLocal()) {
  const tema = config.aparencia?.tema || "AGRICOLA";
  const root = document.documentElement;
  root.dataset.arrozTema = tema;
  root.style.setProperty("--arroz-primary", config.aparencia?.corPrincipal || "#22c55e");
  root.style.setProperty("--arroz-accent", config.aparencia?.corDestaque || "#facc15");
  document.body.classList.remove("tema-agricola", "tema-escuro", "tema-claro", "tema-dourado");
  document.body.classList.add(`tema-${String(tema).toLowerCase()}`);
}

export async function getConfiguracoesApiFirst() {
  try {
    const response = await api.get("/settings");
    if (response && response.ok && Object.keys(response.data || {}).length > 2) {
      const data = response.data;
      const base = defaultConfig();
      const merged = {
        ...base, ...data,
        empresa: { ...base.empresa, ...(data.empresa || {}) },
        aparencia: { ...base.aparencia, ...(data.aparencia || {}) },
        seguranca: { ...base.seguranca, ...(data.seguranca || {}) },
        notificacoes: { ...base.notificacoes, ...(data.notificacoes || {}) },
        modulos: { ...base.modulos, ...(data.modulos || {}) },
        backup: { ...base.backup, ...(data.backup || {}) },
        historico: Array.isArray(data.historico) ? data.historico : []
      };
      localStorage.setItem(CONFIG_KEY, JSON.stringify(merged));
      aplicarTema(merged);
      return merged;
    }
  } catch (err) { console.warn("API de Configurações indisponível. Usando local."); }
  
  const local = getConfigLocal();
  aplicarTema(local);
  return local;
}

export async function saveConfiguracoesApiFirst(config) {
  const atual = {
    ...config,
    atualizadoEm: new Date().toISOString(),
    historico: [{ id: uid("hist"), acao: "SALVAR", descricao: "Configurações atualizadas no sistema", dataHora: new Date().toISOString() }, ...(config.historico || [])].slice(0, 50)
  };

  localStorage.setItem(CONFIG_KEY, JSON.stringify(atual));
  aplicarTema(atual);
  
  try { await api.post("/settings", atual); } catch (e) { console.warn("Salvo apenas localmente."); }
  return atual;
}

export async function resetConfiguracoesApiFirst() {
  const cfg = defaultConfig();
  cfg.historico.unshift({ id: uid("hist"), acao: "RESET", descricao: "Configurações restauradas para o padrão de fábrica", dataHora: new Date().toISOString() });
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
  aplicarTema(cfg);
  try { await api.post("/settings", cfg); } catch (e) {}
  return cfg;
}

export function getResumo() {
  const cfg = getConfigLocal();
  return {
    empresa: cfg.empresa?.nome || "Empresa",
    tema: cfg.aparencia?.tema || "AGRICOLA",
    modulosAtivos: Object.values(cfg.modulos || {}).filter(Boolean).length,
    notificacoesAtivas: Object.values(cfg.notificacoes || {}).filter(Boolean).length,
    segurancaAtiva: Object.values(cfg.seguranca || {}).filter(Boolean).length,
    exportacaoLiberada: cfg.seguranca?.permitirExportacao,
    backupLiberado: cfg.seguranca?.permitirBackup,
    atualizadoEm: cfg.atualizadoEm || new Date().toISOString()
  };
}

export function enviarResumoPainel() {
  localStorage.setItem(RESUMO_KEY, JSON.stringify(getResumo()));
}

export function downloadFile(nome, conteudo, tipo) {
  const blob = new Blob([conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = nome;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

export function exportarConfiguracoes() {
  const payload = { projeto: "ARROZ DOS FERREIRAS", tipo: "CONFIGURACOES", geradoEm: new Date().toISOString(), configuracoes: getConfigLocal() };
  downloadFile("configuracoes-arroz-dos-ferreiras.json", JSON.stringify(payload, null, 2), "application/json");
}

export function backupCompleto() {
  const keys = Object.keys(localStorage).filter((key) => key.startsWith("@arroz:"));
  const dados = {};
  keys.forEach((key) => { try { dados[key] = JSON.parse(localStorage.getItem(key)); } catch { dados[key] = localStorage.getItem(key); } });
  
  const payload = { projeto: "ARROZ DOS FERREIRAS", tipo: "BACKUP_COMPLETO", geradoEm: new Date().toISOString(), dados };
  downloadFile("backup-completo-arroz-dos-ferreiras.json", JSON.stringify(payload, null, 2), "application/json");
}

export async function importarConfiguracoes(file) {
  const text = await file.text();
  const payload = JSON.parse(text);
  const cfg = payload.configuracoes || payload;
  return saveConfiguracoesApiFirst({ ...defaultConfig(), ...cfg });
}