import { Save, PlusCircle } from "lucide-react";
import { useState } from "react";
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

export default function RelatoriosForm({ onCreate }) {
  const [form, setForm] = useState({ titulo: "", modulo: "GERAL", tipo: "EXECUTIVO", responsavel: "", periodoInicio: "", periodoFim: "", observacoes: "" });
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    await onCreate?.(form);
    setForm({ titulo: "", modulo: "GERAL", tipo: "EXECUTIVO", responsavel: "", periodoInicio: "", periodoFim: "", observacoes: "" });
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <h2 className="text-3xl font-black text-white">Novo Registro de Relatório</h2>
      <p className="mt-2 text-sm text-slate-400">Crie um histórico e registre relatórios emitidos manualmente ou analisados.</p>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Título do Relatório" required><input required className={inputClass} value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ex: Fechamento Safra 2026" /></Field>
        <Field label="Módulo">
          <select className={inputClass} value={form.modulo} onChange={(e) => setForm({ ...form, modulo: e.target.value })}>
            {MODULOS_RELATORIO.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Tipo de Relatório">
          <select className={inputClass} value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
            {TIPOS_RELATORIO.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Responsável" required><input required className={inputClass} value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} placeholder="Seu nome" /></Field>

        <Field label="Período Início"><input type="date" className={inputClass} value={form.periodoInicio} onChange={(e) => setForm({ ...form, periodoInicio: e.target.value })} /></Field>
        <Field label="Período Fim"><input type="date" className={inputClass} value={form.periodoFim} onChange={(e) => setForm({ ...form, periodoFim: e.target.value })} /></Field>
        
        <div className="col-span-1 md:col-span-2">
           <Field label="Observações e Conclusões"><textarea rows={1} className={inputClass} value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} placeholder="Resumo analítico..." /></Field>
        </div>
      </div>

      <button disabled={saving} type="submit" className="mt-6 flex w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 font-black text-slate-950 transition hover:bg-amber-400 disabled:opacity-50">
        <PlusCircle size={20} /> {saving ? "Salvando..." : "Salvar Registro"}
      </button>
    </form>
  );
}