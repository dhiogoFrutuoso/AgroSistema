import { AlertTriangle, Droplets, FileText, Gauge, Leaf, Package, Sprout, Wallet } from "lucide-react";
import { money, num, pct } from "../services/painelService.js";

function ActivityRow({ icon: Icon, title, desc, status, tone }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tone}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-white">{title}</p>
        <p className="truncate text-xs text-slate-400">{desc}</p>
      </div>
      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">{status}</span>
    </div>
  );
}

function Progress({ label, value, color }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs">
        <span className="text-slate-300">{label}</span>
        <span className="font-black text-white">{pct(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, Number(value || 0))}%` }} />
      </div>
    </div>
  );
}

function AlertRow({ tone, title, desc }) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 ${tone}`}>
      <AlertTriangle size={20} />
      <div>
        <p className="font-black text-white">{title}</p>
        <p className="mt-1 text-xs text-slate-300">{desc}</p>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, desc, tone }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
      <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
        <Icon size={22} />
      </div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{desc}</p>
    </div>
  );
}

export default function PainelOperacao({ data }) {
  const maquinasPct = data.maquinas.length ? (data.maquinasAtivas / data.maquinas.length) * 100 : 0;

  return (
    <>
      <section className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-[2rem] border border-white/10 bg-[#0b1420]/90 p-5 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-4 text-xl font-black text-white">Atividades recentes</h2>
          <div className="space-y-3">
            <ActivityRow icon={Droplets} title="Irrigacao realizada" desc={`${data.irrigacao.length} registros no modulo`} status="Concluido" tone="bg-cyan-500/10 text-cyan-300" />
            <ActivityRow icon={Sprout} title="Plantio realizado" desc={`${data.plantio.length} plantios cadastrados`} status="Em andamento" tone="bg-emerald-500/10 text-emerald-300" />
            <ActivityRow icon={Leaf} title="Colheita registrada" desc={`${data.colheita.length} colheitas lancadas`} status="Concluido" tone="bg-lime-500/10 text-lime-300" />
            <ActivityRow icon={FileText} title="Documentos adicionados" desc={`${data.arquivos.length} arquivos no banco local`} status="Arquivo" tone="bg-purple-500/10 text-purple-300" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[#0b1420]/90 p-5 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-4 text-xl font-black text-white">Operacao</h2>
          <div className="space-y-5">
            <Progress label="Area plantada" value={data.areaPlantadaPct} color="bg-emerald-400" />
            <Progress label="Area colhida" value={data.areaColhidaPct} color="bg-amber-400" />
            <Progress label="Saude operacional" value={data.saude} color="bg-blue-400" />
            <Progress label="Maquinas ativas" value={maquinasPct} color="bg-purple-400" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[#0b1420]/90 p-5 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-4 text-xl font-black text-white">Alertas e notificacoes</h2>
          <div className="space-y-3">
            <AlertRow title="Irrigacao devendo" desc={money(data.dividaIrrigacao)} tone="border-amber-400/20 bg-amber-500/10 text-amber-300" />
            <AlertRow title="Estoque critico" desc={`${data.estoqueCritico} itens abaixo do minimo`} tone="border-red-400/20 bg-red-500/10 text-red-300" />
            <AlertRow title="Maquinas cadastradas" desc={`${data.maquinas.length} registros de frota`} tone="border-blue-400/20 bg-blue-500/10 text-blue-300" />
            <AlertRow title="Auditoria" desc={`${data.auditoria.length} eventos registrados`} tone="border-emerald-400/20 bg-emerald-500/10 text-emerald-300" />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#0b1420]/90 p-5 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-5 text-xl font-black text-white">Resumo da Safra 2025/2026</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard icon={Sprout} label="Area plantada" value={`${num(data.areaPlantada)} ha`} desc={`${pct(data.areaPlantadaPct)} do total`} tone="bg-emerald-500/10 text-emerald-300" />
          <SummaryCard icon={Leaf} label="Area colhida" value={`${num(data.areaColhida)} ha`} desc={`${pct(data.areaColhidaPct)} do total`} tone="bg-amber-500/10 text-amber-300" />
          <SummaryCard icon={Gauge} label="Produtividade media" value={`${num(data.produtividade)} sc/ha`} desc="+12,4% vs safra anterior" tone="bg-blue-500/10 text-blue-300" />
          <SummaryCard icon={Package} label="Producao total" value={`${num(data.producaoSc, 0)} sc`} desc="+18% vs safra anterior" tone="bg-purple-500/10 text-purple-300" />
          <SummaryCard icon={Wallet} label="Custo operacional" value={money(data.custoTotal)} desc="Plantio + colheita + agua" tone="bg-green-500/10 text-green-300" />
        </div>
      </section>
    </>
  );
}
