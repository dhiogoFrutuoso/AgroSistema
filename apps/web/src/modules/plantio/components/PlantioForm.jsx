import { PlusCircle, Upload } from "lucide-react";
import { useMemo, useState } from "react";

const initialState = {
  safra: "", fazenda: "", talhao: "", cultura: "Arroz", variedade: "", area: "",
  dataInicio: new Date().toISOString().slice(0, 10), dataFim: "", operador: "", maquina: "",
  sementes: "", insumos: "", custoMaquina: "", maoObra: "", outrosCustos: "",
  produtividadePrevista: "", status: "PLANEJADO", observacoes: "", anexo: ""
};

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-green-400/60";

function Field({ label, required, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label} {required && <span className="text-red-500">*</span>}</span>
      {children}
    </label>
  );
}

export default function PlantioForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);

  const custoTotal = useMemo(() => {
    return Number(form.sementes || 0) + Number(form.insumos || 0) + Number(form.custoMaquina || 0) + Number(form.maoObra || 0) + Number(form.outrosCustos || 0);
  }, [form]);

  function alterar(campo, valor) { setForm(prev => ({ ...prev, [campo]: valor })); }

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => alterar("anexo", reader.result);
    reader.readAsDataURL(file);
  }

  async function salvar(e) {
    e.preventDefault();
    if (!form.talhao || !form.area) return;
    setSaving(true);
    await onSubmit?.({ ...form, custoTotal });
    setForm(initialState);
    setSaving(false);
  }

  return (
    <form onSubmit={salvar} className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <h2 className="text-3xl font-black text-white">Formulário de Plantio</h2>
      <p className="mt-2 text-base text-slate-400">Safra, fazenda, talhão, custos e produtividade prevista.</p>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Safra" required><input required className={inputClass} value={form.safra} onChange={(e) => alterar("safra", e.target.value)} placeholder="Ex: 2026/2027" /></Field>
        <Field label="Fazenda" required><input required className={inputClass} value={form.fazenda} onChange={(e) => alterar("fazenda", e.target.value)} /></Field>
        <Field label="Talhão / Área" required><input required className={inputClass} value={form.talhao} onChange={(e) => alterar("talhao", e.target.value)} /></Field>
        <Field label="Área Plantada (ha)" required><input required type="number" step="0.01" className={inputClass} value={form.area} onChange={(e) => alterar("area", e.target.value)} /></Field>

        <Field label="Cultura"><input className={inputClass} value={form.cultura} onChange={(e) => alterar("cultura", e.target.value)} /></Field>
        <Field label="Variedade Semente"><input className={inputClass} value={form.variedade} onChange={(e) => alterar("variedade", e.target.value)} /></Field>
        <Field label="Data de Início" required><input type="date" required className={inputClass} value={form.dataInicio} onChange={(e) => alterar("dataInicio", e.target.value)} /></Field>
        <Field label="Data Prevista Fim"><input type="date" className={inputClass} value={form.dataFim} onChange={(e) => alterar("dataFim", e.target.value)} /></Field>

        <Field label="Operador Responsável"><input className={inputClass} value={form.operador} onChange={(e) => alterar("operador", e.target.value)} /></Field>
        <Field label="Máquina Principal"><input className={inputClass} value={form.maquina} onChange={(e) => alterar("maquina", e.target.value)} /></Field>
        <Field label="Produtividade Prevista (kg/ha)"><input type="number" step="0.01" className={inputClass} value={form.produtividadePrevista} onChange={(e) => alterar("produtividadePrevista", e.target.value)} /></Field>
        <Field label="Status Atual" required>
          <select className={inputClass} value={form.status} onChange={(e) => alterar("status", e.target.value)}>
            <option value="PLANEJADO">Planejado</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </Field>

        {/* Custos */}
        <Field label="Custo Sementes (R$)"><input type="number" step="0.01" className={inputClass} value={form.sementes} onChange={(e) => alterar("sementes", e.target.value)} /></Field>
        <Field label="Custo Insumos (R$)"><input type="number" step="0.01" className={inputClass} value={form.insumos} onChange={(e) => alterar("insumos", e.target.value)} /></Field>
        <Field label="Custo Máquina / Óleo (R$)"><input type="number" step="0.01" className={inputClass} value={form.custoMaquina} onChange={(e) => alterar("custoMaquina", e.target.value)} /></Field>
        <Field label="Custo Mão de Obra (R$)"><input type="number" step="0.01" className={inputClass} value={form.maoObra} onChange={(e) => alterar("maoObra", e.target.value)} /></Field>
        <Field label="Outros Custos (R$)"><input type="number" step="0.01" className={inputClass} value={form.outrosCustos} onChange={(e) => alterar("outrosCustos", e.target.value)} /></Field>
        
        <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-rose-500/10 p-3 text-center">
           <div><p className="text-xs text-rose-300 font-bold uppercase">Custo Total</p><p className="text-xl font-black text-white">R$ {custoTotal.toLocaleString("pt-BR", {minimumFractionDigits: 2})}</p></div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-dashed border-slate-500 bg-slate-900/50 flex items-center justify-center">
          {form.anexo ? <img src={form.anexo} alt="Anexo" className="h-full w-full object-cover" /> : <Upload size={20} className="text-slate-600" />}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900 transition-colors">
          <Upload size={18} /> Anexar Foto do Campo ou Nota
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
        </label>
        {form.anexo && <button type="button" onClick={() => alterar("anexo", "")} className="text-red-400 text-sm font-bold ml-2">Remover Anexo</button>}
      </div>

      <div className="mt-4">
        <Field label="Observações Livres"><textarea rows={2} className={inputClass} value={form.observacoes} onChange={(e) => alterar("observacoes", e.target.value)} /></Field>
      </div>

      <button disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-green-600 px-8 py-4 font-black text-white shadow-xl shadow-green-900/30 transition hover:bg-green-500 disabled:opacity-50">
        <PlusCircle size={20} /> {saving ? "Salvando..." : "Registrar Plantio"}
      </button>
    </form>
  );
}