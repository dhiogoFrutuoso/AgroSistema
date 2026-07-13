import { Banknote, CircleDollarSign, Droplets, TriangleAlert } from "lucide-react";

function money(v) {
  return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function IrrigacaoCustos({ resumo }) {
  const items = [
    { label: "Valor Total", value: money(resumo.valorTotal), icon: Banknote, tone: "bg-rose-500/10 text-rose-300" },
    { label: "Valor Pago", value: money(resumo.valorPago), icon: CircleDollarSign, tone: "bg-emerald-500/10 text-emerald-300" },
    { label: "Valor Devendo", value: money(resumo.valorDevido), icon: TriangleAlert, tone: "bg-amber-500/10 text-amber-300" },
    { label: "Area Irrigada", value: `${Number(resumo.hectares || 0).toLocaleString("pt-BR")} ha`, icon: Droplets, tone: "bg-blue-500/10 text-blue-300" }
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <h2 className="text-3xl font-black text-white">Custos da Irrigacao</h2>
      <p className="mt-2 text-base text-slate-400">Resumo financeiro da agua por hectare e dividas por talhao.</p>
      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-blue-200">{item.label}</p>
                  <p className="mt-4 text-3xl font-black text-white">{item.value}</p>
                </div>
                <div className={`flex h-16 w-16 items-center justify-center rounded-3xl ${item.tone}`}>
                  <Icon size={30} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
