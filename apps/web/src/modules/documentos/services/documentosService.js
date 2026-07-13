import { api } from "../../../services/api.js";
import { formatBytes, getExtensao, getTipoDocumento } from "../utils/documentosUtils.js";

const DOC_KEY = "@arroz:documentos";
const AUDIT_KEY = "@arroz:auditoria";
const RESUMO_KEY = "@arroz:documentos:resumo";

export function parse(value, fallback = []) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

function uid(prefix = "doc") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getUser() { 
  return parse(localStorage.getItem("@arroz:user"), {}); 
}

export function getUsuarioNome() {
  const user = getUser();
  return user.nome || user.name || user.usuario || user.username || "Sistema";
}

export function temPermissaoDocumentos() { 
  return true; 
}

export function getDocumentosLocal() {
  return parse(localStorage.getItem(DOC_KEY), []);
}

export function saveDocumentos(lista) {
  try {
    const safeData = (lista || []).map(item => ({ ...item, arquivo: item.arquivo ? "salvo-no-bd" : "" }));
    localStorage.setItem(DOC_KEY, JSON.stringify(safeData));
  } catch (error) {
    console.warn("Aviso: Limite de armazenamento local excedido.");
  }
}

export async function getDocumentosApiFirst() {
  try {
    const response = await api.get("/documents");
    if (response && response.ok) {
      const lista = response.data.map(item => ({ ...item, id: item._id || item.id }));
      saveDocumentos(lista);
      return lista;
    }
  } catch (err) {
    console.warn("API inacessível. Usando local.");
  }
  return getDocumentosLocal();
}

export function audit(acao, descricao, nivel = "INFO") {
  const lista = parse(localStorage.getItem(AUDIT_KEY), []);
  lista.unshift({ id: uid("audit"), usuario: getUsuarioNome(), modulo: "Documentos", acao, descricao, nivel, dataHora: new Date().toISOString() });
  localStorage.setItem(AUDIT_KEY, JSON.stringify(lista.slice(0, 500)));
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export async function createDocumentoApiFirst({ file, titulo, descricao, categoria, prioridade, vinculoModulo, vinculoId }) {
  const extensao = getExtensao(file.name);
  const tipo = getTipoDocumento(extensao);
  const arquivo = await fileToBase64(file);

  const doc = {
    titulo: titulo || file.name.replace(`.${extensao}`, ""),
    descricao: descricao || "",
    categoria: categoria || "Outros",
    prioridade: prioridade || "MEDIO",
    vinculoModulo: vinculoModulo || "",
    vinculoId: vinculoId || "",
    extensao, tipo,
    tamanho: file.size,
    tamanhoFormatado: formatBytes(file.size),
    dataUpload: new Date().toISOString(),
    usuario: getUsuarioNome(),
    nomeOriginal: file.name,
    mimeType: file.type || "",
    arquivo, favorito: false, status: "ATIVO"
  };

  const response = await api.post("/documents", doc);
  if (!response.ok) throw new Error(response.error || "Erro ao fazer upload no BD.");

  const finalDoc = { ...response.data, id: response.data._id || response.data.id };
  audit("UPLOAD", `Upload do documento: ${finalDoc.titulo}`);
  return finalDoc;
}

export async function updateDocumentoApiFirst(id, patch) {
  const response = await api.put(`/documents/${id}`, patch);
  if (!response.ok) throw new Error(response.error || "Erro ao atualizar documento.");
  audit("EDICAO", `Documento editado: ${patch.titulo || id}`);
  return true;
}

export async function deleteDocumentoApiFirst(id) {
  const response = await api.delete(`/documents/${id}`);
  if (!response.ok) throw new Error(response.error || "Erro ao excluir documento.");
  audit("EXCLUSAO", `Documento excluido: ${id}`, "ALERTA");
  return true;
}

export async function duplicarDocumentoApiFirst(docOriginal) {
  const copia = { ...docOriginal, titulo: `${docOriginal.titulo} - Cópia`, dataUpload: new Date().toISOString(), favorito: false };
  return await createDocumentoApiFirst({ file: { name: copia.nomeOriginal, size: copia.tamanho, type: copia.mimeType }, ...copia, arquivo: docOriginal.arquivo }); 
}

export function downloadDocumento(doc) {
  if (!doc?.arquivo) return;
  const a = document.createElement("a");
  a.href = doc.arquivo; a.download = doc.nomeOriginal || `${doc.titulo}.${doc.extensao}`;
  document.body.appendChild(a); a.click(); a.remove();
  audit("DOWNLOAD", `Download do documento: ${doc.titulo}`);
}

export function getResumo() {
  const docs = getDocumentosLocal();
  const ativos = docs.filter((d) => d.status !== "ARQUIVADO");

  return {
    total: docs.length,
    ativos: ativos.length,
    pdfs: docs.filter((d) => d.tipo === "PDF").length,
    imagens: docs.filter((d) => d.tipo === "IMAGEM").length,
    planilhas: docs.filter((d) => d.tipo === "PLANILHA").length,
    contratos: docs.filter((d) => d.categoria === "Contratos").length,
    favoritos: docs.filter((d) => d.favorito).length,
    arquivados: docs.filter((d) => d.status === "ARQUIVADO").length,
    tamanhoTotal: docs.reduce((s, d) => s + Number(d.tamanho || 0), 0),
    atualizadoEm: new Date().toISOString()
  };
}

export function enviarResumoPainel() {
  localStorage.setItem(RESUMO_KEY, JSON.stringify(getResumo()));
  audit("EXPORTACAO", "Resumo de documentos enviado para Painel");
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

export function exportarJSON() {
  baixarArquivo("documentos.json", JSON.stringify(getDocumentosLocal(), null, 2), "application/json");
  audit("EXPORTACAO", "JSON de documentos exportado");
}

export function exportarCSV() {
  const docs = getDocumentosLocal();
  const headers = ["titulo","categoria","prioridade","tipo","extensao","tamanhoFormatado","dataUpload","usuario","status","favorito"];
  const rows = docs.map((d) => headers.map((h) => `"${String(d[h] ?? "").replaceAll('"', '""')}"`).join(";"));
  baixarArquivo("documentos.csv", [headers.join(";"), ...rows].join("\n"), "text/csv;charset=utf-8;");
  audit("EXPORTACAO", "CSV de documentos exportado");
}