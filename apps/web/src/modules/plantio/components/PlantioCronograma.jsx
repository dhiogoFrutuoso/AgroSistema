import { CalendarDays, Clock3, CheckCircle, AlertTriangle } from "lucide-react";

export default function PlantioCronograma({ plantios = [] }) {
  const hoje = new Date();

  const ordenados = [...plantios].sort((a, b) => {
    return new Date(a.dataInicio || 0) - new Date(b.dataInicio || 0);
  });

  function situacao(item) {
    if (item.status === "CONCLUIDO") return "CONCLUIDO";

    const data = new Date(item.dataInicio || item.criadoEm || Date.now());

    if (data < hoje && item.status !== "CONCLUIDO") {
      return "ATRASADO";
    }

    return "PROGRAMADO";
  }

  function iconStatus(status) {
    if (status === "CONCLUIDO") return <CheckCircle size={18} className="text-green-400" />;
    if (status === "ATRASADO") return <AlertTriangle size={18} className="text-red-400" />;
    return <Clock3 size={18} className="text-yellow-400" />;
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
      <div className="mb-5 flex items-center gap-3">
        <CalendarDays className="text-yellow-400" />
        <div>
          <h2 className="text-2xl font-black text-white">Cronograma do Plantio</h2>
          <p className="text-sm text-slate-400">Prazos, status e acompanhamento das atividades de plantio.</p>
        </div>
      </div>

      <div className="space-y-3">
        {ordenados.map((item) => {
          const statusAtual = situacao(item);

          return (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-3">
                {iconStatus(statusAtual)}

                <div>
                  <h3 className="font-black text-white">
                    {item.talhao || "Sem talhao"} - {item.cultura || "Sem cultura"}
                  </h3>
                  <p className="text-sm text-slate-400">
                    Safra {item.safra || "-"} | Fazenda {item.fazenda || "-"}
                  </p>
                </div>
              </div>

              <div className="text-sm text-slate-300">
                Inicio: {item.dataInicio || "-"}
              </div>

              <div className="rounded-xl bg-white/10 px-3 py-1 text-xs font-bold text-white">
                {statusAtual}
              </div>
            </div>
          );
        })}

        {ordenados.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-400">
            Nenhum cronograma encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
