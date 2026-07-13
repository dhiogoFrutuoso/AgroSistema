import { CheckCircle2, Eye, FileText, MapPinned, Sprout } from "lucide-react";
import { num } from "../services/painelService.js";

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}

export default function PainelMapaExecutivo({ data }) {
  const talhao = data.talhaoDestaque || {};
  const temImagem = Boolean(data.mapaImagem);

  function abrirGps() {
    const id = talhao.gpsAreaId || talhao.id || "";
    window.location.href = id ? `/mapas-gps?id=${encodeURIComponent(id)}` : "/mapas-gps";
  }

  function abrirTalhoes() {
    window.location.href = "/talhoes";
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#0b1420]/90 p-5 shadow-2xl backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Mapa real dos talhoes</h2>
          <p className="text-sm text-slate-400">
            Imagem capturada do GPS com o terreno demarcado e enviada automaticamente para Talhoes.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={abrirGps} className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-black text-slate-950">
            Ver no GPS
          </button>
          <button onClick={abrirTalhoes} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-black text-white">
            Ver Talhoes
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="relative min-h-[520px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#07130d]">
          {temImagem ? (
            <img src={data.mapaImagem} alt="Mapa real do talhao" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="flex min-h-[520px] flex-col items-center justify-center p-8 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-300">
                <MapPinned size={42} />
              </div>
              <h3 className="text-2xl font-black text-white">Nenhum mapa GPS salvo ainda</h3>
              <p className="mt-2 max-w-xl text-slate-400">
                Va em Mapas/GPS, marque o talhao, salve a area e ela aparecera aqui automaticamente com imagem real.
              </p>
              <button onClick={abrirGps} className="mt-6 rounded-2xl bg-emerald-500 px-5 py-3 font-black text-slate-950">
                Abrir GPS
              </button>
            </div>
          )}

          {temImagem && (
            <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/10 bg-slate-950/85 p-4 backdrop-blur-xl">
              <div className="grid gap-3 md:grid-cols-4">
                <InfoCard label="Talhao" value={talhao.nome || "Talhao GPS"} />
                <InfoCard label="Area" value={`${num(talhao.areaHa || data.areaTotal)} ha`} />
                <InfoCard label="Perimetro" value={`${num(talhao.perimetroM || 0)} m`} />
                <InfoCard label="Cultura" value={talhao.cultura || "Arroz"} />
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-[1.8rem] border border-white/10 bg-slate-950/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
              <Sprout size={28} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Talhao destaque</p>
              <h3 className="text-2xl font-black text-white">{talhao.nome || "Sem talhao"}</h3>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <InfoCard label="Fazenda" value={talhao.fazenda || "Nao informado"} />
            <InfoCard label="Safra" value={talhao.safra || "Nao informado"} />
            <InfoCard label="Origem" value={talhao.origem || "GPS"} />
            <InfoCard label="Status" value={talhao.status || "ATIVO"} />
          </div>

          <div className="mt-6 grid gap-3">
            <button onClick={abrirGps} className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 font-black text-slate-950">
              <Eye size={18} /> Abrir no GPS
            </button>
            <button onClick={abrirTalhoes} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-black text-white">
              <FileText size={18} /> Relatorio em Talhoes
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
            <p className="flex items-center gap-2 text-sm font-black text-emerald-200">
              <CheckCircle2 size={18} /> Integrado com GPS
            </p>
            <p className="mt-2 text-xs text-slate-300">
              O painel nao inventa marcacoes. Ele mostra a imagem real salva no modulo GPS.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
