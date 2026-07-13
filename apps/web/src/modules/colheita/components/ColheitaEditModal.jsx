import { Save, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-400/60";

function Field({ label, required, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label} {required && <span className="text-red-500">*</span>}</span>
      {children}
    </label>
  );
}

export default function ColheitaEditModal({ linha, onUpdate, onClose, talhoes, maquinas }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (linha) setForm({ ...linha }); }, [linha]);

  if (!form) return null;

  function update(field, value) { setForm((prev) => ({ ...prev, [field]: value })); }

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("ticketBalanca", reader.result);
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
          <div>
            <h2 className="text-2xl font-black text-white">Editar Registro de Colheita</h2>
            <p className="text-sm text-slate-400">Atualize pesos, áreas ou custos. Os totais serão recalculados automaticamente.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white hover:bg-white/20"><X size={24} /></button>
        </div>

        <form onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Safra" required><input required className={inputClass} value={form.safra} onChange={(e) => update("safra", e.target.value)} /></Field>
            <Field label="Fazenda" required><input required className={inputClass} value={form.fazenda} onChange={(e) => update("fazenda", e.target.value)} /></Field>
            <Field label="Talhão" required><input required list="talhoes-edit" className={inputClass} value={form.talhao} onChange={(e) => update("talhao", e.target.value)} /><datalist id="talhoes-edit">{talhoes?.map((t) => <option key={t.id || t.nome} value={t.nome || t.talhao || t.id} />)}</datalist></Field>
            <Field label="Área Colhida (ha)" required><input required className={inputClass} type="number" step="0.01" value={form.areaHa} onChange={(e) => update("areaHa", e.target.value)} /></Field>
            
            <Field label="Data Início" required><input required className={inputClass} type="date" value={form.dataInicio} onChange={(e) => update("dataInicio", e.target.value)} /></Field>
            <Field label="Data Fim"><input className={inputClass} type="date" value={form.dataFim || ""} onChange={(e) => update("dataFim", e.target.value)} /></Field>
            
            <Field label="Operador"><input className={inputClass} value={form.operador || ""} onChange={(e) => update("operador", e.target.value)} /></Field>
            <Field label="Máquina"><input list="maquinas-edit" className={inputClass} value={form.maquina || ""} onChange={(e) => update("maquina", e.target.value)} /><datalist id="maquinas-edit">{maquinas?.map((m) => <option key={m.id || m.nome} value={m.nome || m.modelo || m.id} />)}</datalist></Field>
            
            <Field label="Destino (Armazém)"><input className={inputClass} value={form.destino || ""} onChange={(e) => update("destino", e.target.value)} /></Field>
            <Field label="Caminhão / Placa"><input className={inputClass} value={form.caminhao || ""} onChange={(e) => update("caminhao", e.target.value)} /></Field>
            
            <Field label="Peso Bruto (kg)" required><input required className={inputClass} type="number" step="0.01" value={form.pesoBruto} onChange={(e) => update("pesoBruto", e.target.value)} /></Field>
            <Field label="Tara (kg)" required><input required className={inputClass} type="number" step="0.01" value={form.tara} onChange={(e) => update("tara", e.target.value)} /></Field>
            <Field label="Umidade (%)"><input className={inputClass} type="number" step="0.01" value={form.umidade || ""} onChange={(e) => update("umidade", e.target.value)} /></Field>
            
            <Field label="Status Atual" required>
              <select className={inputClass} value={form.status} onChange={(e) => update("status", e.target.value)}>
                <option value="PLANEJADA">Planejada</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="FINALIZADA">Finalizada</option>
                <option value="PAUSADA">Pausada</option>
              </select>
            </Field>

            <Field label="Custo Mão de Obra (R$)"><input className={inputClass} type="number" step="0.01" value={form.custoMaoObra || ""} onChange={(e) => update("custoMaoObra", e.target.value)} /></Field>
            <Field label="Custo Máquina (R$)"><input className={inputClass} type="number" step="0.01" value={form.custoMaquina || ""} onChange={(e) => update("custoMaquina", e.target.value)} /></Field>
            <Field label="Combustível (R$)"><input className={inputClass} type="number" step="0.01" value={form.custoCombustivel || ""} onChange={(e) => update("custoCombustivel", e.target.value)} /></Field>
            <Field label="Outros Custos (R$)"><input className={inputClass} type="number" step="0.01" value={form.outrosCustos || ""} onChange={(e) => update("outrosCustos", e.target.value)} /></Field>
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="h-16 w-16 overflow-hidden rounded-2xl border border-dashed border-slate-500 bg-slate-900/50 flex items-center justify-center">
              {form.ticketBalanca ? <img src={form.ticketBalanca} alt="Ticket" className="h-full w-full object-cover" /> : <Upload size={20} className="text-slate-600" />}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900 transition-colors">
              <Upload size={18} /> Atualizar Ticket / Comprovante
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
            </label>
            {form.ticketBalanca && <button type="button" onClick={() => update("ticketBalanca", "")} className="text-red-400 text-sm font-bold ml-2">Remover Anexo</button>}
          </div>

          <div className="mt-4">
            <Field label="Observações Livres"><textarea rows={2} className={inputClass} value={form.observacoes || ""} onChange={(e) => update("observacoes", e.target.value)} /></Field>
          </div>

          <button disabled={saving} type="submit" className="mt-6 flex w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-black text-white hover:bg-blue-500 transition-opacity disabled:opacity-50">
            <Save size={20} /> {saving ? "Calculando totais..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}