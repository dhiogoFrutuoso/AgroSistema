import { X, Image as ImageIcon } from "lucide-react";

export default function EstoqueModal({ produto, onClose }) {
  if (!produto) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">{produto.nome}</h2>
            <p className="text-slate-400">Estoque • Lote: {produto.lote || "-"}</p>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white transition hover:bg-white/20"><X size={20} /></button>
        </div>

        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
          <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl bg-slate-800">
            {produto.imagemProduto && produto.imagemProduto.length > 50 ? (
              <img src={produto.imagemProduto} className="h-full w-full object-cover" alt="Produto" />
            ) : <ImageIcon size={40} className="text-slate-600" />}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Info label="Categoria" value={produto.categoria || "-"} />
            <Info label="Quantidade Atual" value={`${produto.quantidade} ${produto.unidadeMedida || 'un'}`} />
            <Info label="Preço Unitário" value={Number(produto.preco || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
            <Info label="Estoque Mínimo" value={`${produto.minimo} ${produto.unidadeMedida || 'un'}`} />
            <Info label="Data de Validade" value={produto.validade ? new Date(produto.validade).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) : "-"} />
            <Info label="Fornecedor" value={produto.fornecedor || "-"} />
            <Info label="Localização / Galpão" value={produto.local || "-"} />
            <Info label="Status" value={produto.status || "-"} />
            <Info label="Observações" value={produto.observacoes || "-"} colSpan />
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