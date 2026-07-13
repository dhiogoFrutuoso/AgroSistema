import { Edit3, Eye, Search, Trash2, Image as ImageIcon } from "lucide-react";
import { useMemo, useState } from "react";
import ColheitaModal from "./ColheitaModal.jsx";

export default function ColheitaTable({ dados = [], onDelete, onEdit }) {
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("TODOS");
  const [viewModal, setViewModal] = useState(null);

  const filtrados = useMemo(() => {
    return dados.filter((item) => {
      const texto = `${item.safra} ${item.fazenda} ${item.talhao} ${item.cultura}`.toLowerCase();
      return (!busca || texto.includes(busca.toLowerCase())) && (status === "TODOS" || item.status === status);
    });
  }, [dados, busca, status]);

  return (
    <>
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div><h2 className="text-2xl font-black text-white">Registros de Colheita</h2></div>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-300">
              <Search size={18} />
              <input className="bg-transparent outline-none" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar..." />
            </div>
            <select className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="TODOS">Todos Status</option>
              <option value="PLANEJADA">Planejada</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="FINALIZADA">Finalizada</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1300px] w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-slate-400">
              <tr className="border-b border-white/10">
                <th className="px-3 py-3">Ticket</th>
                <th className="px-3 py-3">Fazenda/Talhão</th>
                <th className="px-3 py-3 text-center">Área (ha)</th>
                <th className="px-3 py-3 text-right">Peso Líq.</th>
                <th className="px-3 py-3 text-right">Produtividade</th>
                <th className="px-3 py-3 text-right">Custo Total</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-200">
              {filtrados.map((item) => (
                <tr key={item.id || item._id} className="hover:bg-white/[0.03]">
                  <td className="px-3 py-4">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-800">
                      {item.ticketBalanca && item.ticketBalanca.length > 50 ? <img src={item.ticketBalanca} className="h-full w-full object-cover" /> : <ImageIcon size={18} className="text-slate-600" />}
                    </div>
                  </td>
                  <td className="px-3 py-4"><p className="font-black text-white">{item.fazenda}</p><p className="text-xs text-slate-400">Talhão: {item.talhao}</p></td>
                  <td className="px-3 py-4 text-center font-bold">{Number(item.areaHa || 0).toLocaleString("pt-BR")} ha</td>
                  <td className="px-3 py-4 text-right font-black text-blue-400">{Number(item.pesoLiquido || 0).toLocaleString("pt-BR")} kg</td>
                  <td className="px-3 py-4 text-right font-bold text-amber-400">{Number(item.produtividade || 0).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}</td>
                  <td className="px-3 py-4 text-right font-black text-rose-400">{Number(item.custoTotal || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                  <td className="px-3 py-4"><span className={`rounded-full px-3 py-1 text-xs font-black ${item.status === 'FINALIZADA' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-blue-500/10 text-blue-300'}`}>{item.status}</span></td>
                  <td className="px-3 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={(e) => { e.preventDefault(); setViewModal(item); }} title="Ver Detalhes" className="rounded-xl bg-blue-500/10 p-2 text-blue-200 hover:bg-blue-500/20"><Eye size={17} /></button>
                      <button onClick={(e) => { e.preventDefault(); onEdit?.(item); }} title="Editar" className="rounded-xl bg-amber-500/10 p-2 text-amber-200 hover:bg-amber-500/20"><Edit3 size={17} /></button>
                      <button onClick={(e) => { e.preventDefault(); onDelete?.(item.id || item._id); }} title="Excluir" className="rounded-xl bg-red-500/10 p-2 text-red-200 hover:bg-red-500/20"><Trash2 size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (<tr><td colSpan="9" className="px-3 py-10 text-center text-slate-400">Nenhum registro encontrado.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <ColheitaModal registro={viewModal} onClose={() => setViewModal(null)} />
    </>
  );
}