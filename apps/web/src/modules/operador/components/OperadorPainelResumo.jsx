import { Send } from "lucide-react";
import { enviarResumoPainel, money, num } from "../services/OperadorService.js";

export default function OperadorPainelResumo({ linhas, resumo }) {
  function enviar() {
    enviarResumoPainel(linhas);
    alert("Resumo do Operador enviado para o Painel.");
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
      <h2 className="text-2xl font-black text-white">Resumo para Painel</h2>
      <p className="mt-1 text-sm text-slate-400">Salva os indicadores em @arroz:operador:resumo.</p>

      <div className="mt-5 grid gap-3 md:grid-cols-5">
        <div className="rounded-2xl bg-slate-950/60 p-4 text-white">Horas<br /><b>{num(resumo.totalHoras)}</b></div>
        <div className="rounded-2xl bg-slate-950/60 p-4 text-white">Bruto<br /><b>{money(resumo.totalBruto)}</b></div>
        <div className="rounded-2xl bg-slate-950/60 p-4 text-white">Custo<br /><b>{money(resumo.custoTotal)}</b></div>
        <div className="rounded-2xl bg-slate-950/60 p-4 text-white">Lucro<br /><b>{money(resumo.lucroLiquido)}</b></div>
        <div className="rounded-2xl bg-slate-950/60 p-4 text-white">Assinados<br /><b>{resumo.assinados}</b></div>
      </div>

      <button onClick={enviar} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 font-black text-slate-950">
        <Send size={18} /> Enviar resumo para Painel
      </button>
    </section>
  );
}
