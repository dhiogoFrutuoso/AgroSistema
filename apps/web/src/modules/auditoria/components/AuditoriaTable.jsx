import { Eye, Trash2, Search } from "lucide-react";
import { acaoClass, formatDate, nivelClass, AUDITORIA_ACOES, AUDITORIA_NIVEIS, AUDITORIA_MODULOS } from "../utils/auditoriaUtils.js";

export default function AuditoriaTable({ registros, onSelect, onDelete, filtros }) {
  const { busca, setBusca, acao, setAcao, nivel, setNivel, modulo, setModulo, dataInicio, setDataInicio, dataFim, setDataFim } = filtros;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Log de Registros</h2>
        <p className="text-sm text-slate-400">Banco de dados completo da auditoria com filtros avançados.</p>
      </div>

      {/* FILTROS INTEGRADOS NA TABELA */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-300">
          <Search size={18} />
          <input className="w-full bg-transparent outline-none text-sm" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar..." />
        </div>
        <select className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none text-sm" value={acao} onChange={(e) => setAcao(e.target.value)}>
          <option value="TODOS">Todas Ações</option>
          {AUDITORIA_ACOES.filter(a => a !== "TODOS").map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <select className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none text-sm" value={nivel} onChange={(e) => setNivel(e.target.value)}>
          <option value="TODOS">Todos Níveis</option>
          {AUDITORIA_NIVEIS.filter(a => a !== "TODOS").map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <select className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none text-sm" value={modulo} onChange={(e) => setModulo(e.target.value)}>
          <option value="TODOS">Todos Módulos</option>
          {AUDITORIA_MODULOS.filter(a => a !== "TODOS").map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <input type="date" className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none text-sm" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        <input type="date" className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none text-sm" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-slate-400">
            <tr className="border-b border-white/10">
              <th className="pb-4 px-3">Data/Hora</th>
              <th className="pb-4 px-3">Usuário</th>
              <th className="pb-4 px-3">Módulo</th>
              <th className="pb-4 px-3 text-center">Ação</th>
              <th className="pb-4 px-3 text-center">Nível</th>
              <th className="pb-4 px-3">Descrição / Detalhes</th>
              <th className="pb-4 px-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-slate-200">
            {registros.map((item) => (
              <tr key={item.id || item._id} className="hover:bg-white/[0.03]">
                <td className="py-4 px-3 font-mono text-slate-300">{formatDate(item.dataHora)}</td>
                <td className="py-4 px-3 font-bold text-white">{item.usuario || "Sistema"}</td>
                <td className="py-4 px-3 text-slate-300">{item.modulo || "-"}</td>
                <td className="py-4 px-3 text-center">
                  <span className={`inline-block rounded-lg px-2 py-1 text-[10px] font-black uppercase ${acaoClass(item.acao)}`}>{item.acao || "INFO"}</span>
                </td>
                <td className="py-4 px-3 text-center">
                  <span className={`inline-block rounded-lg border px-2 py-1 text-[10px] font-black uppercase ${nivelClass(item.nivel)}`}>{item.nivel || "INFO"}</span>
                </td>
                <td className="py-4 px-3 text-slate-400 truncate max-w-[300px]">{item.descricao || "-"}</td>
                <td className="py-4 px-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={(e) => { e.preventDefault(); onSelect(item); }} title="Ver Detalhes" className="rounded-xl bg-blue-500/10 p-2 text-blue-400 hover:bg-blue-500/20 transition-colors"><Eye size={17} /></button>
                    <button onClick={(e) => { e.preventDefault(); onDelete(item.id || item._id); }} title="Excluir" className="rounded-xl bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={17} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {registros.length === 0 && (<tr><td colSpan="7" className="py-10 text-center text-slate-400">Nenhum log corresponde aos filtros.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}