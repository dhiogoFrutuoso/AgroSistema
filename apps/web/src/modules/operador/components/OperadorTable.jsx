import { Edit3, Eye, Search, Trash2, FileSignature, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import OperadorModal from "./OperadorModal.jsx";

export default function OperadorTable({ linhas = [], onDelete, onEdit, onAssinar }) {
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("TODOS");
  const [viewModal, setViewModal] = useState(null);

  const filtradas = useMemo(() => {
    return linhas.filter(item => {
      const matchBusca = !busca || `${item.nomeOperador} ${item.cliente} ${item.maquinaAgricola}`.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = statusFiltro === "TODOS" || item.status === statusFiltro;
      return matchBusca && matchStatus;
    });
  }, [linhas, busca, statusFiltro]);

  return (
    <>
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div><h2 className="text-2xl font-black text-white">Serviços de Operadores</h2></div>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-300">
              <Search size={18} />
              <input className="bg-transparent outline-none" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar..." />
            </div>
            <select className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
              <option value="TODOS">Todos Status</option>
              <option value="PAGO">Pago</option>
              <option value="ASSINADO">Assinado</option>
              <option value="ABERTA">Aberto</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1300px] w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-slate-400">
              <tr className="border-b border-white/10">
                <th className="pb-4 px-2">Data</th>
                <th className="pb-4 px-2">Operador / Máquina</th>
                <th className="pb-4 px-2">Cliente / Serviço</th>
                <th className="pb-4 px-2 text-center">Horas</th>
                <th className="pb-4 px-2 text-right">Valor Total</th>
                <th className="pb-4 px-2 text-center">Status</th>
                <th className="pb-4 px-2 text-center">Assinatura</th>
                <th className="pb-4 px-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-200">
              {filtradas.map(item => {
                const temAssinatura = item.assinaturaCliente && item.assinaturaCliente.length > 50;
                return (
                  <tr key={item.id || item._id} className="hover:bg-white/[0.03]">
                    <td className="px-3 py-4 text-slate-300">{new Date(item.data).toLocaleDateString("pt-BR", {timeZone: 'UTC'})}</td>
                    <td className="px-3 py-4"><p className="font-bold text-white">{item.nomeOperador}</p><p className="text-xs text-slate-400">{item.maquinaAgricola}</p></td>
                    <td className="px-3 py-4"><p className="font-bold text-slate-200">{item.cliente}</p><p className="text-xs text-slate-400">{item.servico}</p></td>
                    <td className="px-3 py-4 text-center font-mono text-emerald-400 font-bold">{Number(item.horasTrabalhadas).toFixed(2)}h</td>
                    <td className="px-3 py-4 text-right font-black text-white">{Number(item.valorTotal || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                    <td className="px-3 py-4 text-center"><span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${item.status === 'PAGO' ? 'bg-emerald-500/10 text-emerald-300' : item.status === 'ASSINADO' ? 'bg-blue-500/10 text-blue-300' : 'bg-amber-500/10 text-amber-300'}`}>{item.status}</span></td>
                    
                    <td className="px-3 py-4 text-center">
                      {temAssinatura ? (
                        <div className="flex justify-center"><img src={item.assinaturaCliente} alt="Assinatura" className="h-10 w-24 rounded-lg bg-white object-contain p-1" /></div>
                      ) : <span className="text-xs font-bold text-slate-500">Pendente</span>}
                    </td>

                    <td className="px-3 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={(e) => { e.preventDefault(); onAssinar?.(item); }} title={temAssinatura ? "Assinar Novamente" : "Colher Assinatura"} className={`rounded-xl p-2 transition-colors ${temAssinatura ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                          {temAssinatura ? <CheckCircle2 size={17} /> : <FileSignature size={17} />}
                        </button>
                        <button onClick={(e) => { e.preventDefault(); setViewModal(item); }} title="Ver Detalhes" className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400 hover:bg-indigo-500/20"><Eye size={17} /></button>
                        <button onClick={(e) => { e.preventDefault(); onEdit?.(item); }} title="Editar Registro" className="rounded-xl bg-amber-500/10 p-2 text-amber-400 hover:bg-amber-500/20"><Edit3 size={17} /></button>
                        <button onClick={(e) => { e.preventDefault(); onDelete?.(item.id || item._id); }} title="Excluir" className="rounded-xl bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"><Trash2 size={17} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtradas.length === 0 && (<tr><td colSpan="8" className="py-10 text-center text-slate-400">Nenhum registro encontrado.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <OperadorModal registro={viewModal} onClose={() => setViewModal(null)} />
    </>
  );
}