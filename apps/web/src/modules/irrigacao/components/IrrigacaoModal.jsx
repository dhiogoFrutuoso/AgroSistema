import { X, Image as ImageIcon } from "lucide-react";

export default function IrrigacaoModal({ registro, onClose }) {
  if (!registro) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">{registro.empresaAgua}</h2>
            <p className="text-slate-400">Fatura: {registro.mesReferencia} • Status: {registro.statusPagamento}</p>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white transition hover:bg-white/20"><X size={20} /></button>
        </div>

        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
          <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl bg-slate-800">
            {registro.comprovante && registro.comprovante.length > 50 ? (
              <img src={registro.comprovante} className="h-full w-full object-cover" alt="Recibo" />
            ) : <ImageIcon size={40} className="text-slate-600" />}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Info label="Hectares Irrigados" value={`${Number(registro.hectares || 0).toLocaleString("pt-BR")} ha`} />
            <Info label="Quantidade de Lotes" value={registro.lotes || "-"} />
            <Info label="Valor Mensal Calculado" value={Number(registro.valorMensal || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
            <Info label="Custo Total Geral" value={Number(registro.valorTotal || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
            <Info label="Valor Já Pago" value={Number(registro.valorPago || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
            <Info label="Dívida Atual (Devendo)" value={Number(registro.valorDevido || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
            <Info label="Fazenda / Talhão" value={`${registro.fazenda || "-"} • ${registro.talhaoNome || "-"}`} />
            <Info label="Responsável" value={registro.responsavelEmpresa || "-"} />
            <Info label="Observações de Rota / Serviço" value={registro.observacoes || registro.observacoesRota || "-"} colSpan />
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