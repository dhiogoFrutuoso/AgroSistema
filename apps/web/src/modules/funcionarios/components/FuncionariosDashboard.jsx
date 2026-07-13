import { ShieldCheck, UserCheck, UserX, Users, Wrench } from "lucide-react";

function Card({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-black text-white">{value}</p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone}`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}

export default function FuncionariosDashboard({ resumo }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
      <Card icon={Users} label="Total" value={resumo.total} tone="bg-blue-500/10 text-blue-300" />
      <Card icon={UserCheck} label="Ativos" value={resumo.ativos} tone="bg-emerald-500/10 text-emerald-300" />
      <Card icon={UserX} label="Bloqueados" value={resumo.bloqueados} tone="bg-red-500/10 text-red-300" />
      <Card icon={ShieldCheck} label="Admins" value={resumo.admins} tone="bg-amber-500/10 text-amber-300" />
      <Card icon={Wrench} label="Operadores" value={resumo.operadores} tone="bg-purple-500/10 text-purple-300" />
    </div>
  );
}
