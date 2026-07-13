import { Save, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/60";

function Field({ label, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
      {children}
    </label>
  );
}

export default function TalhoesEditModal({ talhao, onUpdate, onClose }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (talhao) setForm({ ...talhao });
  }, [talhao]);

  if (!form) return null;

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
    onUpdate(form.id || form._id, form);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative my-8 w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Editar Talhão</h2>
            <p className="text-sm text-slate-400">Atualize as informações e a imagem do terreno.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white hover:bg-white/20">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Nome"><input required className={inputClass} value={form.nome || ""} onChange={(e) => update("nome", e.target.value)} /></Field>
            <Field label="Fazenda"><input className={inputClass} value={form.fazenda || ""} onChange={(e) => update("fazenda", e.target.value)} /></Field>
            <Field label="Cultura"><input className={inputClass} value={form.cultura || ""} onChange={(e) => update("cultura", e.target.value)} /></Field>
            <Field label="Safra"><input className={inputClass} value={form.safra || ""} onChange={(e) => update("safra", e.target.value)} /></Field>
            <Field label="Área (ha)"><input required className={inputClass} type="number" step="0.01" value={form.areaHa || ""} onChange={(e) => update("areaHa", e.target.value)} /></Field>
            <Field label="Perímetro (m)"><input className={inputClass} type="number" step="0.01" value={form.perimetroM || ""} onChange={(e) => update("perimetroM", e.target.value)} /></Field>
            <Field label="Status">
              <select className={inputClass} value={form.status || "ATIVO"} onChange={(e) => update("status", e.target.value)}>
                <option value="ATIVO">ATIVO</option>
                <option value="PAUSADO">PAUSADO</option>
                <option value="INATIVO">INATIVO</option>
              </select>
            </Field>
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="h-24 w-36 overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
              {form.imagemMapa ? <img src={form.imagemMapa} alt="Mapa" className="h-full w-full object-cover" /> : null}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900">
              <Upload size={18} /> Atualizar Imagem
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
            </label>
          </div>

          <div className="mt-4">
            <Field label="Observações">
              <textarea className={`${inputClass} min-h-24`} value={form.observacoes || ""} onChange={(e) => update("observacoes", e.target.value)} />
            </Field>
          </div>

          <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 font-black text-slate-950 hover:bg-emerald-400">
            <Save size={20} /> Salvar alterações
          </button>
        </form>
      </div>
    </div>
  );
}