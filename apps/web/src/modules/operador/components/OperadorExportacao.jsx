import { DatabaseBackup, FileJson, Sheet } from "lucide-react";
import { backupOperador, exportarCSV, exportarJSON } from "../services/OperadorService.js";

export default function OperadorExportacao({ linhas }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
      <h2 className="text-2xl font-black text-white">Exportacoes</h2>
      <p className="mt-1 text-sm text-slate-400">CSV, JSON e backup completo do modulo.</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={() => exportarCSV(linhas)} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 font-black text-white">
          <Sheet size={18} /> Exportar CSV
        </button>
        <button onClick={() => exportarJSON(linhas)} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 font-black text-white">
          <FileJson size={18} /> Exportar JSON
        </button>
        <button onClick={() => backupOperador(linhas)} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 font-black text-white">
          <DatabaseBackup size={18} /> Backup
        </button>
      </div>
    </section>
  );
}
