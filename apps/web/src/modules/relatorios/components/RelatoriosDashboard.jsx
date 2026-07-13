import { AlertTriangle, Banknote, ClipboardList, Droplets, FileText, MapPinned, Package, Tractor } from "lucide-react";
import { money, num } from "../utils/relatoriosUtils.js";

function Card({ label, value, icon: Icon, tone }) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/50 p-6 shadow-xl">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
        <strong className="mt-2 block text-3xl font-black text-white">{value}</strong>
      </div>
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone}`}>
        <Icon size={26} />
      </div>
    </div>
  );
}

export default function RelatoriosDashboard({ resumo }) {
  return (
    <div className="space-y-6">
      <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-8 shadow-2xl md:flex-row md:items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_40%)]" />
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-widest text-blue-400">Central de Relatórios</p>
          <h1 className="mt-2 text-4xl font-black text-white lg:text-5xl">Relatórios Gerenciais</h1>
          <p className="mt-2 max-w-xl text-slate-400">Relatórios executivos, operacionais, financeiros, técnicos e auditoria do ERP.</p>
        </div>
        <div className="relative flex min-w-[200px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-center shadow-inner">
          <FileText size={32} className="text-blue-400 mb-2" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consolidado</span>
          <strong className="mt-1 text-2xl font-black text-white">{new Date().toLocaleDateString("pt-BR")}</strong>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card label="Área Total" value={`${num(resumo.areaTotal)} ha`} icon={MapPinned} tone="bg-emerald-500/10 text-emerald-400" />
        <Card label="Custo Total" value={money(resumo.custoTotal)} icon={Banknote} tone="bg-amber-500/10 text-amber-400" />
        <Card label="Irrigação Devendo" value={money(resumo.dividaIrrigacao)} icon={Droplets} tone="bg-blue-500/10 text-blue-400" />
        <Card label="Estoque Crítico" value={resumo.estoqueCritico} icon={AlertTriangle} tone="bg-red-500/10 text-red-400" />
        <Card label="Máquinas" value={resumo.maquinas} icon={Tractor} tone="bg-cyan-500/10 text-cyan-400" />
        <Card label="Documentos" value={resumo.documentos} icon={Package} tone="bg-violet-500/10 text-violet-400" />
        <Card label="Auditoria" value={resumo.auditoria} icon={ClipboardList} tone="bg-slate-500/10 text-slate-400" />
      </div>
    </div>
  );
}