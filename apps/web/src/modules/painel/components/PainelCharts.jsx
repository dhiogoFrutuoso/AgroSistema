import {
  AlertTriangle,
  BarChart3,
  Clock,
  ClipboardList,
  Database,
  Droplets,
  Gauge,
  HardHat,
  MapPinned,
  PieChart,
  TrendingUp
} from "lucide-react";
import { money, num } from "../services/painelService.js";

function ChartCard({ title, desc, icon: Icon, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{desc}</p>
        </div>
        <Icon className="text-amber-300" size={30} />
      </div>
      {children}
    </section>
  );
}

function Bar({ label, value, max, format = "number" }) {
  const pct = max > 0 ? Math.min(100, (Number(value || 0) / max) * 100) : 0;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="truncate text-slate-300">{label}</span>
        <strong className="text-white">{format === "money" ? money(value) : num(value)}</strong>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-900">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-green-400 to-amber-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Donut({ items }) {
  const total = items.reduce((s, i) => s + Number(i.valor || 0), 0) || 1;
  let acumulado = 0;

  const grad = items.map((item) => {
    const start = (acumulado / total) * 360;
    acumulado += Number(item.valor || 0);
    const end = (acumulado / total) * 360;
    return `#22c55e ${start}deg ${end}deg`;
  }).join(", ");

  return (
    <div className="grid gap-5 md:grid-cols-[220px_1fr]">
      <div className="relative mx-auto h-52 w-52 rounded-full" style={{ background: `conic-gradient(${grad || "#0f172a 0deg 360deg"})` }}>
        <div className="absolute inset-8 grid place-items-center rounded-full bg-slate-950 text-center">
          <strong className="text-3xl text-white">{num(total, 0)}</strong>
          <span className="text-xs text-slate-400">total</span>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.nome} className="flex justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
            <span className="text-slate-300">{item.nome}</span>
            <strong className="text-white">{num(item.valor, 0)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PainelCharts({ graficos }) {
  const maxCustos = Math.max(...graficos.custos.map((i) => Number(i.valor || 0)), 1);
  const maxAreas = Math.max(...graficos.areas.map((i) => Number(i.valor || 0)), 1);
  const maxRegistros = Math.max(...graficos.registros.map((i) => Number(i.valor || 0)), 1);
  const maxStatus = Math.max(...graficos.status.map((i) => Number(i.valor || 0)), 1);
  const maxHoras = Math.max(...graficos.operadorHoras.map((i) => Number(i.valor || 0)), 1);
  const maxLucro = Math.max(...graficos.operadorLucroMaquina.map((i) => Number(i.valor || 0)), 1);
  const maxClientes = Math.max(...graficos.operadorClientes.map((i) => Number(i.valor || 0)), 1);
  const maxIrrigacao = Math.max(...graficos.irrigacaoEmpresas.map((i) => Number(i.valor || 0)), 1);

  return (
    <div className="space-y-5">
      <section className="grid gap-5 xl:grid-cols-3">
        <ChartCard title="Custos por modulo" desc="Comparativo dos principais centros de custo." icon={BarChart3}>
          <div className="space-y-5">
            {graficos.custos.map((item) => <Bar key={item.nome} label={item.nome} value={item.valor} max={maxCustos} format="money" />)}
          </div>
        </ChartCard>

        <ChartCard title="Areas por operacao" desc="Hectares mapeados, plantados, colhidos e irrigados." icon={MapPinned}>
          <div className="space-y-5">
            {graficos.areas.map((item) => <Bar key={item.nome} label={item.nome} value={item.valor} max={maxAreas} />)}
          </div>
        </ChartCard>

        <ChartCard title="Alertas de operacao" desc="Pendencias e pontos de atencao." icon={AlertTriangle}>
          <div className="space-y-5">
            {graficos.status.map((item) => <Bar key={item.nome} label={item.nome} value={item.valor} max={maxStatus} format={item.nome.includes("devendo") ? "money" : "number"} />)}
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Registros por modulo" desc="Volume de dados salvos em cada modulo." icon={Database}>
          <div className="grid gap-4 md:grid-cols-2">
            {graficos.registros.map((item) => <Bar key={item.nome} label={item.nome} value={item.valor} max={maxRegistros} />)}
          </div>
        </ChartCard>

        <ChartCard title="Distribuicao operacional" desc="Composicao dos registros principais." icon={PieChart}>
          <Donut items={graficos.registros.slice(0, 6)} />
        </ChartCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Horas por operador" desc="Ranking por horas trabalhadas." icon={Clock}>
          <div className="space-y-5">
            {graficos.operadorHoras.map((item) => <Bar key={item.nome} label={item.nome} value={item.valor} max={maxHoras} />)}
            {graficos.operadorHoras.length === 0 && <p className="text-sm text-slate-400">Sem dados de operador ainda.</p>}
          </div>
        </ChartCard>

        <ChartCard title="Lucro por maquina" desc="Resultado liquido por maquina agricola." icon={HardHat}>
          <div className="space-y-5">
            {graficos.operadorLucroMaquina.map((item) => <Bar key={item.nome} label={item.nome} value={item.valor} max={maxLucro} format="money" />)}
            {graficos.operadorLucroMaquina.length === 0 && <p className="text-sm text-slate-400">Sem dados de lucro por maquina.</p>}
          </div>
        </ChartCard>

        <ChartCard title="Ranking de clientes" desc="Clientes por valor bruto do operador." icon={TrendingUp}>
          <div className="space-y-5">
            {graficos.operadorClientes.map((item) => <Bar key={item.nome} label={item.nome} value={item.valor} max={maxClientes} format="money" />)}
            {graficos.operadorClientes.length === 0 && <p className="text-sm text-slate-400">Sem clientes lancados.</p>}
          </div>
        </ChartCard>

        <ChartCard title="Irrigacao por empresa" desc="Valores devidos por empresa de agua." icon={Droplets}>
          <div className="space-y-5">
            {graficos.irrigacaoEmpresas.map((item) => <Bar key={item.nome} label={item.nome} value={item.valor} max={maxIrrigacao} format="money" />)}
            {graficos.irrigacaoEmpresas.length === 0 && <p className="text-sm text-slate-400">Sem dividas de irrigacao.</p>}
          </div>
        </ChartCard>

        <ChartCard title="Categorias do estoque" desc="Itens agrupados por categoria." icon={Gauge}>
          <div className="space-y-5">
            {graficos.estoqueCategorias.map((item) => <Bar key={item.nome} label={item.nome} value={item.valor} max={Math.max(...graficos.estoqueCategorias.map((i) => i.valor), 1)} />)}
            {graficos.estoqueCategorias.length === 0 && <p className="text-sm text-slate-400">Sem categorias de estoque.</p>}
          </div>
        </ChartCard>

        <ChartCard title="Auditoria por modulo" desc="Eventos registrados por modulo." icon={ClipboardList}>
          <div className="space-y-5">
            {graficos.auditoriaModulos.map((item) => <Bar key={item.nome} label={item.nome} value={item.valor} max={Math.max(...graficos.auditoriaModulos.map((i) => i.valor), 1)} />)}
            {graficos.auditoriaModulos.length === 0 && <p className="text-sm text-slate-400">Sem auditoria registrada.</p>}
          </div>
        </ChartCard>
      </section>
    </div>
  );
}
