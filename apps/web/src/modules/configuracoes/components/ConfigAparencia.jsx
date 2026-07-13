import { TEMAS, DENSIDADES } from "../services/configuracoesService.js";

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-indigo-400/60";

function SwitchBtn({ label, checked, onChange }) {
  return (
    <button type="button" onClick={onChange} className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 transition-colors ${checked ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/5 bg-slate-950/50 hover:bg-white/5'}`}>
      <span className="font-bold text-slate-300">{label}</span>
      <span className={`text-xs font-black uppercase tracking-widest ${checked ? 'text-indigo-400' : 'text-slate-500'}`}>{checked ? 'ON' : 'OFF'}</span>
    </button>
  );
}

export default function ConfigAparencia({ config, updateGrupo, toggleGrupo }) {
  const a = config.aparencia;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Aparência e Tema</h2>
        <p className="text-sm text-slate-400">Personalize as cores e o layout do sistema.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Tema do Sistema</span>
          <select className={inputClass} value={a.tema} onChange={(e) => updateGrupo("aparencia", "tema", e.target.value)}>
            {TEMAS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Densidade de Itens</span>
          <select className={inputClass} value={a.densidade} onChange={(e) => updateGrupo("aparencia", "densidade", e.target.value)}>
            {DENSIDADES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Cor Principal</span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-2 pr-4">
             <input type="color" className="h-8 w-12 cursor-pointer rounded bg-transparent outline-none" value={a.corPrincipal} onChange={(e) => updateGrupo("aparencia", "corPrincipal", e.target.value)} />
             <span className="text-white font-mono text-sm">{a.corPrincipal}</span>
          </div>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Cor de Destaque</span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-2 pr-4">
             <input type="color" className="h-8 w-12 cursor-pointer rounded bg-transparent outline-none" value={a.corDestaque} onChange={(e) => updateGrupo("aparencia", "corDestaque", e.target.value)} />
             <span className="text-white font-mono text-sm">{a.corDestaque}</span>
          </div>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <SwitchBtn label="Modo Premium (Blur)" checked={a.modoPremium} onChange={() => toggleGrupo("aparencia", "modoPremium")} />
        <SwitchBtn label="Mostrar Cards KPI" checked={a.mostrarCards} onChange={() => toggleGrupo("aparencia", "mostrarCards")} />
        <SwitchBtn label="Mostrar Gráficos" checked={a.mostrarGraficos} onChange={() => toggleGrupo("aparencia", "mostrarGraficos")} />
      </div>
    </div>
  );
}