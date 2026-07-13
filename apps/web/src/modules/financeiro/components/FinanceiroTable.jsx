import { Edit3, Eye, Search, Trash2, Filter, Image as ImageIcon } from "lucide-react";
import { useMemo, useState } from "react";
import FinanceiroModal from "./FinanceiroModal.jsx";

export default function FinanceiroTable({ data = [], onDelete, onEdit }) {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("TODOS");
  const [viewModal, setViewModal] = useState(null);

  const registros = useMemo(() => {
    return data.filter(item => {
      const texto = `${item.descricao} ${item.fornecedor} ${item.categoria} ${item.centroCusto}`.toLowerCase();
      const matchBusca = !busca || texto.includes(busca.toLowerCase());
      const matchFiltro = tipo === "TODOS" || item.tipo === tipo;
      return matchBusca && matchFiltro;
    });
  }, [data, busca, tipo]);

  return (
    <>
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Lançamentos Financeiros</h2>
            <p className="text-sm text-slate-400">Controle de receitas, despesas e comprovantes.</p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-300">
              <Search size={18} />
              <input className="bg-transparent outline-none" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar..." />
            </div>
            <select className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="TODOS">Todos</option>
              <option value="RECEITA">Apenas Receitas</option>
              <option value="DESPESA">Apenas Despesas</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-slate-400">
              <tr className="border-b border-white/10">
                <th className="px-3 py-3">Recibo</th>
                <th className="px-3 py-3">Data</th>
                <th className="px-3 py-3">Descrição / Fornecedor</th>
                <th className="px-3 py-3">Categoria</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Valor</th>
                <th className="px-3 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-200">
              {registros.map((item) => (
                <tr key={item.id || item._id} className="hover:bg-white/[0.03]">
                  <td className="px-3 py-4">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-800">
                      {item.comprovante && item.comprovante.length > 50 ? <img src={item.comprovante} className="h-full w-full object-cover" /> : <ImageIcon size={18} className="text-slate-600" />}
                    </div>
                  </td>
                  <td className="px-3 py-4">{new Date(item.dataLancamento || item.criadoEm).toLocaleDateString("pt-BR", {timeZone: 'UTC'})}</td>
                  <td className="px-3 py-4"><p className="font-black text-white">{item.descricao}</p><p className="text-xs text-slate-400">{item.fornecedor || "-"}</p></td>
                  <td className="px-3 py-4"><span className={`rounded-full px-3 py-1 text-xs font-black ${item.tipo === "RECEITA" ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>{item.categoria || item.tipo}</span></td>
                  <td className="px-3 py-4"><span className={`rounded-full px-3 py-1 text-xs font-black ${item.status === 'PAGO' ? 'bg-emerald-500/10 text-emerald-300' : item.status === 'PENDENTE' ? 'bg-amber-500/10 text-amber-300' : 'bg-red-500/10 text-red-300'}`}>{item.status}</span></td>
                  <td className="px-3 py-4 text-right font-black text-white">{Number(item.valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                  <td className="px-3 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={(e) => { e.preventDefault(); setViewModal(item); }} title="Ver Detalhes" className="rounded-xl bg-blue-500/10 p-2 text-blue-400 hover:bg-blue-500/20"><Eye size={17} /></button>
                      <button onClick={(e) => { e.preventDefault(); onEdit?.(item); }} title="Editar" className="rounded-xl bg-amber-500/10 p-2 text-amber-200 hover:bg-amber-500/20"><Edit3 size={17} /></button>
                      <button onClick={(e) => { e.preventDefault(); onDelete?.(item.id || item._id); }} title="Excluir" className="rounded-xl bg-red-500/10 p-2 text-red-200 hover:bg-red-500/20"><Trash2 size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {registros.length === 0 && (<tr><td colSpan="7" className="px-3 py-10 text-center text-slate-400">Nenhum lançamento encontrado.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <FinanceiroModal registro={viewModal} onClose={() => setViewModal(null)} />
    </>
  );
}