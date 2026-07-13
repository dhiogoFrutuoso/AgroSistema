import {
  Banknote,
  CheckCircle2,
  Droplets,
  Gauge,
  HardHat,
  MapPinned,
  Package,
  Tractor,
  Users,
  Wheat
} from "lucide-react";
import { money, num } from "../services/painelService.js";

function Kpi({ label, value, desc, icon: Icon, tone }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl ${tone}`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-black text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{desc}</p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone}`}>
          <Icon size={27} />
        </div>
      </div>
    </div>
  );
}

export default function PainelKpiGrid({ resumo }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <Kpi label="Area total" value={`${num(resumo.areaTotal)} ha`} desc="GPS, talhoes e operacao" icon={MapPinned} tone="bg-emerald-500/10 text-emerald-300" />
      <Kpi label="Custo total" value={money(resumo.custoTotal)} desc="Custos consolidados" icon={Banknote} tone="bg-rose-500/10 text-rose-300" />
      <Kpi label="Producao" value={`${num(resumo.producaoKg / 1000)} t`} desc="Peso liquido da colheita" icon={Wheat} tone="bg-amber-500/10 text-amber-300" />
      <Kpi label="Lucro operador" value={money(resumo.lucroOperador)} desc="Horas, maquina e servico" icon={HardHat} tone="bg-blue-500/10 text-blue-300" />
      <Kpi label="Irrigacao devendo" value={money(resumo.dividaIrrigacao)} desc="Valores em aberto" icon={Droplets} tone="bg-cyan-500/10 text-cyan-300" />
      <Kpi label="Funcionarios ativos" value={resumo.funcionariosAtivos} desc="Cadastros ativos" icon={Users} tone="bg-violet-500/10 text-violet-300" />
      <Kpi label="Maquinas operando" value={resumo.maquinasOperando} desc={`${resumo.totalMaquinas} cadastradas`} icon={Tractor} tone="bg-orange-500/10 text-orange-300" />
      <Kpi label="Estoque critico" value={resumo.estoqueCritico} desc="Itens abaixo do minimo" icon={Package} tone="bg-red-500/10 text-red-300" />
      <Kpi label="Assinaturas" value={resumo.assinaturasOperador} desc="Servicos assinados" icon={CheckCircle2} tone="bg-teal-500/10 text-teal-300" />
      <Kpi label="Resultado" value={money(resumo.resultadoOperacional)} desc="Receita operador - custos" icon={Gauge} tone="bg-green-500/10 text-green-300" />
    </section>
  );
}
