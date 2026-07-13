import { useEffect, useState } from "react";
import { Download, FileJson, RefreshCcw } from "lucide-react";
import PainelCharts from "./components/PainelCharts.jsx";
import PainelKpiGrid from "./components/PainelKpiGrid.jsx";
import PainelMapaAtividades from "./components/PainelMapaAtividades.jsx";
import PainelResumoFinanceiro from "./components/PainelResumoFinanceiro.jsx";
import {
  audit,
  exportarPainelJSON,
  exportarPainelPDF,
  getResumoPainel,
  getResumoPainelApiFirst
} from "./services/painelService.js";

export default function PainelPage() {
  const [dados, setDados] = useState(() => getResumoPainel());

  const { resumo, graficos, auditoria } = dados;

  async function carregarPainel() {
    const atualizado = await getResumoPainelApiFirst();
    setDados(atualizado);
  }

  useEffect(() => {
    carregarPainel();
  }, []);

  async function atualizar() {
    audit("VISUALIZACAO", "Painel atualizado manualmente");
    await carregarPainel();
  }

  return (
    <div className="space-y-6 text-white">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,.14),transparent_32%)]" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-amber-300">ARROZ DOS FERREIRAS</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white lg:text-6xl">Painel Executivo</h1>
            <p className="mt-3 max-w-4xl text-slate-300">
              Dashboard conectado aos modulos: GPS, Talhoes, Plantio, Colheita, Irrigacao, Estoque, Maquinas, Documentos, Auditoria, Financeiro e Configuracoes.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={atualizar} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-4 font-black text-slate-950">
              <RefreshCcw size={20} /> Atualizar
            </button>

            <button onClick={exportarPainelPDF} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 font-black text-white">
              <Download size={20} /> PDF
            </button>

            <button onClick={exportarPainelJSON} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 font-black text-white">
              <FileJson size={20} /> JSON
            </button>
          </div>
        </div>
      </section>

      <PainelKpiGrid resumo={resumo} />

      <PainelResumoFinanceiro resumo={resumo} />

      <PainelCharts graficos={graficos} />

      <PainelMapaAtividades resumo={resumo} auditoria={auditoria} />
    </div>
  );
}
