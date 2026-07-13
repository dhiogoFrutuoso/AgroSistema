import { Download, FileJson, Sheet } from "lucide-react";

export default function ColheitaExportacao({ onCSV, onJSON, onBackup }) {
  const btn = "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 font-bold text-white transition hover:bg-slate-800";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <h2 className="text-xl font-black text-white">Exportacoes</h2>
      <p className="mb-5 text-sm text-slate-400">CSV, JSON e backup local do modulo.</p>

      <div className="grid gap-3 md:grid-cols-3">
        <button onClick={onCSV} className={btn}><Sheet size={18} /> Exportar CSV</button>
        <button onClick={onJSON} className={btn}><FileJson size={18} /> Exportar JSON</button>
        <button onClick={onBackup} className={btn}><Download size={18} /> Backup</button>
      </div>
    </div>
  );
}
