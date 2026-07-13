import { Edit3, Eye, Search, Trash2, Image as ImageIcon } from "lucide-react";
import { useMemo, useState } from "react";
import IrrigacaoModal from "./IrrigacaoModal.jsx";

export default function IrrigacaoTable({ dados = [], onDelete, onEdit }) {
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("TODOS");
  const [viewModal, setViewModal] = useState(null);

  const filtrados = useMemo(() => {
    return dados.filter((item) => {
      const texto = `${item.empresaAgua} ${item.fazenda} ${item.talhaoNome} ${item.mesReferencia}`.toLowerCase();
      return (!busca || texto.includes(busca.toLowerCase())) && (status === "TODOS" || item.statusPagamento === status);
    });
  }, [dados, busca, status]);

  return (
    <>
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div><h2 className="text-2xl font-black text-white">Tabela de Irrigação</h2></div>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-300">
              <Search size={18} />
              <input className="bg-transparent outline-none" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar..." />
            </div>
            <select className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="TODOS">Todos Status</option>
              <option value="DEVENDO">DEVENDO</option>
              <option value="PAGO">PAGO</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1300px] w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-slate-400">
              <tr className="border-b border-white/10">
                <th className="px-3 py-3">Recibo</th>
                <th className="px-3 py-3">Empresa</th>
                <th className="px-3 py-3">Fazenda/Talhão</th>
                <th className="px-3 py-3 text-center">Hectares</th>
                <th className="px-3 py-3 text-right">Valor Total</th>
                <th className="px-3 py-3 text-right">Pago</th>
                <th className="px-3 py-3 text-right">Devendo</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-200">
              {filtrados.map((item) => (
                <tr key={item.id || item._id} className="hover:bg-white/[0.03]">
                  <td className="px-3 py-4">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-800">
                      {item.comprovante && item.comprovante.length > 50 ? <img src={item.comprovante} className="h-full w-full object-cover" /> : <ImageIcon size={18} className="text-slate-600" />}
                    </div>
                  </td>
                  <td className="px-3 py-4"><p className="font-black text-white">{item.empresaAgua}</p><p className="text-xs text-slate-400">Ref: {item.mesReferencia}</p></td>
                  <td className="px-3 py-4"><p className="font-bold">{item.fazenda}</p><p className="text-xs text-slate-400">{item.talhaoNome}</p></td>
                  <td className="px-3 py-4 text-center font-bold">{Number(item.hectares || 0).toLocaleString("pt-BR")} ha</td>
                  <td className="px-3 py-4 text-right font-black text-white">{Number(item.valorTotal || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                  <td className="px-3 py-4 text-right text-emerald-400">{Number(item.valorPago || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                  <td className="px-3 py-4 text-right font-black text-rose-400">{Number(item.valorDevido || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                  <td className="px-3 py-4"><span className={`rounded-full px-3 py-1 text-xs font-black ${item.statusPagamento === 'PAGO' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>{item.statusPagamento}</span></td>
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

      <IrrigacaoModal registro={viewModal} onClose={() => setViewModal(null)} />
    </>
  );
}