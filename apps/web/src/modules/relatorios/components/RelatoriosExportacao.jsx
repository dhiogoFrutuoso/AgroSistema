import { Download, FileJson, FileText, Send, Sheet } from "lucide-react";
import { enviarResumoPainel, exportarCSV, exportarJSON, gerarPDFExecutivo, gerarPDFModulo } from "../services/relatoriosService.js";
import { MODULOS_RELATORIO } from "../utils/relatoriosUtils.js";
import { useState } from "react";

export default function RelatoriosExportacao() {
  const [modulo, setModulo] = useState("GERAL");

  function enviarPainel() {
    enviarResumoPainel();
    alert("Resumo de relatórios enviado para o Painel.");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-2xl bg-amber-500/20 p-4 text-amber-400"><Download size={28} /></div>
        <div>
          <h2 className="text-2xl font-black text-white">Exportações Rápidas</h2>
          <p className="text-sm text-slate-400">Gere PDF executivo, CSV, JSON e envie resumo para o Painel.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <select value={modulo} onChange={(e) => setModulo(e.target.value)} className="w-full md:w-auto rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400/60">
          {MODULOS_RELATORIO.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => gerarPDFExecutivo({ modulo, tipo: "EXECUTIVO" })} className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800 transition-colors"><FileText size={18} /> PDF Executivo</button>
          <button onClick={() => gerarPDFModulo(modulo)} className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800 transition-colors"><FileText size={18} /> PDF Módulo</button>
          <button onClick={exportarCSV} className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800 transition-colors"><Sheet size={18} /> CSV</button>
          <button onClick={exportarJSON} className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800 transition-colors"><FileJson size={18} /> JSON</button>
          <button onClick={enviarPainel} className="flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 font-black text-slate-950 hover:bg-amber-400 transition-colors"><Send size={18} /> Enviar Painel</button>
        </div>
      </div>
    </div>
  );
}