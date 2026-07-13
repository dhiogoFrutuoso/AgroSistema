import { PlusCircle, Upload } from "lucide-react";
import { useState } from "react";

const initialState = {
  nome: "",
  categoria: "",
  unidadeMedida: "Unidades",
  quantidade: "",
  minimo: "",
  preco: "",
  lote: "",
  validade: "",
  fornecedor: "",
  local: "",
  observacoes: "",
  imagemProduto: ""
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

export default function EstoqueForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField("imagemProduto", reader.result);
    reader.readAsDataURL(file);
  }

  async function salvar(event) {
    event.preventDefault();
    if (!form.nome || !form.quantidade) return;

    setSaving(true);
    await onSubmit?.({
      ...form,
      quantidade: Number(form.quantidade),
      minimo: Number(form.minimo || 0),
      preco: Number(form.preco || 0)
    });
    setForm(initialState);
    setSaving(false);
  }

  return (
    <form onSubmit={salvar} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Novo Produto</h2>
        <p className="mt-1 text-sm text-slate-400">Cadastro detalhado de itens do estoque.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Nome do Produto" required>
          <input required value={form.nome} onChange={(e) => updateField("nome", e.target.value)} placeholder="Ex: Ureia 46%" className={inputClass} />
        </Field>

        <Field label="Categoria" required>
          <select required className={inputClass} value={form.categoria} onChange={(e) => updateField("categoria", e.target.value)}>
            <option value="">Selecione...</option>
            <option value="Fertilizantes">Fertilizantes</option>
            <option value="Defensivos">Defensivos</option>
            <option value="Sementes">Sementes</option>
            <option value="Combustíveis">Combustíveis</option>
            <option value="Ferramentas">Ferramentas / Peças</option>
            <option value="Colheita">Colheita (Grãos)</option>
            <option value="Outros">Outros</option>
          </select>
        </Field>

        <Field label="Unidade de Medida" required>
          <select required className={inputClass} value={form.unidadeMedida} onChange={(e) => updateField("unidadeMedida", e.target.value)}>
            <option value="Unidades">Unidades (un)</option>
            <option value="Sacas">Sacas (sc)</option>
            <option value="Litros">Litros (L)</option>
            <option value="Galões">Galões (gal)</option>
            <option value="Quilogramas">Quilogramas (Kg)</option>
            <option value="Toneladas">Toneladas (t)</option>
            <option value="Metros">Metros (m)</option>
          </select>
        </Field>

        <Field label="Quantidade em Estoque" required>
          <input required type="number" step="0.01" value={form.quantidade} onChange={(e) => updateField("quantidade", e.target.value)} placeholder="0" className={inputClass} />
        </Field>

        <Field label="Estoque Mínimo (Alerta)">
          <input type="number" step="0.01" value={form.minimo} onChange={(e) => updateField("minimo", e.target.value)} placeholder="0" className={inputClass} />
        </Field>

        <Field label="Preço Unitário / Custo">
          <input type="number" step="0.01" value={form.preco} onChange={(e) => updateField("preco", e.target.value)} placeholder="0.00" className={inputClass} />
        </Field>

        <Field label="Lote / NF">
          <input value={form.lote} onChange={(e) => updateField("lote", e.target.value)} placeholder="Nº do Lote ou Nota" className={inputClass} />
        </Field>

        <Field label="Data de Validade">
          <input type="date" value={form.validade} onChange={(e) => updateField("validade", e.target.value)} className={inputClass} />
        </Field>

        <Field label="Fornecedor">
          <input value={form.fornecedor} onChange={(e) => updateField("fornecedor", e.target.value)} placeholder="Nome da empresa" className={inputClass} />
        </Field>

        <Field label="Localização / Galpão">
          <input value={form.local} onChange={(e) => updateField("local", e.target.value)} placeholder="Ex: Galpão A, Prateleira 2" className={inputClass} />
        </Field>
      </div>

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-dashed border-slate-500 bg-slate-900/50 flex items-center justify-center">
          {form.imagemProduto ? <img src={form.imagemProduto} alt="Produto" className="h-full w-full object-cover" /> : <Upload size={20} className="text-slate-600" />}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900 transition-colors">
          <Upload size={18} /> Anexar Foto do Produto
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
        </label>
        {form.imagemProduto && <button type="button" onClick={() => updateField("imagemProduto", "")} className="text-red-400 text-sm font-bold ml-2">Remover Foto</button>}
      </div>

      <div className="mt-4">
        <Field label="Observações Livres">
          <textarea rows={2} className={inputClass} value={form.observacoes} onChange={(e) => updateField("observacoes", e.target.value)} placeholder="Detalhes adicionais..." />
        </Field>
      </div>

      <button disabled={saving} type="submit" className="mt-6 flex w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-4 font-black text-white transition-opacity hover:opacity-90 disabled:opacity-50">
        <PlusCircle size={20} /> {saving ? "Salvando..." : "Salvar Produto"}
      </button>
    </form>
  );
}