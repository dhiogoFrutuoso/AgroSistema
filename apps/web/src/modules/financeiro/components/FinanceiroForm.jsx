import { PlusCircle, Upload } from "lucide-react";
import { useState } from "react";

const initialState = {
  descricao: "",
  tipo: "DESPESA",
  categoria: "",
  valor: "",
  dataLancamento: new Date().toISOString().slice(0, 10),
  dataVencimento: "",
  status: "PENDENTE",
  formaPagamento: "PIX",
  fornecedor: "",
  centroCusto: "Geral",
  contaBancaria: "Caixa Central",
  competencia: new Date().toISOString().slice(0, 7),
  fazenda: "",
  talhao: "",
  responsavel: "",
  observacoes: "",
  comprovante: ""
};

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/60";

function Field({ label, required, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

export default function FinanceiroForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleFileUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField("comprovante", reader.result);
    reader.readAsDataURL(file);
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.descricao || !form.valor) return;

    setSaving(true);
    await onSubmit?.({ ...form, valor: Number(form.valor) });
    setForm(initialState);
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Novo Lançamento Detalhado</h2>
        <p className="mt-1 text-sm text-slate-400">Cadastro de receitas e despesas com vínculo a centros de custo e notas.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Descrição / Título" required>
          <input required className={inputClass} value={form.descricao} onChange={(e) => updateField("descricao", e.target.value)} placeholder="Ex: Adubo NPK" />
        </Field>
        
        <Field label="Tipo da Transação" required>
          <select className={`${inputClass} font-black ${form.tipo === 'RECEITA' ? 'text-green-400' : 'text-red-400'}`} value={form.tipo} onChange={(e) => updateField("tipo", e.target.value)}>
            <option value="DESPESA">SAÍDA (Despesa)</option>
            <option value="RECEITA">ENTRADA (Receita)</option>
          </select>
        </Field>

        <Field label="Valor (R$)" required>
          <input required type="number" step="0.01" className={inputClass} value={form.valor} onChange={(e) => updateField("valor", e.target.value)} placeholder="0.00" />
        </Field>

        <Field label="Status" required>
          <select className={inputClass} value={form.status} onChange={(e) => updateField("status", e.target.value)}>
            <option value="PENDENTE">Pendente</option>
            <option value="PAGO">Pago / Recebido</option>
            <option value="ATRASADO">Atrasado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </Field>

        <Field label="Data do Lançamento">
          <input type="date" className={inputClass} value={form.dataLancamento} onChange={(e) => updateField("dataLancamento", e.target.value)} />
        </Field>

        <Field label="Data de Vencimento">
          <input type="date" className={inputClass} value={form.dataVencimento} onChange={(e) => updateField("dataVencimento", e.target.value)} />
        </Field>

        <Field label="Cliente / Fornecedor">
          <input className={inputClass} value={form.fornecedor} onChange={(e) => updateField("fornecedor", e.target.value)} placeholder="Nome da empresa ou pessoa" />
        </Field>

        <Field label="Categoria">
          <input className={inputClass} value={form.categoria} onChange={(e) => updateField("categoria", e.target.value)} placeholder="Ex: Insumos, Manutenção, Venda..." />
        </Field>

        <Field label="Centro de Custo">
          <input className={inputClass} value={form.centroCusto} onChange={(e) => updateField("centroCusto", e.target.value)} placeholder="Ex: Frota, Sede, Lavoura..." />
        </Field>

        <Field label="Conta Bancária">
          <select className={inputClass} value={form.contaBancaria} onChange={(e) => updateField("contaBancaria", e.target.value)}>
            <option value="Caixa Central">Caixa Central (Dinheiro)</option>
            <option value="Banco do Brasil">Banco do Brasil</option>
            <option value="Nubank">Nubank</option>
            <option value="Sicredi">Sicredi</option>
          </select>
        </Field>

        <Field label="Forma de Pagamento">
          <select className={inputClass} value={form.formaPagamento} onChange={(e) => updateField("formaPagamento", e.target.value)}>
            <option value="PIX">PIX</option>
            <option value="Boleto">Boleto</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão">Cartão</option>
            <option value="Transferência">Transferência Bancária</option>
          </select>
        </Field>

        <Field label="Competência (Mês Referência)">
          <input type="month" className={inputClass} value={form.competencia} onChange={(e) => updateField("competencia", e.target.value)} />
        </Field>

        <Field label="Fazenda (Vínculo)">
          <input className={inputClass} value={form.fazenda} onChange={(e) => updateField("fazenda", e.target.value)} placeholder="Opcional" />
        </Field>

        <Field label="Talhão (Vínculo)">
          <input className={inputClass} value={form.talhao} onChange={(e) => updateField("talhao", e.target.value)} placeholder="Opcional" />
        </Field>
      </div>

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-dashed border-slate-500 bg-slate-900/50 flex items-center justify-center">
          {form.comprovante ? <img src={form.comprovante} alt="Nota" className="h-full w-full object-cover" /> : <Upload size={20} className="text-slate-600" />}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900 transition-colors">
          <Upload size={18} /> Anexar Nota Fiscal / Comprovante
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0])} />
        </label>
        {form.comprovante && <button type="button" onClick={() => updateField("comprovante", "")} className="text-red-400 text-sm font-bold ml-2">Remover Anexo</button>}
      </div>

      <div className="mt-4">
        <Field label="Observações Livres">
          <textarea rows={3} className={inputClass} value={form.observacoes} onChange={(e) => updateField("observacoes", e.target.value)} placeholder="Detalhes adicionais..." />
        </Field>
      </div>

      <button disabled={saving} type="submit" className="mt-6 flex w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-4 font-black text-white transition-opacity hover:opacity-90 disabled:opacity-50">
        <PlusCircle size={20} /> {saving ? "Salvando..." : "Salvar Lançamento"}
      </button>
    </form>
  );
}