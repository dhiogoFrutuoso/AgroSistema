import { PlusCircle, Upload } from "lucide-react";
import { useState } from "react";

const initialState = {
  codigo: "",
  nome: "",
  marca: "",
  modelo: "",
  ano: "",
  placa: "",
  operador: "",
  fazenda: "",
  talhao: "",
  horimetro: "",
  combustivel: "Diesel",
  consumo: "",
  status: "DISPONIVEL",
  observacoes: "",
  imagemMaquina: ""
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

export default function MaquinasForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);

  function alterar(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
  }

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => alterar("imagemMaquina", reader.result);
    reader.readAsDataURL(file);
  }

  async function salvar(e) {
    e.preventDefault();
    if (!form.nome) return;

    setSaving(true);
    await onSubmit?.({
      ...form,
      horimetro: Number(form.horimetro || 0),
      consumo: Number(form.consumo || 0)
    });
    setForm(initialState);
    setSaving(false);
  }

  return (
    <form onSubmit={salvar} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Cadastro de Máquinas</h2>
        <p className="mt-1 text-sm text-slate-400">Registre tratores, colheitadeiras e implementos.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Nome / Apelido" required><input required value={form.nome} onChange={(e) => alterar("nome", e.target.value)} placeholder="Ex: Trator John Deere" className={inputClass} /></Field>
        <Field label="Código / Frota"><input value={form.codigo} onChange={(e) => alterar("codigo", e.target.value)} placeholder="Ex: TR-01" className={inputClass} /></Field>
        <Field label="Marca"><input value={form.marca} onChange={(e) => alterar("marca", e.target.value)} placeholder="Ex: Massey Ferguson" className={inputClass} /></Field>
        <Field label="Modelo"><input value={form.modelo} onChange={(e) => alterar("modelo", e.target.value)} placeholder="Ex: MF 4292" className={inputClass} /></Field>
        
        <Field label="Ano"><input type="number" value={form.ano} onChange={(e) => alterar("ano", e.target.value)} placeholder="Ex: 2018" className={inputClass} /></Field>
        <Field label="Placa"><input value={form.placa} onChange={(e) => alterar("placa", e.target.value)} placeholder="ABC-1234" className={inputClass} /></Field>
        <Field label="Operador Principal"><input value={form.operador} onChange={(e) => alterar("operador", e.target.value)} placeholder="Nome do motorista" className={inputClass} /></Field>
        <Field label="Combustível">
          <select value={form.combustivel} onChange={(e) => alterar("combustivel", e.target.value)} className={inputClass}>
            <option value="Diesel">Diesel</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Etanol">Etanol</option>
            <option value="Elétrico">Elétrico</option>
          </select>
        </Field>

        <Field label="Horímetro Inicial"><input type="number" step="0.1" value={form.horimetro} onChange={(e) => alterar("horimetro", e.target.value)} placeholder="Horas trabalhadas" className={inputClass} /></Field>
        <Field label="Consumo (L/h ou Km/L)"><input type="number" step="0.1" value={form.consumo} onChange={(e) => alterar("consumo", e.target.value)} placeholder="Média de consumo" className={inputClass} /></Field>
        <Field label="Fazenda Atual"><input value={form.fazenda} onChange={(e) => alterar("fazenda", e.target.value)} placeholder="Fazenda sede" className={inputClass} /></Field>
        
        <Field label="Status Atual" required>
          <select value={form.status} onChange={(e) => alterar("status", e.target.value)} className={inputClass}>
            <option value="DISPONIVEL">DISPONÍVEL</option>
            <option value="OPERANDO">OPERANDO</option>
            <option value="MANUTENCAO">EM MANUTENÇÃO</option>
            <option value="PARADA">PARADA</option>
          </select>
        </Field>
      </div>

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-dashed border-slate-500 bg-slate-900/50 flex items-center justify-center">
          {form.imagemMaquina ? <img src={form.imagemMaquina} alt="Máquina" className="h-full w-full object-cover" /> : <Upload size={20} className="text-slate-600" />}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900 transition-colors">
          <Upload size={18} /> Anexar Foto da Máquina
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
        </label>
        {form.imagemMaquina && <button type="button" onClick={() => alterar("imagemMaquina", "")} className="text-red-400 text-sm font-bold ml-2">Remover Foto</button>}
      </div>

      <div className="mt-4">
        <Field label="Observações Livres">
          <textarea rows={2} className={inputClass} value={form.observacoes} onChange={(e) => alterar("observacoes", e.target.value)} placeholder="Detalhes ou estado de conservação..." />
        </Field>
      </div>

      <button disabled={saving} type="submit" className="mt-6 flex w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-8 py-4 font-black text-white transition-opacity hover:opacity-90 disabled:opacity-50">
        <PlusCircle size={20} /> {saving ? "Salvando..." : "Salvar Máquina"}
      </button>
    </form>
  );
}