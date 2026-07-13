import { Save, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-blue-400/60";

function Field({ label, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
      {children}
    </label>
  );
}

export default function IrrigacaoEditModal({ linha, onUpdate, onClose, talhoes }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (linha) setForm({ ...linha }); }, [linha]);
  if (!form) return null;

  function update(field, value) { setForm((prev) => ({ ...prev, [field]: value })); }

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("comprovante", reader.result);
    reader.readAsDataURL(file);
  }

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
          <h2 className="text-2xl font-black text-white">Editar Irrigação</h2>
          <button type="button" onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white hover:bg-white/20"><X size={24} /></button>
        </div>

        <form onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Empresa de Água"><input required className={inputClass} value={form.empresaAgua} onChange={(e) => update("empresaAgua", e.target.value)} /></Field>
            <Field label="Fazenda"><input className={inputClass} value={form.fazenda} onChange={(e) => update("fazenda", e.target.value)} /></Field>
            <Field label="Talhão"><input className={inputClass} value={form.talhaoNome} onChange={(e) => update("talhaoNome", e.target.value)} /></Field>
            <Field label="Mês Referência"><input className={inputClass} type="month" value={form.mesReferencia} onChange={(e) => update("mesReferencia", e.target.value)} /></Field>
            
            <Field label="Valor por Hectare (R$)"><input className={inputClass} type="number" step="0.01" value={form.valorHa} onChange={(e) => update("valorHa", e.target.value)} /></Field>
            <Field label="Hectares (ha)"><input className={inputClass} type="number" step="0.01" value={form.hectares} onChange={(e) => update("hectares", e.target.value)} /></Field>
            <Field label="Tamanho Lote (ha)"><input className={inputClass} type="number" step="0.01" value={form.loteHa} onChange={(e) => update("loteHa", e.target.value)} /></Field>
            <Field label="Meses Cobrados"><input className={inputClass} type="number" step="1" value={form.meses} onChange={(e) => update("meses", e.target.value)} /></Field>
            
            <Field label="Valor Pago (R$)"><input className={inputClass} type="number" step="0.01" value={form.valorPago} onChange={(e) => update("valorPago", e.target.value)} /></Field>
            <Field label="Status Pagamento">
              <select className={inputClass} value={form.statusPagamento} onChange={(e) => update("statusPagamento", e.target.value)}>
                <option value="DEVENDO">DEVENDO</option>
                <option value="PARCIAL">PARCIAL</option>
                <option value="PAGO">PAGO</option>
              </select>
            </Field>
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="h-16 w-16 overflow-hidden rounded-2xl border border-dashed border-slate-500 bg-slate-900/50 flex items-center justify-center">
              {form.comprovante ? <img src={form.comprovante} alt="Recibo" className="h-full w-full object-cover" /> : <Upload size={20} className="text-slate-600" />}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900">
              <Upload size={18} /> Atualizar Recibo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
            </label>
            {form.comprovante && <button type="button" onClick={() => update("comprovante", "")} className="text-red-400 text-sm font-bold ml-2">Remover Anexo</button>}
          </div>

          <button disabled={saving} type="submit" className="mt-6 flex w-full justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-black text-white hover:bg-blue-500 disabled:opacity-50">
            <Save size={20} /> {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}