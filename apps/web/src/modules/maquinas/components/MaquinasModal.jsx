import { X, Image as ImageIcon } from "lucide-react";

export default function MaquinasModal({ maquina, onClose }) {
  if (!maquina) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">{maquina.nome}</h2>
            <p className="text-slate-400">Frota • Código: {maquina.codigo || "N/A"}</p>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white transition hover:bg-white/20"><X size={20} /></button>
        </div>

        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
          <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl bg-slate-800">
            {maquina.imagemMaquina && maquina.imagemMaquina.length > 50 ? (
              <img src={maquina.imagemMaquina} className="h-full w-full object-cover" alt="Máquina" />
            ) : <ImageIcon size={40} className="text-slate-600" />}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Info label="Marca / Modelo" value={`${maquina.marca || "-"} / ${maquina.modelo || "-"}`} />
            <Info label="Ano / Placa" value={`${maquina.ano || "-"} • ${maquina.placa || "-"}`} />
            <Info label="Operador Principal" value={maquina.operador || "-"} />
            <Info label="Horímetro Atual" value={`${maquina.horimetro || 0} h`} />
            <Info label="Combustível / Consumo" value={`${maquina.combustivel || "-"} • ${maquina.consumo || 0} L/h`} />
            <Info label="Fazenda / Talhão" value={`${maquina.fazenda || "-"} • ${maquina.talhao || "-"}`} />
            <Info label="Status Atual" value={maquina.status || "-"} />
            <Info label="Observações de Conservação" value={maquina.observacoes || "-"} colSpan />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, colSpan }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 ${colSpan ? 'md:col-span-2' : ''}`}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-black text-white break-words">{value}</p>
    </div>
  );
}