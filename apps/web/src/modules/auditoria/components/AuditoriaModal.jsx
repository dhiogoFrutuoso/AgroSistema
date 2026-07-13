import { X, ShieldAlert } from "lucide-react";
import { formatDate } from "../utils/auditoriaUtils.js";

function Info({ label, value, colSpan }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 ${colSpan ? 'md:col-span-2' : ''}`}>
      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-white break-words">{value}</p>
    </div>
  );
}

export default function AuditoriaModal({ registro, onClose }) {
  if (!registro) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-4xl rounded-[2rem] border border-white/10 bg-[#0B0F19] p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">Log de Segurança</h2>
            <p className="mt-1 text-sm text-slate-400">ID: {registro.id || registro._id}</p>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <div className={`flex h-48 w-48 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-slate-900 ${String(registro.nivel).toUpperCase() === 'CRITICO' ? 'text-red-500' : String(registro.nivel).toUpperCase() === 'ALERTA' ? 'text-amber-500' : 'text-emerald-500'}`}>
            <ShieldAlert size={64} />
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1" style={{ maxHeight: "60vh" }}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Info label="Usuário Executante" value={registro.usuario || "Sistema"} />
              <Info label="Módulo Afetado" value={registro.modulo || "-"} />
              <Info label="Ação Realizada" value={registro.acao || "INFO"} />
              <Info label="Nível de Severidade" value={registro.nivel || "INFO"} />
              <Info label="Data e Hora Exata" value={formatDate(registro.dataHora)} colSpan />
              <Info label="Descrição / Detalhes" value={registro.descricao || "-"} colSpan />
            </div>
            
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Payload Bruto (JSON)</p>
              <pre className="text-xs text-slate-300 font-mono overflow-auto max-h-32">
                {JSON.stringify(registro, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}