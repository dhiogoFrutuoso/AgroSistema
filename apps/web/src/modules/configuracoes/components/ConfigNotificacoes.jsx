function SwitchBtn({ label, checked, onChange }) {
  return (
    <button type="button" onClick={onChange} className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 transition-colors ${checked ? 'border-amber-500/50 bg-amber-500/10' : 'border-white/5 bg-slate-950/50 hover:bg-white/5'}`}>
      <span className="font-bold text-slate-300">{label}</span>
      <span className={`text-xs font-black uppercase tracking-widest ${checked ? 'text-amber-400' : 'text-slate-500'}`}>{checked ? 'ON' : 'OFF'}</span>
    </button>
  );
}

export default function ConfigNotificacoes({ config, toggleGrupo }) {
  const n = config.notificacoes;
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-6"><h2 className="text-2xl font-black text-white">Notificações Inteligentes</h2><p className="text-sm text-slate-400">Avisos na tela de Dashboard e ícone de sino.</p></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(n).map(([key, value]) => (
          <SwitchBtn key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} checked={value} onChange={() => toggleGrupo("notificacoes", key)} />
        ))}
      </div>
    </div>
  );
}