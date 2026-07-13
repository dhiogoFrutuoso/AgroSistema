import { Image, MapPinned, Ruler, Sprout, Target, Tractor } from "lucide-react";

function num(v, d = 2) {
  return Number(v || 0).toLocaleString("pt-BR", { maximumFractionDigits: d });
}

function Card({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-black text-white">{value}</p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone}`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}

export default function TalhoesDashboard({ resumo }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
      <Card icon={Sprout} label="Talhoes" value={resumo.total} tone="bg-emerald-500/10 text-emerald-300" />
      <Card icon={MapPinned} label="Area total" value={`${num(resumo.areaTotal)} ha`} tone="bg-blue-500/10 text-blue-300" />
      <Card icon={Ruler} label="Perimetro" value={`${num(resumo.perimetroTotal)} m`} tone="bg-amber-500/10 text-amber-300" />
      <Card icon={Target} label="Vindos GPS" value={resumo.gps} tone="bg-cyan-500/10 text-cyan-300" />
      <Card icon={Image} label="Com imagem" value={resumo.comImagem} tone="bg-violet-500/10 text-violet-300" />
      <Card icon={Tractor} label="Ativos" value={resumo.ativos} tone="bg-teal-500/10 text-teal-300" />
    </div>
  );
}
