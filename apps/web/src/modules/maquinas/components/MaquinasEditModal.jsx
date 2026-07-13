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

export default function MaquinasEditModal({ maquina, onUpdate, onClose }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (maquina) setForm({ ...maquina });
  }, [maquina]);

  if (!form) return null;

  function alterar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => alterar("imagemMaquina", reader.result);
    reader.readAsDataURL(file);
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    await onUpdate(form.id || form._id, {
      ...form,
      horimetro: Number(form.horimetro || 0),
      consumo: Number(form.consumo || 0)
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative my-8 w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Editar Máquina</h2>
            <p className="text-sm text-slate-400">Atualize horímetros, responsáveis e status.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white hover:bg-white/20">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Nome / Apelido" required><input required className={inputClass} value={form.nome || ""} onChange={(e) => alterar("nome", e.target.value)} /></Field>
            <Field label="Código / Frota"><input className={inputClass} value={form.codigo || ""} onChange={(e) => alterar("codigo", e.target.value)} /></Field>
            <Field label="Marca"><input className={inputClass} value={form.marca || ""} onChange={(e) => alterar("marca", e.target.value)} /></Field>
            <Field label="Modelo"><input className={inputClass} value={form.modelo || ""} onChange={(e) => alterar("modelo", e.target.value)} /></Field>
            
            <Field label="Ano"><input type="number" className={inputClass} value={form.ano || ""} onChange={(e) => alterar("ano", e.target.value)} /></Field>
            <Field label="Placa"><input className={inputClass} value={form.placa || ""} onChange={(e) => alterar("placa", e.target.value)} /></Field>
            <Field label="Operador Principal"><input className={inputClass} value={form.operador || ""} onChange={(e) => alterar("operador", e.target.value)} /></Field>
            <Field label="Combustível">
              <select className={inputClass} value={form.combustivel || "Diesel"} onChange={(e) => alterar("combustivel", e.target.value)}>
                <option value="Diesel">Diesel</option>
                <option value="Gasolina">Gasolina</option>
                <option value="Etanol">Etanol</option>
                <option value="Elétrico">Elétrico</option>
              </select>
            </Field>

            <Field label="Horímetro Atual"><input type="number" step="0.1" className={inputClass} value={form.horimetro ?? ""} onChange={(e) => alterar("horimetro", e.target.value)} /></Field>
            <Field label="Consumo (L/h ou Km/L)"><input type="number" step="0.1" className={inputClass} value={form.consumo ?? ""} onChange={(e) => alterar("consumo", e.target.value)} /></Field>
            <Field label="Fazenda Atual"><input className={inputClass} value={form.fazenda || ""} onChange={(e) => alterar("fazenda", e.target.value)} /></Field>
            
            <Field label="Status Atual" required>
              <select className={inputClass} value={form.status || "DISPONIVEL"} onChange={(e) => alterar("status", e.target.value)}>
                <option value="DISPONIVEL">DISPONÍVEL</option>
                <option value="OPERANDO">OPERANDO</option>
                <option value="MANUTENCAO">EM MANUTENÇÃO</option>
                <option value="PARADA">PARADA</option>
              </select>
            </Field>
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="h-16 w-16 overflow-hidden rounded-2xl border border-dashed border-slate-500 bg-slate-900/50 flex items-center justify-center">
              {form.imagemMaquina && form.imagemMaquina.length > 50 ? <img src={form.imagemMaquina} alt="Máquina" className="h-full w-full object-cover" /> : <Upload size={20} className="text-slate-600" />}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900 transition-colors">
              <Upload size={18} /> Atualizar Foto da Máquina
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
            </label>
            {form.imagemMaquina && <button type="button" onClick={() => alterar("imagemMaquina", "")} className="text-red-400 text-sm font-bold ml-2">Remover Foto</button>}
          </div>

          <div className="mt-4">
            <Field label="Observações Livres">
              <textarea rows={2} className={inputClass} value={form.observacoes || ""} onChange={(e) => alterar("observacoes", e.target.value)} />
            </Field>
          </div>

          <button disabled={saving} type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-4 font-black text-slate-950 hover:bg-indigo-400 transition-opacity disabled:opacity-50">
            <Save size={20} /> {saving ? "Atualizando..." : "Salvar alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}