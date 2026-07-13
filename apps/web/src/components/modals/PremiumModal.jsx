export default function PremiumModal({
  open,
  title,
  children,
  onClose
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black text-white">{title}</h2>

          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/20"
          >
            Fechar
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
