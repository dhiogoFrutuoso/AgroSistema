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

export default function EstoqueEditModal({ produto, onUpdate, onClose }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (produto) setForm({ ...produto });
  }, [produto]);

  if (!form) return null;

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField("imagemProduto", reader.result);
    reader.readAsDataURL(file);
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    await onUpdate(form.id || form._id, {
      ...form,
      quantidade: Number(form.quantidade),
      minimo: Number(form.minimo || 0),
      preco: Number(form.preco || 0)
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative my-8 w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Editar Produto</h2>
            <p className="text-sm text-slate-400">Ajuste os detalhes e quantidades do estoque.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white hover:bg-white/20">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Nome do Produto" required><input required className={inputClass} value={form.nome || ""} onChange={(e) => updateField("nome", e.target.value)} /></Field>
            
            <Field label="Categoria" required>
              <select required className={inputClass} value={form.categoria || ""} onChange={(e) => updateField("categoria", e.target.value)}>
                <option value="Fertilizantes">Fertilizantes</option>
                <option value="Defensivos">Defensivos</option>
                <option value="Sementes">Sementes</option>
                <option value="Combustíveis">Combustíveis</option>
                <option value="Ferramentas">Ferramentas / Peças</option>
                <option value="Colheita">Colheita (Grãos)</option>
                <option value="Geral">Geral</option>
                <option value="Outros">Outros</option>
              </select>
            </Field>

            <Field label="Unidade de Medida" required>
              <select required className={inputClass} value={form.unidadeMedida || "Unidades"} onChange={(e) => updateField("unidadeMedida", e.target.value)}>
                <option value="Unidades">Unidades (un)</option>
                <option value="Sacas">Sacas (sc)</option>
                <option value="Litros">Litros (L)</option>
                <option value="Galões">Galões (gal)</option>
                <option value="Quilogramas">Quilogramas (Kg)</option>
                <option value="Toneladas">Toneladas (t)</option>
                <option value="Metros">Metros (m)</option>
              </select>
            </Field>

            <Field label="Quantidade em Estoque" required><input required type="number" step="0.01" className={inputClass} value={form.quantidade ?? ""} onChange={(e) => updateField("quantidade", e.target.value)} /></Field>
            <Field label="Estoque Mínimo (Alerta)"><input type="number" step="0.01" className={inputClass} value={form.minimo ?? ""} onChange={(e) => updateField("minimo", e.target.value)} /></Field>
            <Field label="Preço Unitário / Custo"><input type="number" step="0.01" className={inputClass} value={form.preco ?? ""} onChange={(e) => updateField("preco", e.target.value)} /></Field>
            <Field label="Lote / NF"><input className={inputClass} value={form.lote || ""} onChange={(e) => updateField("lote", e.target.value)} /></Field>
            <Field label="Data de Validade"><input type="date" className={inputClass} value={form.validade || ""} onChange={(e) => updateField("validade", e.target.value)} /></Field>
            <Field label="Fornecedor"><input className={inputClass} value={form.fornecedor || ""} onChange={(e) => updateField("fornecedor", e.target.value)} /></Field>
            <Field label="Localização / Galpão"><input className={inputClass} value={form.local || ""} onChange={(e) => updateField("local", e.target.value)} /></Field>
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="h-16 w-16 overflow-hidden rounded-2xl border border-dashed border-slate-500 bg-slate-900/50 flex items-center justify-center">
              {form.imagemProduto && form.imagemProduto.length > 50 ? <img src={form.imagemProduto} alt="Produto" className="h-full w-full object-cover" /> : <Upload size={20} className="text-slate-600" />}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900 transition-colors">
              <Upload size={18} /> Atualizar Foto do Produto
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
            </label>
            {form.imagemProduto && <button type="button" onClick={() => updateField("imagemProduto", "")} className="text-red-400 text-sm font-bold ml-2">Remover Foto</button>}
          </div>

          <div className="mt-4">
            <Field label="Observações Livres">
              <textarea rows={2} className={inputClass} value={form.observacoes || ""} onChange={(e) => updateField("observacoes", e.target.value)} />
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