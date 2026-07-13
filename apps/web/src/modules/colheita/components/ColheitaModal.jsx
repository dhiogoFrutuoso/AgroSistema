import { X, Image as ImageIcon } from "lucide-react";

export default function ColheitaModal({ registro, onClose }) {
  if (!registro) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">{registro.fazenda} • {registro.talhao}</h2>
            <p className="text-slate-400">Safra: {registro.safra} | Cultura: {registro.cultura}</p>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white transition hover:bg-white/20"><X size={20} /></button>
        </div>

        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
          <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl bg-slate-800">
            {registro.ticketBalanca && registro.ticketBalanca.length > 50 ? (
              <img src={registro.ticketBalanca} className="h-full w-full object-cover" alt="Ticket" />
            ) : <ImageIcon size={40} className="text-slate-600" />}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Info label="Área Colhida (ha)" value={Number(registro.areaHa || 0).toLocaleString("pt-BR")} />
            <Info label="Produtividade (kg/ha)" value={Number(registro.produtividade || 0).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} />
            <Info label="Peso Bruto / Tara" value={`${Number(registro.pesoBruto || 0).toLocaleString("pt-BR")}kg • ${Number(registro.tara || 0).toLocaleString("pt-BR")}kg`} />
            <Info label="Peso Líquido" value={`${Number(registro.pesoLiquido || 0).toLocaleString("pt-BR")} kg`} />
            <Info label="Operador / Máquina" value={`${registro.operador || "-"} • ${registro.maquina || "-"}`} />
            <Info label="Destino / Caminhão" value={`${registro.destino || "-"} • ${registro.caminhao || "-"}`} />
            <Info label="Custo Total da Operação" value={Number(registro.custoTotal || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
            <Info label="Status Atual" value={registro.status || "-"} />
            <Info label="Observações Livres" value={registro.observacoes || "-"} colSpan />
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