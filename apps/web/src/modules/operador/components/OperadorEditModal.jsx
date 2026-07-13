import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/60";

function Field({ label, required, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label} {required && <span className="text-red-500">*</span>}</span>
      {children}
    </label>
  );
}

export default function OperadorEditModal({ linha, onUpdate, onClose }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (linha) setForm({ ...linha }); }, [linha]);

  if (!form) return null;

  function alterar(campo, valor) { setForm((prev) => ({ ...prev, [campo]: valor })); }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    await onUpdate(form.id || form._id, form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative my-8 w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Editar Registro de Operador</h2>
            <p className="text-sm text-slate-400">Edite as horas ou valores para recalcular automaticamente.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white hover:bg-white/20"><X size={24} /></button>
        </div>

        <form onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Data" required><input type="date" required className={inputClass} value={form.data} onChange={(e) => alterar("data", e.target.value)} /></Field>
            <Field label="Nome do Operador" required><input required className={inputClass} value={form.nomeOperador} onChange={(e) => alterar("nomeOperador", e.target.value)} /></Field>
            <Field label="Máquina" required><input required className={inputClass} value={form.maquinaAgricola} onChange={(e) => alterar("maquinaAgricola", e.target.value)} /></Field>
            <Field label="Cliente" required><input required className={inputClass} value={form.cliente} onChange={(e) => alterar("cliente", e.target.value)} /></Field>

            <Field label="Fazenda"><input className={inputClass} value={form.fazenda || ""} onChange={(e) => alterar("fazenda", e.target.value)} /></Field>
            <Field label="Talhão"><input className={inputClass} value={form.talhao || ""} onChange={(e) => alterar("talhao", e.target.value)} /></Field>
            <Field label="Serviço Realizado" required><input required className={inputClass} value={form.servico} onChange={(e) => alterar("servico", e.target.value)} /></Field>
            <Field label="Valor por Hora (R$)" required><input required type="number" step="0.01" className={inputClass} value={form.valorHorario} onChange={(e) => alterar("valorHorario", e.target.value)} /></Field>
            
            <Field label="Hora Início" required><input required type="time" className={inputClass} value={form.horaInicio} onChange={(e) => alterar("horaInicio", e.target.value)} /></Field>
            <Field label="Hora Fim" required><input required type="time" className={inputClass} value={form.horaFim} onChange={(e) => alterar("horaFim", e.target.value)} /></Field>
            
            <Field label="Combustível (Litros)"><input type="number" step="0.1" className={inputClass} value={form.litrosOleo} onChange={(e) => alterar("litrosOleo", e.target.value)} /></Field>
            <Field label="Valor do Litro (R$)"><input type="number" step="0.01" className={inputClass} value={form.valorLitroOleo} onChange={(e) => alterar("valorLitroOleo", e.target.value)} /></Field>
            <Field label="Outros Gastos (R$)"><input type="number" step="0.01" className={inputClass} value={form.outrosGastos} onChange={(e) => alterar("outrosGastos", e.target.value)} /></Field>

            <Field label="Financeiro" required>
              <select className={inputClass} value={form.tipoLancamentoFinanceiro} onChange={(e) => alterar("tipoLancamentoFinanceiro", e.target.value)}>
                <option value="RECEITA">RECEITA</option>
                <option value="DESPESA">DESPESA</option>
              </select>
            </Field>

            <Field label="Status" required>
              <select className={inputClass} value={form.status} onChange={(e) => alterar("status", e.target.value)}>
                <option value="ABERTA">Aberto / Pendente</option>
                <option value="ASSINADO">Assinado</option>
                <option value="PAGO">Pago</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Observações Livres"><textarea rows={2} className={inputClass} value={form.observacoes || ""} onChange={(e) => alterar("observacoes", e.target.value)} /></Field>
          </div>

          <button disabled={saving} type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 font-black text-slate-950 hover:bg-emerald-400 transition-opacity disabled:opacity-50">
            <Save size={20} /> {saving ? "Atualizando..." : "Salvar alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}