import { FileJson, FileText, Send, Sheet, Trash2, Zap, ShieldAlert } from "lucide-react";
import { enviarResumoPainel, exportarCSV, exportarJSON, exportarPDF } from "../services/auditoriaService.js";

export default function AuditoriaExportacao({ registros, onLimpar, onTeste }) {
  function enviar() {
    enviarResumoPainel();
    alert("Resumo de auditoria enviado para o Painel.");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-indigo-500/20 p-3 text-indigo-400"><ShieldAlert size={28} /></div>
          <div>
            <h2 className="text-2xl font-black text-white">Ações de Segurança</h2>
            <p className="text-sm text-slate-400">Exportar dados, forçar evento teste ou apagar histórico.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => exportarPDF(registros)} className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800 transition-colors"><FileText size={18} /> PDF</button>
          <button onClick={() => exportarCSV(registros)} className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800 transition-colors"><Sheet size={18} /> CSV</button>
          <button onClick={() => exportarJSON(registros)} className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800 transition-colors"><FileJson size={18} /> JSON</button>
          <button onClick={enviar} className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 font-black text-white hover:bg-indigo-500 transition-colors"><Send size={18} /> Painel</button>
          <button onClick={onTeste} className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 font-bold text-amber-400 hover:bg-amber-500/20 transition-colors"><Zap size={18} /> Teste</button>
          <button onClick={onLimpar} className="flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-black text-white hover:bg-red-500 transition-colors"><Trash2 size={18} /> Limpar Tudo</button>
        </div>
      </div>
    </div>
  );
}