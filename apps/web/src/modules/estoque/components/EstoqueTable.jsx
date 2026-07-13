import { Edit3, Eye, Search, Trash2, Image as ImageIcon } from "lucide-react";
import { useMemo, useState } from "react";
import EstoqueModal from "./EstoqueModal.jsx";

export default function EstoqueTable({ data = [], onDelete, onEdit }) {
  const [busca, setBusca] = useState("");
  const [viewModal, setViewModal] = useState(null);

  const produtos = useMemo(() => {
    return data.filter(item => !busca || `${item.nome} ${item.categoria} ${item.lote}`.toLowerCase().includes(busca.toLowerCase()));
  }, [data, busca]);

  return (
    <>
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div><h2 className="text-2xl font-black text-white">Inventário de Estoque</h2></div>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-300">
              <Search size={18} />
              <input className="bg-transparent outline-none" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar..." />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-slate-400">
              <tr className="border-b border-white/10">
                <th className="px-3 py-3">Foto</th>
                <th className="px-3 py-3">Produto</th>
                <th className="px-3 py-3">Categoria</th>
                <th className="px-3 py-3 text-center">Qtde Atual</th>
                <th className="px-3 py-3 text-center">Mínimo</th>
                <th className="px-3 py-3 text-right">Preço Un.</th>
                <th className="px-3 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-200">
              {produtos.map((item) => {
                const baixo = Number(item.quantidade || 0) <= Number(item.minimo || 0);
                const esgotado = Number(item.quantidade || 0) <= 0;
                return (
                  <tr key={item.id || item._id} className="hover:bg-white/[0.03]">
                    <td className="px-3 py-4">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-800">
                        {item.imagemProduto && item.imagemProduto.length > 50 ? <img src={item.imagemProduto} className="h-full w-full object-cover" /> : <ImageIcon size={18} className="text-slate-600" />}
                      </div>
                    </td>
                    <td className="px-3 py-4"><p className="font-black text-white">{item.nome}</p><p className="text-xs text-slate-400">Lote: {item.lote || "-"}</p></td>
                    <td className="px-3 py-4"><span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-300">{item.categoria || "Geral"}</span></td>
                    <td className="px-3 py-4 text-center"><span className={`font-black ${esgotado ? 'text-red-400' : baixo ? 'text-amber-400' : 'text-emerald-400'}`}>{item.quantidade}</span></td>
                    <td className="px-3 py-4 text-center text-slate-400">{item.minimo}</td>
                    <td className="px-3 py-4 text-right font-black text-emerald-400">{Number(item.preco || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                    <td className="px-3 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={(e) => { e.preventDefault(); setViewModal(item); }} title="Ver Detalhes" className="rounded-xl bg-blue-500/10 p-2 text-blue-200 hover:bg-blue-500/20"><Eye size={17} /></button>
                        <button onClick={(e) => { e.preventDefault(); onEdit?.(item); }} title="Editar" className="rounded-xl bg-amber-500/10 p-2 text-amber-200 hover:bg-amber-500/20"><Edit3 size={17} /></button>
                        <button onClick={(e) => { e.preventDefault(); onDelete?.(item.id || item._id); }} title="Excluir" className="rounded-xl bg-red-500/10 p-2 text-red-200 hover:bg-red-500/20"><Trash2 size={17} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {produtos.length === 0 && (<tr><td colSpan="7" className="px-3 py-10 text-center text-slate-400">Nenhum produto.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <EstoqueModal produto={viewModal} onClose={() => setViewModal(null)} />
    </>
  );
}