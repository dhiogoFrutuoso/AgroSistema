import { Eye, Download, Edit3, Trash2, Archive, Star, Search, Copy, FileText, Image as ImageIcon, FileSpreadsheet, File } from "lucide-react";
import { useMemo, useState } from "react";
import { downloadDocumento } from "../services/documentosService.js";
import { CATEGORIAS_DOCUMENTOS, tipoClass, prioridadeClass } from "../utils/documentosUtils.js";
import DocumentoModal from "./DocumentoModal.jsx";

export default function TabelaDocumentos({ documentos = [], onEdit, onDelete, onDuplicate, onFavorite, onArchive }) {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("TODOS");
  const [categoria, setCategoria] = useState("TODOS");
  const [mostrarArquivados, setMostrarArquivados] = useState(false);
  const [viewModal, setViewModal] = useState(null);

  const filtrados = useMemo(() => {
    return documentos.filter((doc) => {
      const texto = `${doc.titulo} ${doc.nomeOriginal} ${doc.usuario}`.toLowerCase();
      const matchBusca = !busca || texto.includes(busca.toLowerCase());
      const matchTipo = tipo === "TODOS" || doc.tipo === tipo;
      const matchCategoria = categoria === "TODOS" || doc.categoria === categoria;
      const matchStatus = mostrarArquivados ? true : doc.status !== "ARQUIVADO";
      return matchBusca && matchTipo && matchCategoria && matchStatus;
    });
  }, [documentos, busca, tipo, categoria, mostrarArquivados]);

  function renderIcon(tipo) {
    if (tipo === "IMAGEM") return <ImageIcon size={20} className="text-emerald-400" />;
    if (tipo === "PDF") return <FileText size={20} className="text-red-400" />;
    if (tipo === "PLANILHA") return <FileSpreadsheet size={20} className="text-green-400" />;
    return <File size={20} className="text-slate-400" />;
  }

  return (
    <>
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div><h2 className="text-2xl font-black text-white">Central de Arquivos</h2></div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-300">
              <Search size={18} />
              <input className="bg-transparent outline-none" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar..." />
            </div>
            <select className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="TODOS">Todos Formatos</option>
              <option value="PDF">PDF</option>
              <option value="IMAGEM">Imagens</option>
              <option value="PLANILHA">Planilhas</option>
            </select>
            <select className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="TODOS">Todas Categorias</option>
              {CATEGORIAS_DOCUMENTOS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <label className="flex cursor-pointer items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">
               <input type="checkbox" checked={mostrarArquivados} onChange={(e) => setMostrarArquivados(e.target.checked)} className="accent-indigo-500" /> Ver Arquivados
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1300px] w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-slate-400">
              <tr className="border-b border-white/10">
                <th className="pb-4 px-3">Ícone</th>
                <th className="pb-4 px-3">Documento</th>
                <th className="pb-4 px-3">Categoria</th>
                <th className="pb-4 px-3 text-center">Tipo</th>
                <th className="pb-4 px-3 text-center">Tamanho</th>
                <th className="pb-4 px-3 text-center">Data</th>
                <th className="pb-4 px-3 text-center">Status</th>
                <th className="pb-4 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-200">
              {filtrados.map((doc) => (
                <tr key={doc.id || doc._id} className="hover:bg-white/[0.03]">
                  <td className="py-4 px-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800">
                      {renderIcon(doc.tipo)}
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <p className="font-bold text-white flex items-center gap-2">
                       {doc.favorito && <Star size={14} className="text-amber-400 fill-amber-400" />} {doc.titulo}
                    </p>
                    <p className="text-xs text-slate-400 truncate max-w-xs">{doc.nomeOriginal}</p>
                    <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${prioridadeClass(doc.prioridade)}`}>{doc.prioridade}</span>
                  </td>
                  <td className="py-4 px-3 font-bold text-slate-300">{doc.categoria}</td>
                  <td className="py-4 px-3 text-center">
                    <span className={`inline-block rounded-lg px-2 py-1 text-[10px] font-black uppercase ${tipoClass(doc.tipo)}`}>{doc.tipo}</span>
                  </td>
                  <td className="py-4 px-3 text-center font-mono text-slate-300">{doc.tamanhoFormatado}</td>
                  <td className="py-4 px-3 text-center text-slate-300">{new Date(doc.dataUpload).toLocaleDateString("pt-BR", {timeZone: 'UTC'})}</td>
                  <td className="py-4 px-3 text-center">
                     <span className={`inline-block rounded-full px-2 py-1 text-[10px] font-black uppercase ${doc.status === 'ARQUIVADO' ? 'bg-slate-800 text-slate-400' : 'bg-blue-500/20 text-blue-300'}`}>{doc.status}</span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={(e) => { e.preventDefault(); setViewModal(doc); }} title="Visualizar Perfil" className="rounded-xl p-2 text-indigo-400 hover:bg-indigo-500/20 transition-colors"><Eye size={17} /></button>
                      <button onClick={() => downloadDocumento(doc)} title="Download" className="rounded-xl p-2 text-emerald-400 hover:bg-emerald-500/20 transition-colors"><Download size={17} /></button>
                      <button onClick={() => onFavorite(doc.id || doc._id)} title="Favoritar" className={`rounded-xl p-2 transition-colors ${doc.favorito ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 hover:bg-white/10'}`}><Star size={17} /></button>
                      <button onClick={() => onDuplicate(doc)} title="Duplicar" className="rounded-xl p-2 text-cyan-400 hover:bg-cyan-500/20 transition-colors"><Copy size={17} /></button>
                      <button onClick={() => onEdit?.(doc)} title="Editar" className="rounded-xl p-2 text-amber-400 hover:bg-amber-500/20 transition-colors"><Edit3 size={17} /></button>
                      <button onClick={() => onArchive(doc.id || doc._id)} title={doc.status === 'ARQUIVADO' ? "Desarquivar" : "Arquivar"} className="rounded-xl p-2 text-slate-400 hover:bg-white/10 transition-colors"><Archive size={17} /></button>
                      <button onClick={() => onDelete(doc.id || doc._id)} title="Excluir" className="rounded-xl p-2 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (<tr><td colSpan="8" className="py-10 text-center text-slate-400">Nenhum documento encontrado.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <DocumentoModal registro={viewModal} onClose={() => setViewModal(null)} />
    </>
  );
}