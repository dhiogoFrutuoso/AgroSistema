import { Bell, Building2, DatabaseBackup, Lock, Palette, Settings } from "lucide-react";

function Card({ label, value, icon: Icon, tone }) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/50 p-6 shadow-xl">
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <strong className="mt-2 block text-3xl font-black text-white">{value}</strong>
      </div>
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone}`}>
        <Icon size={26} />
      </div>
    </div>
  );
}

export default function ConfiguracoesDashboard({ resumo }) {
  return (
    <div className="space-y-6">
      <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-8 shadow-2xl md:flex-row md:items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_40%)]" />
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Controle do Sistema</p>
          <h1 className="mt-2 text-4xl font-black text-white lg:text-5xl">Configurações Gerais</h1>
          <p className="mt-2 max-w-xl text-slate-400">Empresa, aparência, segurança, notificações, módulos e gestão de banco de dados.</p>
        </div>
        <div className="relative flex min-w-[200px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-center shadow-inner">
          <Settings size={32} className="text-indigo-400 mb-2" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tema Atual</span>
          <strong className="mt-1 text-2xl font-black text-white">{resumo.tema}</strong>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card label="Empresa" value={resumo.empresa} icon={Building2} tone="bg-green-500/10 text-green-400" />
        <Card label="Módulos Ativos" value={resumo.modulosAtivos} icon={Settings} tone="bg-blue-500/10 text-blue-400" />
        <Card label="Notificações" value={resumo.notificacoesAtivas} icon={Bell} tone="bg-amber-500/10 text-amber-400" />
        <Card label="Exportação" value={resumo.exportacaoLiberada ? "SIM" : "NÃO"} icon={DatabaseBackup} tone="bg-emerald-500/10 text-emerald-400" />
        <Card label="Segurança" value={resumo.segurancaAtiva} icon={Lock} tone="bg-red-500/10 text-red-400" />
        <Card label="Aparência" value={resumo.tema} icon={Palette} tone="bg-cyan-500/10 text-cyan-400" />
      </div>
    </div>
  );
}