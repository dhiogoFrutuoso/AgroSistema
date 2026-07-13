import { BarChart3 } from "lucide-react";

export default function PlantioPainelResumo({ resumo }) {
  function gerarResumo() {
    localStorage.setItem("@arroz:plantio:resumo", JSON.stringify(resumo));
    alert("Resumo de plantio enviado para o Painel.");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-white">Resumo para Painel</h2>
        <p className="text-sm text-slate-400">Envia indicadores consolidados do plantio para o painel principal.</p>
      </div>

      <button onClick={gerarResumo} className="flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 font-black text-white hover:bg-purple-500 transition-colors">
        <BarChart3 size={18} /> Enviar resumo
      </button>
    </div>
  );
}