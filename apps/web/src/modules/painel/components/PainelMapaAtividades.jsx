import { Activity, CheckCircle2, Droplets, MapPinned, Sprout, Tractor } from "lucide-react";
import { num } from "../services/painelService.js";

export default function PainelMapaAtividades({ resumo, auditoria }) {
  const ultimas = auditoria.slice(0, 10);

  return (
    <section className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <h2 className="text-2xl font-black text-white">Mapa executivo visual</h2>
        <p className="mt-1 text-sm text-slate-400">Representacao visual dos talhoes e operacoes cadastradas.</p>

        <div className="relative mt-6 h-[380px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_center,rgba(34,197,94,.22),transparent_35%),linear-gradient(135deg,#102016,#020617)]">
          <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.10) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.10) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
          <div className="absolute left-[10%] top-[16%] h-32 w-52 rotate-[-14deg] rounded-3xl border-2 border-emerald-400 bg-emerald-500/20" />
          <div className="absolute right-[12%] top-[20%] h-28 w-48 rotate-[12deg] rounded-3xl border-2 border-amber-400 bg-amber-500/20" />
          <div className="absolute bottom-[14%] left-[32%] h-36 w-56 rotate-[8deg] rounded-3xl border-2 border-blue-400 bg-blue-500/20" />
          <div className="absolute bottom-[18%] right-[8%] flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-amber-300 shadow-xl"><Tractor size={26} /></div>
          <div className="absolute left-[25%] top-[42%] flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-emerald-300 shadow-xl"><Sprout size={26} /></div>
          <div className="absolute bottom-[22%] left-[52%] flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-cyan-300 shadow-xl"><Droplets size={26} /></div>
          <div className="absolute bottom-4 left-4 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm font-black text-white">
            <MapPinned className="mr-2 inline text-emerald-300" size={18} />
            {num(resumo.areaTotal)} ha monitorados
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <h2 className="text-2xl font-black text-white">Ultimas atividades</h2>
        <p className="mt-1 text-sm text-slate-400">Eventos recentes registrados na auditoria.</p>

        <div className="mt-5 divide-y divide-white/10">
          {ultimas.map((item) => (
            <div key={item.id || `${item.dataHora}-${item.descricao}`} className="flex items-start gap-4 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                <Activity size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-white">{item.acao || "ACAO"} - {item.modulo || "Sistema"}</p>
                <p className="mt-1 text-sm text-slate-400">{item.descricao || "-"}</p>
              </div>
              <p className="whitespace-nowrap text-xs text-slate-500">
                {item.dataHora ? new Date(item.dataHora).toLocaleString("pt-BR") : "-"}
              </p>
            </div>
          ))}

          {ultimas.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              <CheckCircle2 className="mx-auto mb-3 text-emerald-300" />
              Nenhuma atividade registrada ainda.
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
