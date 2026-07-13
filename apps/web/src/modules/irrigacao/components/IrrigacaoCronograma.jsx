import { CalendarDays } from "lucide-react";

function money(v) {
  return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function IrrigacaoCronograma({ dados }) {
  const lista = [...dados].slice(0, 6);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-5 flex items-center gap-3">
        <CalendarDays className="text-blue-300" />
        <div>
          <h2 className="text-3xl font-black text-white">Cronograma e Dividas</h2>
          <p className="text-sm text-slate-400">Ultimos lancamentos de irrigacao agranel.</p>
        </div>
      </div>

      <div className="grid gap-3">
        {lista.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="font-bold text-white">{item.empresaAgua || "Empresa"} - {item.talhaoNome || "Talhao"}</p>
            <p className="text-sm text-slate-400">{item.mesReferencia || "-"} â€¢ {item.hectares || 0} ha â€¢ Devendo {money(item.valorDevido)}</p>
          </div>
        ))}
        {lista.length === 0 && <p className="text-sm text-slate-400">Nenhum lancamento cadastrado.</p>}
      </div>
    </div>
  );
}
