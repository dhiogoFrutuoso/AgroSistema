import { ArrowUpRight, Gauge, Layers, Leaf, TrendingUp } from "lucide-react";
import { num } from "../services/painelService.js";

function KpiCard({ icon: Icon, label, value, sub, tone, bar }) {
  return (
    <div className="rounded-[1.8rem] border border-white/10 bg-[#0b1420]/90 p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone}`}>
          <Icon size={27} />
        </div>
        <ArrowUpRight size={18} className="text-slate-500" />
      </div>
      <p className="mt-5 text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-white">{value}</p>
      <p className="mt-3 text-xs font-bold text-emerald-300">{sub}</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-emerald-400" style={{ width: `${Math.min(100, Number(bar || 0))}%` }} />
      </div>
    </div>
  );
}

export default function PainelCards({ data }) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard icon={Leaf} label="Area total" value={`${num(data.areaTotal)} ha`} sub="100% da fazenda" tone="bg-emerald-500/10 text-emerald-300" bar={100} />
      <KpiCard icon={Layers} label="Talhoes ativos" value={data.talhoes.length || data.gpsAreas.length} sub="+2 este mes" tone="bg-blue-500/10 text-blue-300" bar={72} />
      <KpiCard icon={Gauge} label="Indice de saude" value={`${num(data.saude, 0)}%`} sub={data.saude >= 80 ? "Muito bom" : "Precisa atencao"} tone="bg-emerald-500/10 text-emerald-300" bar={data.saude} />
      <KpiCard icon={TrendingUp} label="Producao estimada" value={`${num(data.producaoSc, 0)} sc`} sub="+18% vs safra anterior" tone="bg-purple-500/10 text-purple-300" bar={68} />
    </section>
  );
}
