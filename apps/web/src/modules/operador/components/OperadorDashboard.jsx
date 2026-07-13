import { Banknote, CheckCircle2, Clock, Droplets, Gauge, Tractor, TrendingUp, Users } from "lucide-react";
import { agrupar, money, num } from "../services/OperadorService.js";

function Card({ label, value, icon: Icon, tone }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-black text-white">{value}</p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone}`}>
          <Icon size={26} />
        </div>
      </div>
    </div>
  );
}

function BarChart({ title, items, format = "num", color = "bg-emerald-400" }) {
  const max = Math.max(...items.map((i) => i.valor), 1);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
      <h3 className="text-xl font-black text-white">{title}</h3>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.nome}>
            <div className="mb-2 flex justify-between gap-3 text-sm">
              <span className="truncate text-slate-300">{item.nome}</span>
              <strong className="text-white">{format === "money" ? money(item.valor) : num(item.valor)}</strong>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-900">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, (item.valor / max) * 100)}%` }} />
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-400">Sem dados ainda.</p>}
      </div>
    </div>
  );
}

export default function OperadorDashboard({ linhas, resumo }) {
  const horasOperador = agrupar(linhas, "nomeOperador", "horasTrabalhadas");
  const lucroMaquina = agrupar(linhas, "maquinaAgricola", "lucroLiquido");
  const rankingClientes = agrupar(linhas, "cliente", "valorTotal");

  const receitaCustoLucro = [
    { nome: "Receita", valor: resumo.totalBruto },
    { nome: "Custo", valor: resumo.custoTotal },
    { nome: "Lucro", valor: resumo.lucroLiquido }
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,.12),transparent_32%)]" />
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-amber-300">Planilha operacional</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white lg:text-6xl">Operador</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Controle de operadores, maquinas, clientes, horas trabalhadas, oleo, custo, lucro e assinatura digital.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card label="Registros" value={resumo.totalRegistros} icon={Gauge} tone="bg-blue-500/10 text-blue-300" />
        <Card label="Horas" value={num(resumo.totalHoras)} icon={Clock} tone="bg-cyan-500/10 text-cyan-300" />
        <Card label="Total Bruto" value={money(resumo.totalBruto)} icon={Banknote} tone="bg-emerald-500/10 text-emerald-300" />
        <Card label="Gasto Oleo" value={money(resumo.gastoOleo)} icon={Droplets} tone="bg-amber-500/10 text-amber-300" />
        <Card label="Custo Total" value={money(resumo.custoTotal)} icon={TrendingUp} tone="bg-rose-500/10 text-rose-300" />
        <Card label="Lucro Liquido" value={money(resumo.lucroLiquido)} icon={TrendingUp} tone="bg-green-500/10 text-green-300" />
        <Card label="Clientes" value={resumo.clientesAtendidos} icon={Users} tone="bg-violet-500/10 text-violet-300" />
        <Card label="Maquinas" value={resumo.maquinasUsadas} icon={Tractor} tone="bg-orange-500/10 text-orange-300" />
        <Card label="Assinados" value={resumo.assinados} icon={CheckCircle2} tone="bg-teal-500/10 text-teal-300" />
        <Card label="Pendentes" value={resumo.pendentes} icon={Clock} tone="bg-yellow-500/10 text-yellow-300" />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <BarChart title="Horas por Operador" items={horasOperador} />
        <BarChart title="Lucro por Maquina" items={lucroMaquina} format="money" color="bg-amber-400" />
        <BarChart title="Ranking Clientes por Valor" items={rankingClientes} format="money" color="bg-blue-400" />
        <BarChart title="Receita x Custo x Lucro" items={receitaCustoLucro} format="money" color="bg-emerald-400" />
      </section>
    </div>
  );
}
