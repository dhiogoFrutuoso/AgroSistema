import { ShieldAlert, Activity, ShieldCheck, Search, Users, Blocks, AlertTriangle, FileWarning } from "lucide-react";

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

export default function AuditoriaDashboard({ resumo }) {
  return (
    <div className="space-y-6">
      <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-8 shadow-2xl md:flex-row md:items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.1),transparent_40%)]" />
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Segurança do Sistema</p>
          <h1 className="mt-2 text-4xl font-black text-white lg:text-5xl">Logs de Auditoria</h1>
          <p className="mt-2 max-w-xl text-slate-400">Acompanhamento em tempo real de acessos, edições, exclusões e atividades críticas da plataforma.</p>
        </div>
        <div className="relative flex min-w-[200px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-center shadow-inner">
          <ShieldAlert size={32} className="text-red-400 mb-2" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Eventos Hoje</span>
          <strong className="mt-1 text-3xl font-black text-white">{resumo.hojeTotal}</strong>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Total Logs" value={resumo.total} icon={Activity} tone="bg-indigo-500/10 text-indigo-400" />
        <Card label="Avisos Críticos" value={resumo.criticos} icon={FileWarning} tone="bg-red-500/10 text-red-400" />
        <Card label="Alertas Médios" value={resumo.alertas} icon={AlertTriangle} tone="bg-amber-500/10 text-amber-400" />
        <Card label="Acessos / Logins" value={resumo.logins} icon={ShieldCheck} tone="bg-emerald-500/10 text-emerald-400" />
        <Card label="Exclusões" value={resumo.exclusoes} icon={Trash2} tone="bg-rose-500/10 text-rose-400" />
        <Card label="Exportações" value={resumo.exportacoes} icon={Search} tone="bg-blue-500/10 text-blue-400" />
        <Card label="Usuários Ativos" value={resumo.usuariosUnicos} icon={Users} tone="bg-cyan-500/10 text-cyan-400" />
        <Card label="Módulos Afetados" value={resumo.modulosUnicos} icon={Blocks} tone="bg-slate-500/10 text-slate-400" />
      </div>
    </div>
  );
}

// Helper to make Trash2 work in the dashboard
import { Trash2 } from "lucide-react";