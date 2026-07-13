import { CalendarDays } from "lucide-react";

export default function ColheitaCronograma({ dados }) {
  const proximos = [...dados]
    .sort((a, b) => String(a.dataInicio || "").localeCompare(String(b.dataInicio || "")))
    .slice(0, 6);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-5 flex items-center gap-3">
        <CalendarDays className="text-emerald-300" />
        <div>
          <h2 className="text-xl font-black text-white">Cronograma</h2>
          <p className="text-sm text-slate-400">Ultimas operacoes organizadas por data.</p>
        </div>
      </div>

      <div className="grid gap-3">
        {proximos.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="font-bold text-white">{item.fazenda || "Fazenda"} - {item.talhao || "Talhao"}</p>
            <p className="text-sm text-slate-400">{item.dataInicio || "-"} ate {item.dataFim || "em aberto"} â€¢ {item.status}</p>
          </div>
        ))}
        {proximos.length === 0 && <p className="text-sm text-slate-400">Nenhuma operacao cadastrada.</p>}
      </div>
    </div>
  );
}
