import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function AccessDenied() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-xl rounded-3xl border border-red-400/20 bg-red-500/10 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 text-red-300">
          <ShieldAlert size={44} />
        </div>
        <h1 className="mt-6 text-3xl font-black text-white">Acesso Negado</h1>
        <p className="mt-3 text-slate-300">Voce nao possui permissao para acessar este modulo.</p>
        <button onClick={() => window.history.back()} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-black text-slate-950">
          <ArrowLeft size={18} /> Voltar
        </button>
      </div>
    </div>
  );
}
