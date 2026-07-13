import { FileText, Search, Trash2, Edit3, Eye, FileBarChart } from "lucide-react";
import { gerarPDFModulo } from "../services/relatoriosService.js";
import { MODULOS_RELATORIO, parseDate } from "../utils/relatoriosUtils.js";

export default function RelatoriosTabela({ registros, busca, setBusca, moduloFiltro, setModuloFiltro, onDelete, onEdit, onView }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Histórico de Emissões</h2>
          <p className="text-sm text-slate-400">Registros gerenciais criados nos módulos.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-300">
            <Search size={18} />
            <input className="bg-transparent outline-none" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar..." />
          </div>
          <select className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" value={moduloFiltro} onChange={(e) => setModuloFiltro(e.target.value)}>
            <option value="TODOS">Todos Módulos</option>
            {MODULOS_RELATORIO.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-slate-400">
            <tr className="border-b border-white/10">
              <th className="pb-4 px-3">Ícone</th>
              <th className="pb-4 px-3">Título do Relatório</th>
              <th className="pb-4 px-3">Módulo</th>
              <th className="pb-4 px-3">Tipo</th>
              <th className="pb-4 px-3">Responsável</th>
              <th className="pb-4 px-3 text-center">Data Criação</th>
              <th className="pb-4 px-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-slate-200">
            {registros.map((item) => (
              <tr key={item.id || item._id} className="hover:bg-white/[0.03]">
                <td className="py-4 px-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-amber-400">
                    <FileBarChart size={20} />
                  </div>
                </td>
                <td className="py-4 px-3">
                  <p className="font-bold text-white truncate max-w-[250px]">{item.titulo}</p>
                  <p className="text-xs text-slate-400 truncate max-w-[250px]">{item.observacoes || "-"}</p>
                </td>
                <td className="py-4 px-3 font-bold text-slate-300">{item.modulo}</td>
                <td className="py-4 px-3">
                  <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-black uppercase text-blue-300">{item.tipo}</span>
                </td>
                <td className="py-4 px-3 text-slate-300">{item.responsavel}</td>
                <td className="py-4 px-3 text-center font-mono text-slate-400">{parseDate(item.criadoEm)}</td>
                <td className="py-4 px-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => gerarPDFModulo(item.modulo)} title="Gerar PDF Deste Módulo" className="rounded-xl p-2 text-indigo-400 hover:bg-indigo-500/20 transition-colors"><FileText size={17} /></button>
                    <button onClick={() => onView?.(item)} title="Visualizar Detalhes" className="rounded-xl p-2 text-blue-400 hover:bg-blue-500/20 transition-colors"><Eye size={17} /></button>
                    <button onClick={() => onEdit?.(item)} title="Editar Registro" className="rounded-xl p-2 text-amber-400 hover:bg-amber-500/20 transition-colors"><Edit3 size={17} /></button>
                    <button onClick={() => onDelete?.(item.id || item._id)} title="Excluir" className="rounded-xl p-2 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={17} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {registros.length === 0 && (<tr><td colSpan="7" className="py-10 text-center text-slate-400">Nenhum relatório encontrado.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}