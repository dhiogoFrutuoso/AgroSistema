import { DatabaseBackup, Download, RotateCcw, Save, Send, Upload } from "lucide-react";
import { backupCompleto, enviarResumoPainel, exportarConfiguracoes } from "../services/configuracoesService.js";

export default function ConfigBackup({ config, onSave, onReset, onImport }) {
  function enviar() { enviarResumoPainel(); alert("Resumo enviado para o Painel."); }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Backup e Ações Globais</h2>
          <p className="text-sm text-slate-400">Salve as mudanças, exporte os dados ou restaure a fábrica.</p>
        </div>
        <button onClick={onSave} className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 font-black text-white shadow-lg shadow-indigo-900/50 hover:bg-indigo-500 transition-colors">
          <Save size={20} /> Salvar Tudo
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={backupCompleto} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800 transition-colors"><DatabaseBackup size={18} /> Backup Full</button>
        <button onClick={exportarConfiguracoes} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800 transition-colors"><Download size={18} /> Exportar Config</button>
        <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800 transition-colors">
          <Upload size={18} /> Importar Config
          <input type="file" accept="application/json,.json" className="hidden" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
        </label>
        <button onClick={enviar} className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 font-bold text-amber-400 hover:bg-amber-500/20 transition-colors"><Send size={18} /> Painel</button>
        <button onClick={onReset} className="flex items-center gap-2 rounded-2xl bg-red-500/10 px-5 py-3 font-bold text-red-400 hover:bg-red-500/20 transition-colors ml-auto"><RotateCcw size={18} /> Padrão de Fábrica</button>
      </div>

      <div className="mt-8 rounded-2xl border border-white/5 bg-slate-950 p-6">
        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-400">Histórico de Alterações</h3>
        <div className="space-y-3">
          {(config.historico || []).slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-start justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
              <div>
                <strong className="text-sm text-white">{item.acao}</strong>
                <p className="text-xs text-slate-400">{item.descricao}</p>
              </div>
              <span className="text-xs text-slate-500">{new Date(item.dataHora).toLocaleString("pt-BR", {timeZone: 'UTC'})}</span>
            </div>
          ))}
          {(config.historico || []).length === 0 && <p className="text-sm text-slate-500">Nenhum histórico registrado ainda.</p>}
        </div>
      </div>
    </div>
  );
}