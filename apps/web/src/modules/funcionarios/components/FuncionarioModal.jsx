import { X } from "lucide-react";

export default function FuncionarioModal({ funcionario, onClose }) {
  if (!funcionario) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">{funcionario.nome}</h2>
            <p className="text-slate-400">{funcionario.cargo || "Funcionario"} â€¢ {funcionario.usuario}</p>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white"><X size={20} /></button>
        </div>

        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
          <div className="h-40 w-40 overflow-hidden rounded-3xl bg-slate-800">
            {funcionario.foto ? <img src={funcionario.foto} className="h-full w-full object-cover" /> : null}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Info label="CPF" value={funcionario.cpf || "-"} />
            <Info label="RG" value={funcionario.rg || "-"} />
            <Info label="Telefone" value={funcionario.telefone || "-"} />
            <Info label="Email" value={funcionario.email || "-"} />
            <Info label="Cidade" value={funcionario.cidade || "-"} />
            <Info label="Status" value={funcionario.status || "-"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}
