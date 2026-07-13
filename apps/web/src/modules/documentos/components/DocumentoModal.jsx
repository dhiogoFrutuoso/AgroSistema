import { X, FileText, Image as ImageIcon, FileSpreadsheet, File, ExternalLink, Download } from "lucide-react";
import { downloadDocumento } from "../services/documentosService.js";

function Info({ label, value, colSpan }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 ${colSpan ? 'sm:col-span-2' : ''}`}>
      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-white break-words">{value}</p>
    </div>
  );
}

export default function DocumentoModal({ registro, onClose }) {
  if (!registro) return null;

  function renderIcon() {
    if (registro.tipo === "IMAGEM") return <ImageIcon size={64} className="text-emerald-400" />;
    if (registro.tipo === "PDF") return <FileText size={64} className="text-red-400" />;
    if (registro.tipo === "PLANILHA") return <FileSpreadsheet size={64} className="text-green-400" />;
    return <File size={64} className="text-slate-400" />;
  }

  function openFile() {
    if (registro.arquivo) {
       const newTab = window.open();
       newTab.document.write(`<iframe src="${registro.arquivo}" frameborder="0" style="border:0; width:100%; height:100%;"></iframe>`);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-4xl rounded-[2rem] border border-white/5 bg-[#0B0F19] p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">{registro.titulo}</h2>
            <p className="mt-1 text-sm text-slate-400">Categoria: {registro.categoria} | Status: {registro.status}</p>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex flex-col gap-3">
             <div className="flex h-48 w-48 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-slate-900 border border-white/5">
               {registro.tipo === "IMAGEM" && registro.arquivo ? (
                 <img src={registro.arquivo} className="h-full w-full object-cover" alt="Documento" />
               ) : renderIcon()}
             </div>
             <button onClick={openFile} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500/20 py-3 text-sm font-bold text-indigo-300 hover:bg-indigo-500/30 transition-colors">
               <ExternalLink size={16} /> Abrir Arquivo
             </button>
             <button onClick={() => downloadDocumento(registro)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm font-bold text-white hover:bg-slate-700 transition-colors">
               <Download size={16} /> Fazer Download
             </button>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 overflow-y-auto pr-1" style={{ maxHeight: "55vh" }}>
            <Info label="Nome Original" value={registro.nomeOriginal} colSpan />
            <Info label="Tipo de Arquivo" value={registro.tipo} />
            <Info label="Extensão" value={registro.extensao.toUpperCase()} />
            <Info label="Tamanho Arquivo" value={registro.tamanhoFormatado} />
            <Info label="Prioridade" value={registro.prioridade} />
            <Info label="Data do Upload" value={new Date(registro.dataUpload).toLocaleDateString("pt-BR", { timeZone: 'UTC' })} />
            <Info label="Enviado por (Usuário)" value={registro.usuario} />
            <Info label="Módulo Vinculado" value={registro.vinculoModulo || "Nenhum"} />
            <Info label="ID de Vínculo" value={registro.vinculoId || "Nenhum"} />
            <Info label="Descrição / Observações" value={registro.descricao || "Sem descrição"} colSpan />
          </div>
        </div>
      </div>
    </div>
  );
}