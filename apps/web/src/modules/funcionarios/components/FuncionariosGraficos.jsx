export default function FuncionariosGraficos({ funcionarios, resumo }) {
  const cargos = funcionarios.reduce((acc, f) => {
    const cargo = f.cargo || "Sem cargo";
    acc[cargo] = (acc[cargo] || 0) + 1;
    return acc;
  }, {});

  const max = Math.max(...Object.values(cargos), 1);

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <h2 className="text-xl font-black text-white">Funcionarios por cargo</h2>
        <div className="mt-5 space-y-4">
          {Object.entries(cargos).map(([cargo, total]) => (
            <div key={cargo}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-300">{cargo}</span>
                <b className="text-white">{total}</b>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: `${(total / max) * 100}%` }} />
              </div>
            </div>
          ))}
          {funcionarios.length === 0 && <p className="text-slate-400">Nenhum funcionario cadastrado.</p>}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <h2 className="text-xl font-black text-white">Ativos x Bloqueados</h2>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-3xl bg-emerald-500/10 p-6 text-center">
            <p className="text-4xl font-black text-emerald-300">{resumo.ativos}</p>
            <p className="mt-2 text-sm text-slate-300">Ativos</p>
          </div>
          <div className="rounded-3xl bg-red-500/10 p-6 text-center">
            <p className="text-4xl font-black text-red-300">{resumo.bloqueados}</p>
            <p className="mt-2 text-sm text-slate-300">Bloqueados</p>
          </div>
        </div>
      </div>
    </div>
  );
}
