import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MODULOS_RELATORIO, TIPOS_RELATORIO } from "../utils/relatoriosUtils.js";

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-amber-400/60";

function Field({ label, required, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label} {required && <span className="text-red-500">*</span>}</span>
      {children}
    </label>
  );
}

export default function RelatoriosEditModal({ linha, onUpdate, onClose }) {
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
            <h2 className="text-2xl font-black text-white">Editar Registro de Relatório</h2>
            <p className="text-sm text-slate-400">Atualize os metadados do histórico.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white hover:bg-white/20"><X size={24} /></button>
        </div>

        <form onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Título do Relatório" required><input required className={inputClass} value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} /></Field>
            <Field label="Responsável" required><input required className={inputClass} value={form.responsavel} onChange={(e) => setForm({...form, responsavel: e.target.value})} /></Field>
            
            <Field label="Módulo">
              <select className={inputClass} value={form.modulo} onChange={(e) => setForm({...form, modulo: e.target.value})}>
                {MODULOS_RELATORIO.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Tipo de Relatório">
              <select className={inputClass} value={form.tipo} onChange={(e) => setForm({...form, tipo: e.target.value})}>
                {TIPOS_RELATORIO.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>

            <Field label="Período Início"><input type="date" className={inputClass} value={form.periodoInicio || ""} onChange={(e) => setForm({...form, periodoInicio: e.target.value})} /></Field>
            <Field label="Período Fim"><input type="date" className={inputClass} value={form.periodoFim || ""} onChange={(e) => setForm({...form, periodoFim: e.target.value})} /></Field>

            <div className="md:col-span-2">
              <Field label="Observações e Conclusões"><textarea rows={3} className={inputClass} value={form.observacoes || ""} onChange={(e) => setForm({...form, observacoes: e.target.value})} /></Field>
            </div>
          </div>

          <button disabled={saving} type="submit" className="mt-6 flex w-full md:w-auto justify-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 font-black text-slate-950 hover:bg-amber-400 disabled:opacity-50">
            <Save size={20} /> {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}