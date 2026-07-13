import { useEffect, useRef } from "react";
import SignaturePad from "signature_pad";
import { Eraser, Save, X } from "lucide-react";

export default function OperadorAssinatura({ aberto, onClose, onSave, linha }) {
  const canvasRef = useRef(null);
  const padRef = useRef(null);

  useEffect(() => {
    if (!aberto || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    canvas.getContext("2d").scale(ratio, ratio);

    padRef.current = new SignaturePad(canvas, {
      backgroundColor: "rgb(255,255,255)",
      penColor: "rgb(2,6,23)"
    });

    if (linha?.assinaturaCliente) {
      padRef.current.fromDataURL(linha.assinaturaCliente);
    }

    return () => {
      padRef.current?.off();
      padRef.current = null;
    };
  }, [aberto, linha]);

  if (!aberto) return null;

  function limpar() {
    padRef.current?.clear();
  }

  function salvar() {
    if (!padRef.current || padRef.current.isEmpty()) {
      alert("Cliente precisa assinar antes de salvar.");
      return;
    }

    const dataUrl = padRef.current.toDataURL("image/png");
    onSave(dataUrl);
  }

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-950 p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">Assinatura do Cliente</h2>
            <p className="text-sm text-slate-400">{linha?.cliente || "Cliente"} - assine com o dedo na tela.</p>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-white/10 p-3 text-white">
            <X size={20} />
          </button>
        </div>

        <div className="rounded-3xl bg-white p-3">
          <canvas ref={canvasRef} className="h-[320px] w-full rounded-2xl bg-white touch-none" />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button onClick={limpar} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900 px-5 py-3 font-black text-white">
            <Eraser size={18} /> Limpar assinatura
          </button>
          <button onClick={salvar} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-black text-slate-950">
            <Save size={18} /> Salvar assinatura
          </button>
        </div>
      </div>
    </div>
  );
}
