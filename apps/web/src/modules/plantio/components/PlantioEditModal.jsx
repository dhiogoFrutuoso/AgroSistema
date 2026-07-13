import { Save, Upload, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-green-400/60";

function Field({ label, required, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label} {required && <span className="text-red-500">*</span>}</span>
      {children}
    </label>
  );
}

export default function PlantioEditModal({ linha, onUpdate, onClose }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (linha) setForm({ ...linha }); }, [linha]);

  const custoTotal = useMemo(() => {
    if (!form) return 0;
    return Number(form.sementes || 0) + Number(form.insumos || 0) + Number(form.custoMaquina || 0) + Number(form.maoObra || 0) + Number(form.outrosCustos || 0);
  }, [form]);

  if (!form) return null;

  function update(field, value) { setForm((prev) => ({ ...prev, [field]: value })); }

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("anexo", reader.result);
    reader.readAsDataURL(file);
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    await onUpdate(form.id || form._id, { ...form, custoTotal });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative my-8 w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Editar Registro de Plantio</h2>
            <p className="text-sm text-slate-400">Os totais de custo serão recalculados automaticamente.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white hover:bg-white/20"><X size={24} /></button>
        </div>

        <form onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Safra" required><input required className={inputClass} value={form.safra} onChange={(e) => update("safra", e.target.value)} /></Field>
            <Field label="Fazenda" required><input required className={inputClass} value={form.fazenda} onChange={(e) => update("fazenda", e.target.value)} /></Field>
            <Field label="Talhão / Área" required><input required className={inputClass} value={form.talhao} onChange={(e) => update("talhao", e.target.value)} /></Field>
            <Field label="Área Plantada (ha)" required><input required type="number" step="0.01" className={inputClass} value={form.area} onChange={(e) => update("area", e.target.value)} /></Field>
            
            <Field label="Cultura"><input className={inputClass} value={form.cultura} onChange={(e) => update("cultura", e.target.value)} /></Field>
            <Field label="Variedade Semente"><input className={inputClass} value={form.variedade || ""} onChange={(e) => update("variedade", e.target.value)} /></Field>
            <Field label="Data de Início" required><input type="date" required className={inputClass} value={form.dataInicio} onChange={(e) => update("dataInicio", e.target.value)} /></Field>
            <Field label="Data Fim"><input type="date" className={inputClass} value={form.dataFim || ""} onChange={(e) => update("dataFim", e.target.value)} /></Field>
            
            <Field label="Operador"><input className={inputClass} value={form.operador || ""} onChange={(e) => update("operador", e.target.value)} /></Field>
            <Field label="Máquina Principal"><input className={inputClass} value={form.maquina || ""} onChange={(e) => update("maquina", e.target.value)} /></Field>
            <Field label="Produtividade (kg/ha)"><input type="number" step="0.01" className={inputClass} value={form.produtividadePrevista || ""} onChange={(e) => update("produtividadePrevista", e.target.value)} /></Field>
            
            <Field label="Status Atual" required>
              <select className={inputClass} value={form.status} onChange={(e) => update("status", e.target.value)}>
                <option value="PLANEJADO">Planejado</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="CONCLUIDO">Concluído</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </Field>

            <Field label="Custo Sementes (R$)"><input type="number" step="0.01" className={inputClass} value={form.sementes || ""} onChange={(e) => update("sementes", e.target.value)} /></Field>
            <Field label="Custo Insumos (R$)"><input type="number" step="0.01" className={inputClass} value={form.insumos || ""} onChange={(e) => update("insumos", e.target.value)} /></Field>
            <Field label="Custo Máquina (R$)"><input type="number" step="0.01" className={inputClass} value={form.custoMaquina || ""} onChange={(e) => update("custoMaquina", e.target.value)} /></Field>
            <Field label="Mão de Obra (R$)"><input type="number" step="0.01" className={inputClass} value={form.maoObra || ""} onChange={(e) => update("maoObra", e.target.value)} /></Field>
            <Field label="Outros Custos (R$)"><input type="number" step="0.01" className={inputClass} value={form.outrosCustos || ""} onChange={(e) => update("outrosCustos", e.target.value)} /></Field>
            
            <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-rose-500/10 p-3 text-center">
              <div><p className="text-[10px] text-rose-300 font-bold uppercase">Custo Total Atualizado</p><p className="text-xl font-black text-white">R$ {custoTotal.toLocaleString("pt-BR", {minimumFractionDigits: 2})}</p></div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="h-16 w-16 overflow-hidden rounded-2xl border border-dashed border-slate-500 bg-slate-900/50 flex items-center justify-center">
              {form.anexo ? <img src={form.anexo} alt="Anexo" className="h-full w-full object-cover" /> : <Upload size={20} className="text-slate-600" />}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900 transition-colors">
              <Upload size={18} /> Atualizar Foto / Anexo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
            </label>
            {form.anexo && <button type="button" onClick={() => update("anexo", "")} className="text-red-400 text-sm font-bold ml-2">Remover Anexo</button>}
          </div>

          <div className="mt-4">
            <Field label="Observações Livres"><textarea rows={2} className={inputClass} value={form.observacoes || ""} onChange={(e) => update("observacoes", e.target.value)} /></Field>
          </div>

          <button disabled={saving} type="submit" className="mt-6 flex w-full md:w-auto justify-center gap-2 rounded-2xl bg-green-600 px-8 py-4 font-black text-white hover:bg-green-500 disabled:opacity-50 transition-opacity">
            <Save size={20} /> {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}