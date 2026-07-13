import { Activity, AlertTriangle, CheckCircle2, Lock } from "lucide-react";
import { acaoClass, formatDate, nivelClass } from "../utils/auditoriaUtils.js";

function IconNivel({ nivel }) {
  const n = String(nivel || "INFO").toUpperCase();
  if (n === "CRITICO") return <Lock size={18} />;
  if (n === "ALERTA") return <AlertTriangle size={18} />;
  return <CheckCircle2 size={18} />;
}

export default function AuditoriaTimeline({ registros, onSelect }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-4">
        <Activity className="text-indigo-400" size={32} />
        <div>
          <h2 className="text-2xl font-black text-white">Timeline em Tempo Real</h2>
          <p className="text-sm text-slate-400">Últimos eventos registrados no sistema.</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {registros.slice(0, 12).map((item) => (
          <div key={item.id || item._id} onClick={() => onSelect(item)} className="flex cursor-pointer items-start gap-4 rounded-2xl border border-white/5 bg-slate-950/40 p-5 hover:bg-slate-900/60 transition-colors">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${String(item.nivel).toUpperCase() === 'CRITICO' ? 'bg-red-500/10 text-red-400' : String(item.nivel).toUpperCase() === 'ALERTA' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <IconNivel nivel={item.nivel} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <strong className="text-sm text-white truncate">{item.acao || "AÇÃO"}</strong>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">{formatDate(item.dataHora)}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">{item.modulo || "Sistema"} • {item.descricao || "-"}</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${acaoClass(item.acao)}`}>{item.acao}</span>
                <span className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${nivelClass(item.nivel)}`}>{item.nivel}</span>
                <span className="inline-block rounded-md bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-300 truncate max-w-[100px]">{item.usuario || "Sistema"}</span>
              </div>
            </div>
          </div>
        ))}

        {registros.length === 0 && <p className="col-span-full py-10 text-center text-slate-500">Nenhum evento detectado recentemente.</p>}
      </div>
    </div>
  );
}