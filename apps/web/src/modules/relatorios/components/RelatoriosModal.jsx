import { X, FileBarChart } from "lucide-react";
import { parseDate } from "../utils/relatoriosUtils.js";

function Info({ label, value, colSpan }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 ${colSpan ? 'md:col-span-2' : ''}`}>
      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-white break-words">{value}</p>
    </div>
  );
}

export default function RelatoriosModal({ registro, onClose }) {
  if (!registro) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">{registro.titulo}</h2>
            <p className="text-slate-400">Módulo: {registro.modulo} | Tipo: {registro.tipo}</p>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white transition hover:bg-white/20"><X size={20} /></button>
        </div>

        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
          <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl bg-slate-800 text-amber-500">
            <FileBarChart size={64} />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Info label="Responsável" value={registro.responsavel} />
            <Info label="Data de Criação" value={parseDate(registro.criadoEm)} />
            <Info label="Período de Análise" value={`${registro.periodoInicio ? new Date(registro.periodoInicio).toLocaleDateString("pt-BR",{timeZone:'UTC'}) : "Sem Início"} até ${registro.periodoFim ? new Date(registro.periodoFim).toLocaleDateString("pt-BR",{timeZone:'UTC'}) : "Sem Fim"}`} colSpan />
            <Info label="Observações e Conclusões" value={registro.observacoes || "Sem observações"} colSpan />
          </div>
        </div>
      </div>
    </div>
  );
}