import { useState } from "react";
import { PlusCircle } from "lucide-react";

const STORAGE_KEY = "@arroz:estoque:movimentacoes";

function getMovimentacoes() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveMovimentacoes(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Dispara um evento para o Histórico saber que deve se atualizar na mesma hora
  window.dispatchEvent(new Event("storage"));
}

export default function EstoqueMovimentacoes() {
  const [form, setForm] = useState({
    tipo: "ENTRADA",
    produto: "",
    quantidade: "",
    motivo: ""
  });

  function salvar(e) {
    e.preventDefault();

    if (!form.produto || !form.quantidade) return;

    const lista = getMovimentacoes();

    const novo = {
      id: crypto.randomUUID?.() || String(Date.now()),
      ...form,
      quantidade: Number(form.quantidade),
      criadoEm: new Date().toISOString()
    };

    saveMovimentacoes([novo, ...lista]);

    setForm({
      tipo: "ENTRADA",
      produto: "",
      quantidade: "",
      motivo: ""
    });
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-5">
        <h2 className="text-xl font-black text-white">Registrar Movimentação</h2>
        <p className="mt-1 text-sm text-slate-400">Entradas, saídas ou perdas rápidas.</p>
      </div>

      <form onSubmit={salvar} className="grid gap-4 md:grid-cols-2">
        <select
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          className={`rounded-2xl border border-white/10 bg-slate-950/70 p-3 font-black outline-none ${form.tipo === 'ENTRADA' ? 'text-blue-400' : form.tipo === 'SAIDA' ? 'text-amber-400' : 'text-rose-400'}`}
        >
          <option value="ENTRADA">ENTRADA</option>
          <option value="SAIDA">SAÍDA</option>
          <option value="AJUSTE">AJUSTE</option>
          <option value="PERDA">PERDA</option>
          <option value="TRANSFERENCIA">TRANSFERÊNCIA</option>
        </select>

        <input
          required
          placeholder="Nome do Produto"
          value={form.produto}
          onChange={(e) => setForm({ ...form, produto: e.target.value })}
          className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white outline-none focus:border-emerald-500/50"
        />

        <input
          required
          type="number"
          step="0.01"
          placeholder="Quantidade"
          value={form.quantidade}
          onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
          className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white outline-none focus:border-emerald-500/50"
        />

        <input
          placeholder="Motivo / Justificativa"
          value={form.motivo}
          onChange={(e) => setForm({ ...form, motivo: e.target.value })}
          className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white outline-none focus:border-emerald-500/50"
        />

        <button
          type="submit"
          className="col-span-1 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-black text-white hover:bg-blue-500 md:col-span-2"
        >
          <PlusCircle size={18} />
          Registrar Transação
        </button>
      </form>
    </div>
  );
}