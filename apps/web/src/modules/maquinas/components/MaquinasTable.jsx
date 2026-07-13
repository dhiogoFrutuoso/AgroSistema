import { Edit3, Eye, Search, Trash2, Download, Image as ImageIcon } from "lucide-react";
import { useMemo, useState } from "react";
import MaquinasModal from "./MaquinasModal.jsx";

export default function MaquinasTable({ maquinas = [], onDelete, onEdit }) {
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("TODOS");
  const [viewModal, setViewModal] = useState(null);

  const filtradas = useMemo(() => {
    return maquinas.filter(item => {
      const texto = `${item.nome} ${item.modelo} ${item.operador} ${item.placa}`.toLowerCase();
      return (!busca || texto.includes(busca.toLowerCase())) && (status === "TODOS" || item.status === status);
    });
  }, [maquinas, busca, status]);

  function exportarJson() {
    const blob = new Blob([JSON.stringify(filtradas, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "maquinas.json"; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div><h2 className="text-2xl font-black text-white">Frota e Maquinário</h2></div>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-300">
              <Search size={18} />
              <input className="bg-transparent outline-none" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar..." />
            </div>
            <select className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="TODOS">Todos Status</option>
              <option value="DISPONIVEL">Disponível</option>
              <option value="OPERANDO">Operando</option>
              <option value="MANUTENCAO">Em Manutenção</option>
              <option value="PARADA">Parada</option>
            </select>
            <button onClick={exportarJson} className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-black text-white hover:bg-blue-500"><Download size={18} /> JSON</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-slate-400">
              <tr className="border-b border-white/10">
                <th className="px-3 py-3">Foto</th>
                <th className="px-3 py-3">Identificação</th>
                <th className="px-3 py-3">Marca/Modelo</th>
                <th className="px-3 py-3">Operador</th>
                <th className="px-3 py-3 text-center">Horímetro</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-3 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-200">
              {filtradas.map((item) => (
                <tr key={item.id || item._id} className="hover:bg-white/[0.03]">
                  <td className="px-3 py-4">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-800">
                      {item.imagemMaquina && item.imagemMaquina.length > 50 ? <img src={item.imagemMaquina} className="h-full w-full object-cover" /> : <ImageIcon size={18} className="text-slate-600" />}
                    </div>
                  </td>
                  <td className="px-3 py-4"><p className="font-black text-white">{item.nome}</p><p className="text-xs text-slate-400">Cód: {item.codigo || "-"}</p></td>
                  <td className="px-3 py-4">{item.marca} {item.modelo}</td>
                  <td className="px-3 py-4">{item.operador || "-"}</td>
                  <td className="px-3 py-4 text-center font-mono font-bold text-emerald-400">{item.horimetro} h</td>
                  <td className="px-3 py-4 text-center"><span className={`rounded-full px-3 py-1 text-xs font-black ${item.status === 'OPERANDO' ? 'bg-emerald-500/10 text-emerald-300' : item.status === 'DISPONIVEL' ? 'bg-blue-500/10 text-blue-300' : 'bg-red-500/10 text-red-300'}`}>{item.status}</span></td>
                  <td className="px-3 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={(e) => { e.preventDefault(); setViewModal(item); }} title="Ver Detalhes" className="rounded-xl bg-blue-500/10 p-2 text-blue-200 hover:bg-blue-500/20"><Eye size={17} /></button>
                      <button onClick={(e) => { e.preventDefault(); onEdit?.(item); }} title="Editar" className="rounded-xl bg-amber-500/10 p-2 text-amber-200 hover:bg-amber-500/20"><Edit3 size={17} /></button>
                      <button onClick={(e) => { e.preventDefault(); onDelete?.(item.id || item._id); }} title="Excluir" className="rounded-xl bg-red-500/10 p-2 text-red-200 hover:bg-red-500/20"><Trash2 size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (<tr><td colSpan="8" className="px-3 py-10 text-center text-slate-400">Nenhuma máquina encontrada.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <MaquinasModal maquina={viewModal} onClose={() => setViewModal(null)} />
    </>
  );
}