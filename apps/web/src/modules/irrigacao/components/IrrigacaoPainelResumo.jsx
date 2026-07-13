import { Send } from "lucide-react";

function money(v) {
  return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function IrrigacaoPainelResumo({ resumo, onEnviar }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <h2 className="text-3xl font-black text-white">Resumo Painel</h2>
      <p className="mb-5 mt-2 text-sm text-slate-400">Envia os indicadores de irrigacao para o Painel principal.</p>

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-slate-950/50 p-4 text-white">Total: <b>{resumo.total}</b></div>
        <div className="rounded-2xl bg-slate-950/50 p-4 text-white">Hectares: <b>{Number(resumo.hectares || 0).toFixed(2)} ha</b></div>
        <div className="rounded-2xl bg-slate-950/50 p-4 text-white">Devendo: <b>{money(resumo.valorDevido)}</b></div>
        <div className="rounded-2xl bg-slate-950/50 p-4 text-white">Pagos: <b>{resumo.pagos}</b></div>
      </div>

      <button onClick={onEnviar} className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-6 py-4 font-black text-slate-950 transition hover:bg-amber-300">
        <Send size={20} /> Enviar resumo para Painel
      </button>
    </div>
  );
}
