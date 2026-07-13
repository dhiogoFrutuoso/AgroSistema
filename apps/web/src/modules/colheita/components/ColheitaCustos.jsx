import { Banknote, Fuel, Package, Tractor } from "lucide-react";

function money(v) {
  return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ColheitaCustos({ dados }) {
  const maoObra = dados.reduce((s, i) => s + Number(i.custoMaoObra || 0), 0);
  const maquina = dados.reduce((s, i) => s + Number(i.custoMaquina || 0), 0);
  const combustivel = dados.reduce((s, i) => s + Number(i.custoCombustivel || 0), 0);
  const total = dados.reduce((s, i) => s + Number(i.custoTotal || 0), 0);

  const items = [
    { label: "Mao de Obra", value: money(maoObra), icon: Package, tone: "bg-blue-500/10 text-blue-300" },
    { label: "Maquinas", value: money(maquina), icon: Tractor, tone: "bg-amber-500/10 text-amber-300" },
    { label: "Combustivel", value: money(combustivel), icon: Fuel, tone: "bg-orange-500/10 text-orange-300" },
    { label: "Custo Total", value: money(total), icon: Banknote, tone: "bg-rose-500/10 text-rose-300" }
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <h2 className="text-3xl font-black text-white">Custos e Logistica</h2>
      <p className="mt-2 text-base text-slate-400">Resumo financeiro da operacao de colheita.</p>

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
