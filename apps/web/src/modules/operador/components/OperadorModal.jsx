import { X, Image as ImageIcon } from "lucide-react";

export default function OperadorModal({ registro, onClose }) {
  if (!registro) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">{registro.nomeOperador}</h2>
            <p className="text-slate-400">Cliente: {registro.cliente} • Máquina: {registro.maquinaAgricola}</p>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white transition hover:bg-white/20"><X size={20} /></button>
        </div>

        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
          <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl bg-slate-800">
            {registro.assinaturaCliente && registro.assinaturaCliente.length > 50 ? (
              <img src={registro.assinaturaCliente} className="h-full w-full object-contain bg-white" alt="Assinatura" />
            ) : <span className="text-xs text-slate-500 text-center p-2">Sem assinatura</span>}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Info label="Serviço Realizado" value={registro.servico || "-"} />
            <Info label="Fazenda / Talhão" value={`${registro.fazenda || "-"} • ${registro.talhao || "-"}`} />
            <Info label="Data" value={registro.data ? new Date(registro.data).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) : "-"} />
            <Info label="Horas Trabalhadas" value={`${Number(registro.horasTrabalhadas || 0).toFixed(2)} h`} />
            <Info label="Valor por Hora" value={Number(registro.valorHorario || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
            <Info label="Valor Total (Bruto)" value={Number(registro.valorTotal || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
            <Info label="Lucro Líquido" value={Number(registro.lucroLiquido || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
            <Info label="Status do Serviço" value={registro.status || "-"} />
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