import { Banknote, Boxes, ClipboardList, Gauge, TrendingUp } from "lucide-react";
import { money } from "../services/painelService.js";

function MiniCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black text-white">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

export default function PainelResumoFinanceiro({ resumo }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Resumo financeiro executivo</h2>
          <p className="text-sm text-slate-400">Receita, custos, estoque, financeiro e resultado operacional.</p>
        </div>
        <TrendingUp className="text-emerald-300" size={30} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MiniCard label="Receita operador" value={money(resumo.receitaOperador)} icon={Banknote} />
        <MiniCard label="Custos operacionais" value={money(resumo.custoTotal)} icon={Gauge} />
        <MiniCard label="Valor em estoque" value={money(resumo.custoEstoque)} icon={Boxes} />
        <MiniCard label="Financeiro lancado" value={money(resumo.valorFinanceiro)} icon={ClipboardList} />
        <MiniCard label="Resultado estimado" value={money(resumo.resultadoOperacional)} icon={TrendingUp} />
      </div>
    </section>
  );
}
