import { Save, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

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

export default function FinanceiroEditModal({ lancamento, onUpdate, onClose }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (lancamento) setForm({ ...lancamento });
  }, [lancamento]);

  if (!form) return null;

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField("comprovante", reader.result);
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
            <h2 className="text-2xl font-black text-white">Editar Lançamento</h2>
            <p className="text-sm text-slate-400">Atualize informações e status de pagamento.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white hover:bg-white/20">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Descrição / Título" required><input required className={inputClass} value={form.descricao || ""} onChange={(e) => updateField("descricao", e.target.value)} /></Field>
            
            <Field label="Tipo da Transação" required>
              <select className={`${inputClass} font-black ${form.tipo === 'RECEITA' ? 'text-green-400' : 'text-red-400'}`} value={form.tipo || "DESPESA"} onChange={(e) => updateField("tipo", e.target.value)}>
                <option value="DESPESA">SAÍDA (Despesa)</option>
                <option value="RECEITA">ENTRADA (Receita)</option>
              </select>
            </Field>

            <Field label="Valor (R$)" required><input required type="number" step="0.01" className={inputClass} value={form.valor || ""} onChange={(e) => updateField("valor", e.target.value)} /></Field>

            <Field label="Status" required>
              <select className={inputClass} value={form.status || "PENDENTE"} onChange={(e) => updateField("status", e.target.value)}>
                <option value="PENDENTE">Pendente</option>
                <option value="PAGO">Pago / Recebido</option>
                <option value="ATRASADO">Atrasado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </Field>

            <Field label="Data do Lançamento"><input type="date" className={inputClass} value={form.dataLancamento || ""} onChange={(e) => updateField("dataLancamento", e.target.value)} /></Field>
            <Field label="Data de Vencimento"><input type="date" className={inputClass} value={form.dataVencimento || ""} onChange={(e) => updateField("dataVencimento", e.target.value)} /></Field>
            <Field label="Cliente / Fornecedor"><input className={inputClass} value={form.fornecedor || ""} onChange={(e) => updateField("fornecedor", e.target.value)} /></Field>
            <Field label="Categoria"><input className={inputClass} value={form.categoria || ""} onChange={(e) => updateField("categoria", e.target.value)} /></Field>
            
            <Field label="Centro de Custo"><input className={inputClass} value={form.centroCusto || ""} onChange={(e) => updateField("centroCusto", e.target.value)} /></Field>
            <Field label="Conta Bancária">
              <select className={inputClass} value={form.contaBancaria || "Caixa Central"} onChange={(e) => updateField("contaBancaria", e.target.value)}>
                <option value="Caixa Central">Caixa Central (Dinheiro)</option>
                <option value="Banco do Brasil">Banco do Brasil</option>
                <option value="Nubank">Nubank</option>
                <option value="Sicredi">Sicredi</option>
              </select>
            </Field>
            
            <Field label="Forma de Pagamento">
              <select className={inputClass} value={form.formaPagamento || "Dinheiro"} onChange={(e) => updateField("formaPagamento", e.target.value)}>
                <option value="PIX">PIX</option>
                <option value="Boleto">Boleto</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão">Cartão</option>
                <option value="Transferência">Transferência</option>
              </select>
            </Field>
            
            <Field label="Competência (Mês)"><input type="month" className={inputClass} value={form.competencia || ""} onChange={(e) => updateField("competencia", e.target.value)} /></Field>
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="h-16 w-16 overflow-hidden rounded-2xl border border-dashed border-slate-500 bg-slate-900/50 flex items-center justify-center">
              {form.comprovante && form.comprovante.length > 50 ? <img src={form.comprovante} alt="Nota" className="h-full w-full object-cover" /> : <Upload size={20} className="text-slate-600" />}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900 transition-colors">
              <Upload size={18} /> Atualizar Nota / Comprovante
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0])} />
            </label>
            {form.comprovante && <button type="button" onClick={() => updateField("comprovante", "")} className="text-red-400 text-sm font-bold ml-2">Remover Anexo</button>}
          </div>

          <div className="mt-4">
            <Field label="Observações Livres">
              <textarea rows={3} className={inputClass} value={form.observacoes || ""} onChange={(e) => updateField("observacoes", e.target.value)} />
            </Field>
          </div>

          <button disabled={saving} type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 font-black text-slate-950 hover:bg-emerald-400 transition-opacity disabled:opacity-50">
            <Save size={20} /> {saving ? "Atualizando..." : "Salvar alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}