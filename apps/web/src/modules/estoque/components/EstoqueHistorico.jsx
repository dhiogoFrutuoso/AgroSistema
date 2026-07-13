import { useEffect, useState } from "react";
import { Clock3, ArrowDownCircle, ArrowUpCircle, Trash2, Edit3, X, Save } from "lucide-react";

const STORAGE_KEY = "@arroz:estoque:movimentacoes";

export default function EstoqueHistorico() {
  const [dados, setDados] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  function carregar() {
    try {
      const lista = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setDados(lista);
    } catch {
      setDados([]);
    }
  }

  useEffect(() => {
    carregar();
    // Fica escutando as mudanças para atualizar a lista na hora
    window.addEventListener("storage", carregar);
    return () => window.removeEventListener("storage", carregar);
  }, []);

  function getIcon(tipo) {
    if (tipo === "ENTRADA") return <ArrowDownCircle size={20} className="text-blue-400" />;
    if (tipo === "SAIDA") return <ArrowUpCircle size={20} className="text-amber-400" />;
    if (tipo === "PERDA") return <ArrowUpCircle size={20} className="text-rose-400" />;
    return <Clock3 size={20} className="text-slate-400" />;
  }

  function handleDelete(id) {
    if (!window.confirm("Deseja realmente excluir esta movimentação?")) return;
    const novosDados = dados.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novosDados));
    carregar(); // Atualiza a tela local
  }

  function handleUpdate(e) {
    e.preventDefault();
    const novosDados = dados.map(d => (d.id === editingItem.id ? editingItem : d));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novosDados));
    setEditingItem(null);
    carregar(); // Atualiza a tela local
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-5">
        <h2 className="text-xl font-black text-white">Histórico de Transações</h2>
        <p className="mt-1 text-sm text-slate-400">Últimas movimentações do estoque.</p>
      </div>

      {dados.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-slate-400">
          Nenhuma movimentação registrada.
        </div>
      )}

      <div className="max-h-[400px] space-y-3 overflow-y-auto pr-2">
        {dados.map(item => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 border border-white/5">
                {getIcon(item.tipo)}
              </div>
              <div>
                <h3 className="font-bold text-white truncate max-w-[200px]">{item.produto}</h3>
                <p className="text-xs text-slate-400 truncate max-w-[200px]">{item.motivo || "Sem motivo informado"}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
              <div className="text-left sm:text-right">
                <div className={`font-black ${item.tipo === 'ENTRADA' ? 'text-blue-400' : item.tipo === 'SAIDA' ? 'text-amber-400' : 'text-rose-400'}`}>
                  {item.tipo}
                </div>
                <div className="text-sm font-bold text-slate-300">
                  {item.quantidade} un
                </div>
              </div>

              {/* Botões de Ação para cada transação */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setEditingItem(item)} 
                  title="Editar"
                  className="rounded-xl bg-amber-500/10 p-2 text-amber-400 hover:bg-amber-500/20 transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  title="Excluir"
                  className="rounded-xl bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE EDIÇÃO DE MOVIMENTAÇÃO */}
      {editingItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Editar Transação</h2>
              <button type="button" onClick={() => setEditingItem(null)} className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="grid gap-4">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Tipo</span>
                <select
                  value={editingItem.tipo}
                  onChange={(e) => setEditingItem({ ...editingItem, tipo: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white outline-none"
                >
                  <option value="ENTRADA">ENTRADA</option>
                  <option value="SAIDA">SAÍDA</option>
                  <option value="AJUSTE">AJUSTE</option>
                  <option value="PERDA">PERDA</option>
                  <option value="TRANSFERENCIA">TRANSFERÊNCIA</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Produto</span>
                <input
                  required
                  value={editingItem.produto}
                  onChange={(e) => setEditingItem({ ...editingItem, produto: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white outline-none"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Quantidade</span>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={editingItem.quantidade}
                  onChange={(e) => setEditingItem({ ...editingItem, quantidade: Number(e.target.value) })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white outline-none"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Motivo / Justificativa</span>
                <input
                  value={editingItem.motivo || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, motivo: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white outline-none"
                />
              </label>

              <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-black text-slate-950 hover:bg-emerald-400 transition-colors">
                <Save size={18} /> Salvar Correção
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}