import { Save, Upload } from "lucide-react";
import { useState } from "react";

const initial = {
  nome: "",
  fazenda: "",
  cultura: "Arroz",
  safra: "",
  areaHa: "",
  perimetroM: "",
  status: "ATIVO",
  observacoes: "",
  imagemMapa: ""
};

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/60";

function Field({ label, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
      {children}
    </label>
  );
}

export default function TalhoesForm({ onCreate }) {
  const [form, setForm] = useState(initial);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("imagemMapa", reader.result);
    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();
    onCreate(form);
    setForm(initial);
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <h2 className="text-2xl font-black text-white">Cadastro manual de talhão</h2>
      <p className="mt-1 text-sm text-slate-400">Use apenas quando o talhão não vier do GPS.</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Nome"><input required className={inputClass} value={form.nome} onChange={(e) => update("nome", e.target.value)} /></Field>
        <Field label="Fazenda"><input className={inputClass} value={form.fazenda} onChange={(e) => update("fazenda", e.target.value)} /></Field>
        <Field label="Cultura"><input className={inputClass} value={form.cultura} onChange={(e) => update("cultura", e.target.value)} /></Field>
        <Field label="Safra"><input className={inputClass} value={form.safra} onChange={(e) => update("safra", e.target.value)} /></Field>
        <Field label="Área (ha)"><input required className={inputClass} type="number" step="0.01" value={form.areaHa} onChange={(e) => update("areaHa", e.target.value)} /></Field>
        <Field label="Perímetro (m)"><input className={inputClass} type="number" step="0.01" value={form.perimetroM} onChange={(e) => update("perimetroM", e.target.value)} /></Field>
        <Field label="Status">
          <select className={inputClass} value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option value="ATIVO">ATIVO</option>
            <option value="PAUSADO">PAUSADO</option>
            <option value="INATIVO">INATIVO</option>
          </select>
        </Field>
      </div>

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="h-24 w-36 overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
          {form.imagemMapa ? <img src={form.imagemMapa} alt="Mapa" className="h-full w-full object-cover" /> : null}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900">
          <Upload size={18} /> Inserir Imagem do Terreno
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
        </label>
      </div>

      <div className="mt-4">
        <Field label="Observações">
          <textarea className={`${inputClass} min-h-24`} value={form.observacoes} onChange={(e) => update("observacoes", e.target.value)} />
        </Field>
      </div>

      <button className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-black text-slate-950 hover:bg-emerald-400">
        <Save size={18} /> Salvar talhão
      </button>
    </form>
  );
}