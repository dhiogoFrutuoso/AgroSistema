import { X, Image as ImageIcon } from "lucide-react";

function money(v) { 
  return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); 
}

function Info({ label, value, colSpan }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 ${colSpan ? 'md:col-span-2' : ''}`}>
      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-white break-words">{value}</p>
    </div>
  );
}

export default function PlantioModal({ registro, onClose }) {
  if (!registro) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">{registro.fazenda} • {registro.talhao}</h2>
            <p className="text-slate-400">Safra: {registro.safra} | Cultura: {registro.cultura}</p>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white transition hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
          <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl bg-slate-800">
            {registro.anexo && registro.anexo.length > 50 ? (
              <img src={registro.anexo} className="h-full w-full object-cover" alt="Anexo do Plantio" />
            ) : (
              <ImageIcon size={40} className="text-slate-600" />
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2 overflow-y-auto pr-2" style={{ maxHeight: "60vh" }}>
            <Info label="Área Plantada (ha)" value={Number(registro.area || 0).toLocaleString("pt-BR")} />
            <Info label="Status Atual" value={registro.status || "-"} />
            <Info label="Data Início" value={registro.dataInicio ? new Date(registro.dataInicio).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) : "-"} />
            <Info label="Data Fim" value={registro.dataFim ? new Date(registro.dataFim).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) : "-"} />
            <Info label="Variedade da Semente" value={registro.variedade || "-"} />
            <Info label="Operador / Máquina" value={`${registro.operador || "-"} • ${registro.maquina || "-"}`} />
            <Info label="Produtividade Prevista" value={`${Number(registro.produtividadePrevista || 0).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg/ha`} />
            <Info label="Custo Total" value={money(registro.custoTotal)} />
            <Info label="Sementes / Insumos" value={`${money(registro.sementes)} • ${money(registro.insumos)}`} />
            <Info label="Mão de Obra / Máquina" value={`${money(registro.maoObra)} • ${money(registro.custoMaquina)}`} />
            <Info label="Outros Custos" value={money(registro.outrosCustos)} colSpan />
            <Info label="Observações de Campo" value={registro.observacoes || "-"} colSpan />
          </div>
        </div>
      </div>
    </div>
  );
}