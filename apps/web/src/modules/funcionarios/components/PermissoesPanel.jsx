import { CheckSquare, Square } from "lucide-react";
import { FULL_PERMISSOES, MODULOS } from "../services/funcionariosService.js";

export default function PermissoesPanel({ value, onChange }) {
  function setAll(next) {
    onChange(next ? { ...FULL_PERMISSOES } : Object.fromEntries(MODULOS.map(([key]) => [key, false])));
  }

  function toggle(key) {
    onChange({ ...value, [key]: !value?.[key] });
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-black text-white">Permissoes</h3>
          <p className="text-sm text-slate-400">Controle modulo por modulo.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setAll(true)} className="rounded-xl bg-emerald-500 px-4 py-2 font-black text-slate-950">Marcar Tudo</button>
          <button type="button" onClick={() => setAll(false)} className="rounded-xl bg-slate-800 px-4 py-2 font-black text-white">Desmarcar Tudo</button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {MODULOS.map(([key, label]) => {
          const checked = Boolean(value?.[key]);
          return (
            <button type="button" key={key} onClick={() => toggle(key)} className={`flex items-center gap-3 rounded-2xl border p-3 text-left font-bold ${checked ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200" : "border-white/10 bg-slate-900/70 text-slate-300"}`}>
              {checked ? <CheckSquare size={19} /> : <Square size={19} />}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
