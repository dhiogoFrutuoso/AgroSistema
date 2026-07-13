import { Calculator, Save, Upload } from "lucide-react";
import { useMemo, useState } from "react";

const initialForm = {
  empresaAgua: "", responsavelEmpresa: "", telefoneEmpresa: "", documentoEmpresa: "",
  mesReferencia: new Date().toISOString().slice(0, 7), dataLancamento: new Date().toISOString().slice(0, 10),
  vincularTalhao: false, talhaoId: "", talhaoNome: "", fazenda: "", cultura: "Arroz", safra: "",
  rotaParaTalhao: false, observacoesRota: "", valorHa: 500, hectares: 5, loteHa: 5, meses: 1, valorPago: 0,
  statusPagamento: "DEVENDO", statusOperacao: "ATIVA", observacoes: "", comprovante: ""
};

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60";

function Field({ label, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function money(v) { return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

export default function IrrigacaoForm({ onCreate, talhoes = [] }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const calc = useMemo(() => {
    const valorHa = Number(form.valorHa || 0); const hectares = Number(form.hectares || 0);
    const loteHa = Number(form.loteHa || 5); const meses = Number(form.meses || 1);
    const lotes = loteHa > 0 ? Math.ceil(hectares / loteHa) : 0;
    const valorMensal = hectares * valorHa; const valorTotal = valorMensal * meses;
    const valorPago = Number(form.valorPago || 0); const valorDevido = Math.max(0, valorTotal - valorPago);
    return { lotes, valorMensal, valorTotal, valorDevido };
  }, [form]);

  function update(field, value) { setForm((prev) => ({ ...prev, [field]: value })); }

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("comprovante", reader.result);
    reader.readAsDataURL(file);
  }

  function selecionarTalhao(id) {
    const item = talhoes.find((t) => String(t.id) === String(id));
    setForm((prev) => ({
      ...prev, talhaoId: id, talhaoNome: item?.nome || item?.talhao || item?.talhaoNome || "",
      fazenda: item?.fazenda || prev.fazenda, cultura: item?.cultura || prev.cultura, hectares: item?.areaHa || item?.area || prev.hectares
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    await onCreate({ ...form, ...calc, statusPagamento: calc.valorDevido <= 0 ? "PAGO" : form.statusPagamento });
    setForm(initialForm);
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <h2 className="text-3xl font-black text-white">Formulário de Irrigação (Agranel)</h2>
      <p className="mt-2 text-base text-slate-400">Cadastre a empresa de água, lotes e pagamentos.</p>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Empresa de Água"><input required className={inputClass} value={form.empresaAgua} onChange={(e) => update("empresaAgua", e.target.value)} placeholder="Nome da empresa" /></Field>
        <Field label="Responsável"><input className={inputClass} value={form.responsavelEmpresa} onChange={(e) => update("responsavelEmpresa", e.target.value)} /></Field>
        <Field label="Telefone"><input className={inputClass} value={form.telefoneEmpresa} onChange={(e) => update("telefoneEmpresa", e.target.value)} /></Field>
        <Field label="Documento"><input className={inputClass} value={form.documentoEmpresa} onChange={(e) => update("documentoEmpresa", e.target.value)} placeholder="CPF/CNPJ" /></Field>

        <Field label="Mês Referência"><input className={inputClass} type="month" value={form.mesReferencia} onChange={(e) => update("mesReferencia", e.target.value)} /></Field>
        <Field label="Data Lançamento"><input className={inputClass} type="date" value={form.dataLancamento} onChange={(e) => update("dataLancamento", e.target.value)} /></Field>
        <Field label="Safra"><input className={inputClass} value={form.safra} onChange={(e) => update("safra", e.target.value)} placeholder="2026/2027" /></Field>
        <Field label="Cultura"><input className={inputClass} value={form.cultura} onChange={(e) => update("cultura", e.target.value)} /></Field>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/40 p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div><h3 className="text-xl font-black text-white">Vínculo com Talhão</h3></div>
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white">
            <input type="checkbox" checked={form.vincularTalhao} onChange={(e) => update("vincularTalhao", e.target.checked)} />
            Vincular talhão do GPS
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {form.vincularTalhao ? (
            <Field label="Selecionar talhão">
              <select className={inputClass} value={form.talhaoId} onChange={(e) => selecionarTalhao(e.target.value)}>
                <option value="">Selecione...</option>
                {talhoes.map((t) => <option key={t.id || t.nome} value={t.id || t._id}>{t.nome || t.talhao || t.id}</option>)}
              </select>
            </Field>
          ) : (
            <Field label="Nome do Talhão"><input className={inputClass} value={form.talhaoNome} onChange={(e) => update("talhaoNome", e.target.value)} /></Field>
          )}

          <Field label="Fazenda"><input className={inputClass} value={form.fazenda} onChange={(e) => update("fazenda", e.target.value)} /></Field>
          <Field label="Tem Rota Própria?"><select className={inputClass} value={form.rotaParaTalhao ? "SIM" : "NAO"} onChange={(e) => update("rotaParaTalhao", e.target.value === "SIM")}><option value="NAO">NÃO</option><option value="SIM">SIM</option></select></Field>
          <Field label="Observação da Rota"><input className={inputClass} value={form.observacoesRota} onChange={(e) => update("observacoesRota", e.target.value)} /></Field>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Field label="Valor por Hectare (R$)"><input className={inputClass} type="number" step="0.01" value={form.valorHa} onChange={(e) => update("valorHa", e.target.value)} /></Field>
        <Field label="Hectares (ha)"><input className={inputClass} type="number" step="0.01" value={form.hectares} onChange={(e) => update("hectares", e.target.value)} /></Field>
        <Field label="Tamanho Lote (ha)"><input className={inputClass} type="number" step="0.01" value={form.loteHa} onChange={(e) => update("loteHa", e.target.value)} /></Field>
        <Field label="Meses Cobrados"><input className={inputClass} type="number" step="1" value={form.meses} onChange={(e) => update("meses", e.target.value)} /></Field>
        <Field label="Valor Pago (R$)"><input className={inputClass} type="number" step="0.01" value={form.valorPago} onChange={(e) => update("valorPago", e.target.value)} /></Field>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-blue-500/10 p-5 text-blue-100"><Calculator size={22} /><p className="mt-2">Lotes</p><b className="text-2xl text-white">{calc.lotes}</b></div>
        <div className="rounded-3xl border border-white/10 bg-cyan-500/10 p-5 text-cyan-100">Valor Mensal<br /><b className="text-2xl text-white">{money(calc.valorMensal)}</b></div>
        <div className="rounded-3xl border border-white/10 bg-rose-500/10 p-5 text-rose-100">Valor Total<br /><b className="text-2xl text-white">{money(calc.valorTotal)}</b></div>
        <div className="rounded-3xl border border-white/10 bg-amber-500/10 p-5 text-amber-100">Valor Devendo<br /><b className="text-2xl text-white">{money(calc.valorDevido)}</b></div>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-dashed border-slate-500 bg-slate-900/50 flex items-center justify-center">
          {form.comprovante ? <img src={form.comprovante} alt="Recibo" className="h-full w-full object-cover" /> : <Upload size={20} className="text-slate-600" />}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900">
          <Upload size={18} /> Anexar Recibo / Contrato
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
        </label>
        {form.comprovante && <button type="button" onClick={() => update("comprovante", "")} className="text-red-400 text-sm font-bold ml-2">Remover Anexo</button>}
      </div>

      <button disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-black text-white hover:bg-blue-500 disabled:opacity-50">
        <Save size={20} /> {saving ? "Salvando..." : "Salvar Irrigação"}
      </button>
    </form>
  );
}