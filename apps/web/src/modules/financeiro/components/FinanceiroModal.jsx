import { X, Image as ImageIcon } from "lucide-react";

export default function FinanceiroModal({ registro, onClose }) {
  if (!registro) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">{registro.descricao}</h2>
            <p className="text-slate-400">Financeiro • {registro.categoria}</p>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white transition hover:bg-white/20"><X size={20} /></button>
        </div>

        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
          <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl bg-slate-800">
            {registro.comprovante && registro.comprovante.length > 50 ? (
              <img src={registro.comprovante} className="h-full w-full object-cover" alt="Comprovante" />
            ) : <ImageIcon size={40} className="text-slate-600" />}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Info label="Valor" value={Number(registro.valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
            <Info label="Status" value={registro.status || "-"} />
            <Info label="Data Lançamento" value={registro.dataLancamento ? new Date(registro.dataLancamento).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) : "-"} />
            <Info label="Data Vencimento" value={registro.dataVencimento ? new Date(registro.dataVencimento).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) : "-"} />
            <Info label="Tipo" value={registro.tipo || "-"} />
            <Info label="Conta Bancária" value={registro.contaBancaria || "-"} />
            <Info label="Fornecedor/Cliente" value={registro.fornecedor || "-"} />
            <Info label="Centro de Custo" value={registro.centroCusto || "-"} />
            <Info label="Forma de Pagamento" value={registro.formaPagamento || "-"} />
            <Info label="Observações" value={registro.observacoes || "-"} colSpan />
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