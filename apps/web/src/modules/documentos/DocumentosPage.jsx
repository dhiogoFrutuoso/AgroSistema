import { useEffect, useState } from "react";
import DashboardDocumentos from "./components/DashboardDocumentos.jsx";
import UploadDocumento from "./components/UploadDocumento.jsx";
import TabelaDocumentos from "./components/TabelaDocumentos.jsx";
import DocumentoEditModal from "./components/DocumentoEditModal.jsx";
import jsPDF from "jspdf";

import {
  getDocumentosApiFirst,
  createDocumentoApiFirst,
  updateDocumentoApiFirst,
  deleteDocumentoApiFirst,
  duplicarDocumentoApiFirst,
  getResumo,
  enviarResumoPainel,
  exportarCSV,
  exportarJSON,
  temPermissaoDocumentos,
  audit
} from "./services/documentosService.js";

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [resumo, setResumo] = useState({ total: 0, tamanhoTotal: 0 });

  async function carregar() {
    setLoading(true);
    try {
      const lista = await getDocumentosApiFirst();
      setDocumentos(lista || []);
      setResumo(getResumo());
    } catch (error) {
      console.error("Erro ao carregar documentos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  if (!temPermissaoDocumentos()) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
        <h1 className="text-3xl font-black text-white">Acesso Negado</h1>
        <p className="mt-2 text-slate-300">Você não possui permissão para acessar a Central Documental.</p>
      </div>
    );
  }

  async function handleUpload(payload) {
    try {
      await createDocumentoApiFirst(payload);
      await carregar();
      alert("Documento enviado com sucesso!");
    } catch (error) {
      alert(error.message || "Erro no upload.");
    }
  }

  async function handleEditar(id, patch) {
    try {
      await updateDocumentoApiFirst(id, patch);
      setEditando(null);
      await carregar();
    } catch (error) {
      alert("Erro ao editar documento.");
    }
  }

  async function handleExcluir(id) {
    if (!window.confirm("Deseja excluir este documento definitivamente?")) return;
    try {
      await deleteDocumentoApiFirst(id);
      await carregar();
    } catch (error) {
      alert("Erro ao excluir.");
    }
  }

  async function handleDuplicar(doc) {
    try {
      await duplicarDocumentoApiFirst(doc);
      await carregar();
      alert("Documento duplicado com sucesso!");
    } catch (error) {
      alert("Erro ao duplicar documento.");
    }
  }

  async function handleFavoritar(id) {
    const doc = documentos.find(d => String(d.id || d._id) === String(id));
    if (doc) {
      await updateDocumentoApiFirst(id, { favorito: !doc.favorito });
      await carregar();
    }
  }

  async function handleArquivar(id) {
    const doc = documentos.find(d => String(d.id || d._id) === String(id));
    if (doc) {
      await updateDocumentoApiFirst(id, { status: doc.status === "ARQUIVADO" ? "ATIVO" : "ARQUIVADO" });
      await carregar();
    }
  }

  function exportarPDF() {
    const doc = new jsPDF();
    const now = new Date().toLocaleString("pt-BR");

    doc.setFontSize(16);
    doc.text("ARROZ DOS FERREIRAS - Relatório de Documentos", 14, 18);

    doc.setFontSize(10);
    doc.text(`Gerado em: ${now}`, 14, 28);
    doc.text(`Total: ${resumo.total}`, 14, 38);
    doc.text(`PDFs: ${resumo.pdfs}`, 14, 45);
    doc.text(`Imagens: ${resumo.imagens}`, 14, 52);
    doc.text(`Planilhas: ${resumo.planilhas}`, 14, 59);

    let y = 78;
    doc.setFontSize(11);
    doc.text("Lista de documentos", 14, y);
    y += 8;
    doc.setFontSize(8);

    documentos.slice(0, 42).forEach((item, index) => {
      if (y > 280) { doc.addPage(); y = 18; }
      doc.text(`${index + 1}. ${item.titulo} | ${item.categoria} | ${item.tipo} | ${item.status}`, 14, y);
      y += 5;
      doc.text(`Usuário: ${item.usuario} | Upload: ${new Date(item.dataUpload).toLocaleDateString("pt-BR", {timeZone: 'UTC'})} | Tamanho: ${item.tamanhoFormatado}`, 18, y);
      y += 7;
    });

    doc.save("relatorio-documentos.pdf");
    audit("EXPORTACAO", "PDF de documentos exportado");
  }

  function enviarPainel() {
    enviarResumoPainel();
    alert("Resumo de documentos enviado para o Painel.");
  }

  if (loading && documentos.length === 0) {
    return <div className="flex min-h-[50vh] items-center justify-center font-bold tracking-widest text-indigo-400">CARREGANDO CENTRAL DE ARQUIVOS...</div>;
  }

  return (
    <div className="space-y-6">
      <DashboardDocumentos resumo={resumo} documentos={documentos} />
      
      <UploadDocumento onUpload={handleUpload} />

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Exportações e Resumo</h2>
            <p className="text-sm text-slate-400">Exportar documentos e enviar indicadores para o Painel.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportarPDF} className="rounded-2xl border border-white/10 bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800 transition-colors">PDF</button>
            <button onClick={exportarCSV} className="rounded-2xl border border-white/10 bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800 transition-colors">CSV</button>
            <button onClick={exportarJSON} className="rounded-2xl border border-white/10 bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800 transition-colors">JSON</button>
            <button onClick={enviarPainel} className="rounded-2xl bg-indigo-600 px-5 py-3 font-black text-white hover:bg-indigo-500 transition-colors">Enviar Resumo</button>
          </div>
        </div>
      </div>

      <TabelaDocumentos
        documentos={documentos}
        onEdit={setEditando}
        onDelete={handleExcluir}
        onDuplicate={handleDuplicar}
        onFavorite={handleFavoritar}
        onArchive={handleArquivar}
      />

      {editando && (
        <DocumentoEditModal
          linha={editando}
          onUpdate={handleEditar}
          onClose={() => setEditando(null)}
        />
      )}
    </div>
  );
}