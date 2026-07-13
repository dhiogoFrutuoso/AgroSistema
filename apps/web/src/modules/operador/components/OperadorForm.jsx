import { PlusCircle } from "lucide-react";
import { useState } from "react";

const initialState = {
  data: new Date().toISOString().slice(0, 10),
  nomeOperador: "",
  maquinaAgricola: "",
  cliente: "",
  fazenda: "",
  talhao: "",
  servico: "",
  horaInicio: "07:00",
  horaFim: "17:00",
  valorHorario: "",
  litrosOleo: "",
  valorLitroOleo: "",
  outrosGastos: "",
  tipoLancamentoFinanceiro: "RECEITA",
  status: "ABERTO",
  observacoes: ""
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

export default function OperadorForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);

  function alterar(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
  }

  async function salvar(e) {
    e.preventDefault();
    if (!form.nomeOperador || !form.cliente) return;
    setSaving(true);
    await onSubmit?.(form);
    setForm(initialState);
    setSaving(false);
  }

  return (
    <form onSubmit={salvar} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Registrar Serviço (Operador)</h2>
        <p className="mt-1 text-sm text-slate-400">Preencha as horas trabalhadas para calcular automaticamente os lucros e custos.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Data" required><input type="date" required className={inputClass} value={form.data} onChange={(e) => alterar("data", e.target.value)} /></Field>
        <Field label="Nome do Operador" required><input required className={inputClass} value={form.nomeOperador} onChange={(e) => alterar("nomeOperador", e.target.value)} placeholder="Ex: João Silva" /></Field>
        <Field label="Máquina" required><input required className={inputClass} value={form.maquinaAgricola} onChange={(e) => alterar("maquinaAgricola", e.target.value)} placeholder="Ex: Trator MF 4292" /></Field>
        <Field label="Cliente" required><input required className={inputClass} value={form.cliente} onChange={(e) => alterar("cliente", e.target.value)} placeholder="Nome do contratante" /></Field>

        <Field label="Fazenda"><input className={inputClass} value={form.fazenda} onChange={(e) => alterar("fazenda", e.target.value)} placeholder="Fazenda do cliente" /></Field>
        <Field label="Talhão"><input className={inputClass} value={form.talhao} onChange={(e) => alterar("talhao", e.target.value)} placeholder="Identificação da área" /></Field>
        <Field label="Serviço Realizado" required><input required className={inputClass} value={form.servico} onChange={(e) => alterar("servico", e.target.value)} placeholder="Ex: Gradeação, Plantio..." /></Field>
        
        <Field label="Valor por Hora (R$)" required><input required type="number" step="0.01" className={inputClass} value={form.valorHorario} onChange={(e) => alterar("valorHorario", e.target.value)} placeholder="Ex: 250.00" /></Field>
        
        <Field label="Hora Início" required><input required type="time" className={inputClass} value={form.horaInicio} onChange={(e) => alterar("horaInicio", e.target.value)} /></Field>
        <Field label="Hora Fim" required><input required type="time" className={inputClass} value={form.horaFim} onChange={(e) => alterar("horaFim", e.target.value)} /></Field>
        
        <Field label="Combustível Gasto (Litros)"><input type="number" step="0.1" className={inputClass} value={form.litrosOleo} onChange={(e) => alterar("litrosOleo", e.target.value)} placeholder="Total de litros" /></Field>
        <Field label="Valor do Litro (R$)"><input type="number" step="0.01" className={inputClass} value={form.valorLitroOleo} onChange={(e) => alterar("valorLitroOleo", e.target.value)} placeholder="Preço pago no posto" /></Field>
        <Field label="Outros Gastos (R$)"><input type="number" step="0.01" className={inputClass} value={form.outrosGastos} onChange={(e) => alterar("outrosGastos", e.target.value)} placeholder="Alimentação, peças rápidas..." /></Field>

        <Field label="Financeiro" required>
          <select className={inputClass} value={form.tipoLancamentoFinanceiro} onChange={(e) => alterar("tipoLancamentoFinanceiro", e.target.value)}>
            <option value="RECEITA">RECEITA (Entrada)</option>
            <option value="DESPESA">DESPESA (Saída)</option>
          </select>
        </Field>

        <Field label="Status Inicial" required>
          <select className={inputClass} value={form.status} onChange={(e) => alterar("status", e.target.value)}>
            <option value="ABERTA">Aberto / Pendente</option>
            <option value="PAGO">Pago</option>
          </select>
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Observações Livres">
          <textarea rows={2} className={inputClass} value={form.observacoes} onChange={(e) => alterar("observacoes", e.target.value)} placeholder="Algum detalhe do serviço..." />
        </Field>
      </div>

      <button disabled={saving} type="submit" className="mt-6 flex w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 px-8 py-4 font-black text-white transition-opacity hover:opacity-90 disabled:opacity-50">
        <PlusCircle size={20} /> {saving ? "Salvando..." : "Registrar Serviço"}
      </button>
    </form>
  );
}