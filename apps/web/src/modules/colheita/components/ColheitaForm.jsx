import { Save, Upload } from "lucide-react";
import { useMemo, useState } from "react";

const initialForm = {
  safra: "",
  fazenda: "",
  talhao: "",
  cultura: "Arroz",
  variedade: "",
  areaHa: "",
  dataInicio: new Date().toISOString().slice(0, 10),
  dataFim: "",
  operador: "",
  maquina: "",
  destino: "",
  caminhao: "",
  pesoBruto: "",
  tara: "",
  umidade: "",
  custoMaoObra: "",
  custoMaquina: "",
  custoCombustivel: "",
  outrosCustos: "",
  status: "EM_ANDAMENTO",
  observacoes: "",
  ticketBalanca: ""
};

function Field({ label, required, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label} {required && <span className="text-red-500">*</span>}</span>
      {children}
    </label>
  );
}

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60";

export default function ColheitaForm({ onCreate, talhoes = [], maquinas = [] }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const calculos = useMemo(() => {
    const pesoLiquido = Math.max(0, Number(form.pesoBruto || 0) - Number(form.tara || 0));
    const area = Number(form.areaHa || 0);
    const produtividade = area > 0 ? pesoLiquido / area : 0;
    const custoTotal = Number(form.custoMaoObra || 0) + Number(form.custoMaquina || 0) + Number(form.custoCombustivel || 0) + Number(form.outrosCustos || 0);

    return { pesoLiquido, produtividade, custoTotal };
  }, [form]);

  function update(field, value) { setForm((prev) => ({ ...prev, [field]: value })); }

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("ticketBalanca", reader.result);
    reader.readAsDataURL(file);
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.fazenda || !form.talhao) return;
    setSaving(true);
    await onCreate?.({ ...form, ...calculos });
    setForm(initialForm);
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <h2 className="text-3xl font-black text-white">Formulário de Colheita</h2>
      <p className="mt-2 text-base text-slate-400">Cadastre a área, produção, maquinário e ticket da balança.</p>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Safra" required><input required className={inputClass} value={form.safra} onChange={(e) => update("safra", e.target.value)} placeholder="Ex: 2025/2026" /></Field>
        <Field label="Fazenda" required><input required className={inputClass} value={form.fazenda} onChange={(e) => update("fazenda", e.target.value)} placeholder="Nome da Fazenda" /></Field>
        <Field label="Talhão" required>
          <input required list="talhoes-colheita" className={inputClass} value={form.talhao} onChange={(e) => update("talhao", e.target.value)} placeholder="Área colhida" />
          <datalist id="talhoes-colheita">{talhoes.map((t) => <option key={t.id || t.nome} value={t.nome || t.talhao || t.id} />)}</datalist>
        </Field>
        
        <Field label="Área Colhida (ha)" required><input required className={inputClass} type="number" step="0.01" value={form.areaHa} onChange={(e) => update("areaHa", e.target.value)} placeholder="0.00" /></Field>
        
        <Field label="Data Início" required><input required className={inputClass} type="date" value={form.dataInicio} onChange={(e) => update("dataInicio", e.target.value)} /></Field>
        <Field label="Data Fim"><input className={inputClass} type="date" value={form.dataFim} onChange={(e) => update("dataFim", e.target.value)} /></Field>
        
        <Field label="Operador"><input className={inputClass} value={form.operador} onChange={(e) => update("operador", e.target.value)} placeholder="Nome do Operador" /></Field>
        <Field label="Máquina">
          <input list="maquinas-colheita" className={inputClass} value={form.maquina} onChange={(e) => update("maquina", e.target.value)} placeholder="Colheitadeira" />
          <datalist id="maquinas-colheita">{maquinas.map((m) => <option key={m.id || m.nome} value={m.nome || m.modelo || m.id} />)}</datalist>
        </Field>
        
        <Field label="Cultura"><input className={inputClass} value={form.cultura} onChange={(e) => update("cultura", e.target.value)} /></Field>
        <Field label="Variedade da Semente"><input className={inputClass} value={form.variedade} onChange={(e) => update("variedade", e.target.value)} placeholder="Ex: IRGA 424" /></Field>

        <Field label="Destino (Armazém)"><input className={inputClass} value={form.destino} onChange={(e) => update("destino", e.target.value)} placeholder="Silo / Empresa" /></Field>
        <Field label="Caminhão / Placa"><input className={inputClass} value={form.caminhao} onChange={(e) => update("caminhao", e.target.value)} placeholder="Transporte" /></Field>
        
        <Field label="Peso Bruto (kg)" required><input required className={inputClass} type="number" step="0.01" value={form.pesoBruto} onChange={(e) => update("pesoBruto", e.target.value)} placeholder="Caminhão cheio" /></Field>
        <Field label="Tara (kg)" required><input required className={inputClass} type="number" step="0.01" value={form.tara} onChange={(e) => update("tara", e.target.value)} placeholder="Caminhão vazio" /></Field>
        <Field label="Umidade (%)"><input className={inputClass} type="number" step="0.01" value={form.umidade} onChange={(e) => update("umidade", e.target.value)} placeholder="13.0" /></Field>
        
        <Field label="Status Atual" required>
          <select className={inputClass} value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option value="PLANEJADA">Planejada</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="FINALIZADA">Finalizada (Colhida)</option>
            <option value="PAUSADA">Pausada (Chuva/Quebra)</option>
          </select>
        </Field>

        <Field label="Custo Mão de Obra (R$)"><input className={inputClass} type="number" step="0.01" value={form.custoMaoObra} onChange={(e) => update("custoMaoObra", e.target.value)} /></Field>
        <Field label="Custo Máquina (R$)"><input className={inputClass} type="number" step="0.01" value={form.custoMaquina} onChange={(e) => update("custoMaquina", e.target.value)} /></Field>
        <Field label="Combustível (R$)"><input className={inputClass} type="number" step="0.01" value={form.custoCombustivel} onChange={(e) => update("custoCombustivel", e.target.value)} /></Field>
        <Field label="Outros Custos (R$)"><input className={inputClass} type="number" step="0.01" value={form.outrosCustos} onChange={(e) => update("outrosCustos", e.target.value)} /></Field>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-blue-500/10 p-5 text-blue-100">Peso Líquido Calculado<br /><b className="text-3xl text-blue-400">{calculos.pesoLiquido.toLocaleString("pt-BR")} kg</b></div>
        <div className="rounded-3xl border border-white/10 bg-amber-500/10 p-5 text-amber-100">Produtividade Estimada<br /><b className="text-3xl text-amber-400">{calculos.produtividade.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg/ha</b></div>
        <div className="rounded-3xl border border-white/10 bg-rose-500/10 p-5 text-rose-100">Custo Total Operação<br /><b className="text-3xl text-rose-400">{calculos.custoTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</b></div>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-dashed border-slate-500 bg-slate-900/50 flex items-center justify-center">
          {form.ticketBalanca ? <img src={form.ticketBalanca} alt="Ticket" className="h-full w-full object-cover" /> : <Upload size={20} className="text-slate-600" />}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900 transition-colors">
          <Upload size={18} /> Anexar Ticket de Balança / Comprovante
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
        </label>
        {form.ticketBalanca && <button type="button" onClick={() => update("ticketBalanca", "")} className="text-red-400 text-sm font-bold ml-2">Remover Anexo</button>}
      </div>

      <div className="mt-4">
        <Field label="Observações Livres">
          <textarea className={`${inputClass} min-h-24`} value={form.observacoes} onChange={(e) => update("observacoes", e.target.value)} placeholder="Anote problemas técnicos, chuva, etc..." />
        </Field>
      </div>

      <button disabled={saving} className="mt-6 inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-black text-white shadow-xl shadow-blue-900/30 transition hover:bg-blue-500 disabled:opacity-50">
        <Save size={20} /> {saving ? "Salvando..." : "Salvar Registro de Colheita"}
      </button>
    </form>
  );
}