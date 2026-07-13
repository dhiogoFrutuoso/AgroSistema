import { Search, Trash2, Edit3, Eye, Image as ImageIcon } from "lucide-react";
import { useMemo, useState } from "react";
import PlantioModal from "./PlantioModal.jsx";

function money(value) { 
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); 
}

export default function PlantioTable({ plantios = [], onDelete, onEdit }) {
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("TODOS");
  const [viewModal, setViewModal] = useState(null); // Aqui chamamos o Modal de Visualização

  const filtrados = useMemo(() => {
    return plantios.filter((item) => {
      const texto = `${item.safra} ${item.fazenda} ${item.talhao} ${item.cultura} ${item.variedade} ${item.operador} ${item.maquina}`.toLowerCase();
      const matchBusca = texto.includes(busca.toLowerCase());
      const matchStatus = status === "TODOS" || item.status === status;
      return matchBusca && matchStatus;
    });
  }, [plantios, busca, status]);

  return (
    <>
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Registros de Plantio</h2>
            <p className="text-sm text-slate-400">Controle de áreas plantadas, insumos e status.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-300">
              <Search size={18} />
              <input className="bg-transparent outline-none" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar..." />
            </div>
            <select className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="TODOS">Todos Status</option>
              <option value="PLANEJADO">Planejado</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px] text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-slate-400">
              <tr className="border-b border-white/10">
                <th className="px-3 py-3">Foto</th>
                <th className="px-3 py-3">Fazenda/Talhão</th>
                <th className="px-3 py-3">Safra/Cultura</th>
                <th className="px-3 py-3 text-center">Área (ha)</th>
                <th className="px-3 py-3">Início</th>
                <th className="px-3 py-3 text-right">Custo Total</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-3 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-200">
              {filtrados.map((item) => (
                <tr key={item.id || item._id} className="hover:bg-white/[0.03]">
                  <td className="px-3 py-4">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-800">
                      {item.anexo && item.anexo.length > 50 ? <img src={item.anexo} className="h-full w-full object-cover" alt="Anexo" /> : <ImageIcon size={18} className="text-slate-600" />}
                    </div>
                  </td>
                  <td className="px-3 py-4"><p className="font-bold text-white">{item.fazenda}</p><p className="text-xs text-slate-400">Talhão: {item.talhao}</p></td>
                  <td className="px-3 py-4"><p className="font-bold">{item.safra}</p><p className="text-xs text-slate-400">{item.cultura} {item.variedade ? `(${item.variedade})` : ""}</p></td>
                  <td className="px-3 py-4 text-center font-bold text-slate-300">{Number(item.area || 0).toLocaleString("pt-BR")} ha</td>
                  <td className="px-3 py-4 text-slate-300">{new Date(item.dataInicio).toLocaleDateString("pt-BR", {timeZone: 'UTC'})}</td>
                  <td className="px-3 py-4 text-right font-black text-rose-400">{money(item.custoTotal)}</td>
                  <td className="px-3 py-4 text-center">
                    <span className={`inline-block rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wider ${item.status === 'CONCLUIDO' ? 'bg-emerald-500/20 text-emerald-300' : item.status === 'EM_ANDAMENTO' ? 'bg-blue-500/20 text-blue-300' : item.status === 'PLANEJADO' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Ao invés de alert() ou imagem em branco, abre o Componente PlantioModal */}
                      <button onClick={(e) => { e.preventDefault(); setViewModal(item); }} title="Ver Detalhes" className="rounded-xl bg-blue-500/10 p-2 text-blue-200 hover:bg-blue-500/20"><Eye size={17} /></button>
                      <button onClick={(e) => { e.preventDefault(); onEdit?.(item); }} title="Editar" className="rounded-xl bg-amber-500/10 p-2 text-amber-200 hover:bg-amber-500/20"><Edit3 size={17} /></button>
                      <button onClick={(e) => { e.preventDefault(); onDelete?.(item.id || item._id); }} title="Excluir" className="rounded-xl bg-red-500/10 p-2 text-red-200 hover:bg-red-500/20"><Trash2 size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (<tr><td colSpan="8" className="px-3 py-10 text-center text-slate-400">Nenhum plantio encontrado.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <PlantioModal registro={viewModal} onClose={() => setViewModal(null)} />
    </>
  );
}