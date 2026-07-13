function SwitchBtn({ label, checked, onChange }) {
  return (
    <button type="button" onClick={onChange} className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 transition-colors ${checked ? 'border-red-500/50 bg-red-500/10' : 'border-white/5 bg-slate-950/50 hover:bg-white/5'}`}>
      <span className="font-bold text-slate-300">{label}</span>
      <span className={`text-xs font-black uppercase tracking-widest ${checked ? 'text-red-400' : 'text-slate-500'}`}>{checked ? 'ON' : 'OFF'}</span>
    </button>
  );
}

export default function ConfigSeguranca({ config, toggleGrupo }) {
  const s = config.seguranca;
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-6"><h2 className="text-2xl font-black text-white">Segurança e Permissões</h2><p className="text-sm text-slate-400">Controle de acesso e restrições globais.</p></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SwitchBtn label="Exigir Senha no Login" checked={s.exigirSenha} onChange={() => toggleGrupo("seguranca", "exigirSenha")} />
        <SwitchBtn label="Bloquear Auditoria (Func)" checked={s.bloquearAuditoriaFuncionario} onChange={() => toggleGrupo("seguranca", "bloquearAuditoriaFuncionario")} />
        <SwitchBtn label="Permitir Exportações JSON/CSV" checked={s.permitirExportacao} onChange={() => toggleGrupo("seguranca", "permitirExportacao")} />
        <SwitchBtn label="Permitir Backup Local" checked={s.permitirBackup} onChange={() => toggleGrupo("seguranca", "permitirBackup")} />
        <SwitchBtn label="Manter Sessão Ativa" checked={s.sessaoLocal} onChange={() => toggleGrupo("seguranca", "sessaoLocal")} />
      </div>
    </div>
  );
}