import { Send } from "lucide-react";

export default function ColheitaPainelResumo({ resumo, onEnviar }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <h2 className="text-xl font-black text-white">Resumo Painel</h2>
      <p className="mb-5 text-sm text-slate-400">Envia indicadores consolidados para o Painel principal.</p>

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-slate-950/50 p-4 text-white">Total: <b>{resumo.total}</b></div>
        <div className="rounded-2xl bg-slate-950/50 p-4 text-white">Area: <b>{Number(resumo.area || 0).toFixed(2)} ha</b></div>
        <div className="rounded-2xl bg-slate-950/50 p-4 text-white">Peso: <b>{Number(resumo.peso || 0).toFixed(2)} kg</b></div>
        <div className="rounded-2xl bg-slate-950/50 p-4 text-white">Finalizadas: <b>{resumo.finalizadas}</b></div>
      </div>

      <button onClick={onEnviar} className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 font-black text-slate-950 transition hover:bg-amber-300">
        <Send size={18} /> Enviar resumo para Painel
      </button>
    </div>
  );
}
