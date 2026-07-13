import { UploadCloud, FileUp } from "lucide-react";
import { useState } from "react";
import { CATEGORIAS_DOCUMENTOS, PRIORIDADES_DOCUMENTOS, TIPOS_PERMITIDOS } from "../utils/documentosUtils.js";

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-indigo-400/60";

export default function UploadDocumento({ onUpload }) {
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ titulo: "", descricao: "", categoria: "Outros", prioridade: "MEDIO", vinculoModulo: "", vinculoId: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!file) { alert("Selecione um arquivo primeiro."); return; }
    
    const ext = file.name.split(".").pop().toLowerCase();
    if (!TIPOS_PERMITIDOS.includes(ext)) { alert("Tipo de arquivo não permitido."); return; }

    setLoading(true);
    await onUpload({ file, ...form });
    setLoading(false);
    setFile(null);
    setForm({ titulo: "", descricao: "", categoria: "Outros", prioridade: "MEDIO", vinculoModulo: "", vinculoId: "" });
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-2xl bg-indigo-500/20 p-4 text-indigo-400"><UploadCloud size={28} /></div>
        <div>
          <h2 className="text-2xl font-black text-white">Upload de Documento</h2>
          <p className="text-sm text-slate-400">Envie PDFs, Imagens, Planilhas e Textos.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2 col-span-1 md:col-span-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Selecionar Arquivo *</span>
          <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-indigo-500/50 bg-indigo-500/10 px-5 py-3 font-bold text-indigo-300 transition-colors hover:bg-indigo-500/20">
            <FileUp size={20} /> {file ? file.name : "Clique para anexar arquivo..."}
            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
        </label>

        <label className="space-y-2 col-span-1 md:col-span-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Título / Nome</span>
          <input className={inputClass} value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ex: Contrato de Arrendamento" />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Categoria</span>
          <select className={inputClass} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
            {CATEGORIAS_DOCUMENTOS.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Prioridade</span>
          <select className={inputClass} value={form.prioridade} onChange={(e) => setForm({ ...form, prioridade: e.target.value })}>
            {PRIORIDADES_DOCUMENTOS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Vincular Módulo</span>
          <input className={inputClass} value={form.vinculoModulo} onChange={(e) => setForm({ ...form, vinculoModulo: e.target.value })} placeholder="Ex: Colheita" />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">ID Vínculo</span>
          <input className={inputClass} value={form.vinculoId} onChange={(e) => setForm({ ...form, vinculoId: e.target.value })} placeholder="Opcional" />
        </label>

        <label className="space-y-2 col-span-1 md:col-span-2 xl:col-span-4">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Descrição / Observações</span>
          <textarea rows={2} className={inputClass} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Detalhes do arquivo..." />
        </label>
      </div>

      <button disabled={loading} type="submit" className="mt-6 flex w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-black text-white transition hover:bg-indigo-500 disabled:opacity-50">
        <UploadCloud size={20} /> {loading ? "Enviando arquivo..." : "Salvar Documento"}
      </button>
    </form>
  );
}