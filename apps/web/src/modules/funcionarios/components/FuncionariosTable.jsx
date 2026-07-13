import { Ban, Edit3, Eye, KeyRound, LockOpen, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function FuncionariosTable({ funcionarios, onEdit, onDelete, onBlock, onRelease, onReset, onView }) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("TODOS");

  const filtrados = useMemo(() => {
    return funcionarios.filter((f) => {
      const texto = `${f.nome} ${f.cpf} ${f.cargo} ${f.usuario}`.toLowerCase();
      const okBusca = texto.includes(busca.toLowerCase());
      const okFiltro =
        filtro === "TODOS" ||
        (filtro === "ATIVOS" && f.status === "ATIVO") ||
        (filtro === "BLOQUEADOS" && f.status === "BLOQUEADO") ||
        (filtro === "ADMINISTRADORES" && f.perfil === "ADMIN");
      return okBusca && okFiltro;
    });
  }, [funcionarios, busca, filtro]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Tabela de Funcionarios</h2>
          <p className="text-sm text-slate-400">Gerenciamento completo de acesso.</p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-300">
            <Search size={18} />
            <input className="bg-transparent outline-none" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar..." />
          </div>
          <select className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="TODOS">Todos</option>
            <option value="ATIVOS">Ativos</option>
            <option value="BLOQUEADOS">Bloqueados</option>
            <option value="ADMINISTRADORES">Administradores</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-slate-400">
            <tr className="border-b border-white/10">
              <th className="px-3 py-3">Foto</th>
              <th className="px-3 py-3">Nome</th>
              <th className="px-3 py-3">Usuario</th>
              <th className="px-3 py-3">Cargo</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Ultimo Login</th>
              <th className="px-3 py-3">Criado Em</th>
              <th className="px-3 py-3 text-right">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-slate-200">
            {filtrados.map((f) => (
              <tr key={f.id} className="hover:bg-white/[0.03]">
                <td className="px-3 py-4">
                  <div className="h-12 w-12 overflow-hidden rounded-2xl bg-slate-800">
                    {f.foto ? <img src={f.foto} className="h-full w-full object-cover" /> : null}
                  </div>
                </td>
                <td className="px-3 py-4 font-black text-white">{f.nome}</td>
                <td className="px-3 py-4">{f.usuario}</td>
                <td className="px-3 py-4">{f.cargo || "-"}</td>
                <td className="px-3 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${f.status === "ATIVO" ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>
                    {f.status}
                  </span>
                </td>
                <td className="px-3 py-4">{f.ultimoLogin ? new Date(f.ultimoLogin).toLocaleString("pt-BR") : "-"}</td>
                <td className="px-3 py-4">{f.criadoEm ? new Date(f.criadoEm).toLocaleDateString("pt-BR") : "-"}</td>
                <td className="px-3 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onView(f)} className="rounded-xl bg-blue-500/10 p-2 text-blue-200"><Eye size={17} /></button>
                    <button onClick={() => onEdit(f)} className="rounded-xl bg-amber-500/10 p-2 text-amber-200"><Edit3 size={17} /></button>
                    {f.status === "ATIVO" ? (
                      <button onClick={() => onBlock(f.id)} className="rounded-xl bg-red-500/10 p-2 text-red-200"><Ban size={17} /></button>
                    ) : (
                      <button onClick={() => onRelease(f.id)} className="rounded-xl bg-emerald-500/10 p-2 text-emerald-200"><LockOpen size={17} /></button>
                    )}
                    <button onClick={() => onReset(f.id)} className="rounded-xl bg-purple-500/10 p-2 text-purple-200"><KeyRound size={17} /></button>
                    <button onClick={() => onDelete(f.id)} className="rounded-xl bg-red-500/10 p-2 text-red-200"><Trash2 size={17} /></button>
                  </div>
                </td>
              </tr>
            ))}

            {filtrados.length === 0 && (
              <tr>
                <td colSpan="8" className="px-3 py-10 text-center text-slate-400">Nenhum funcionario encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
