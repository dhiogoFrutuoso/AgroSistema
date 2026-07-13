import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CATEGORIAS_DOCUMENTOS, PRIORIDADES_DOCUMENTOS } from "../utils/documentosUtils.js";

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-indigo-400/60";

function Field({ label, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
      {children}
    </label>
  );
}

export default function DocumentoEditModal({ linha, onUpdate, onClose }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (linha) setForm({ ...linha }); }, [linha]);
  if (!form) return null;

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    await onUpdate(form.id || form._id, form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Editar Metadados do Documento</h2>
            <p className="text-sm text-slate-400">Atualize título, categoria e prioridade.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white hover:bg-white/20"><X size={24} /></button>
        </div>

        <form onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Título"><input required className={inputClass} value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} /></Field>
            <Field label="Categoria">
              <select className={inputClass} value={form.categoria} onChange={(e) => setForm({...form, categoria: e.target.value})}>
                {CATEGORIAS_DOCUMENTOS.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </Field>
            <Field label="Prioridade">
              <select className={inputClass} value={form.prioridade} onChange={(e) => setForm({...form, prioridade: e.target.value})}>
                {PRIORIDADES_DOCUMENTOS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Status de Arquivamento">
               <select className={inputClass} value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}>
                 <option value="ATIVO">ATIVO</option>
                 <option value="ARQUIVADO">ARQUIVADO</option>
               </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Descrição"><textarea rows={3} className={inputClass} value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})} /></Field>
            </div>
          </div>

          <button disabled={saving} type="submit" className="mt-6 flex w-full md:w-auto justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-black text-white hover:bg-indigo-500 disabled:opacity-50">
            <Save size={20} /> {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}