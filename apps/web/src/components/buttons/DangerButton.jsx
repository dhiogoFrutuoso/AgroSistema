export default function DangerButton({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
        inline-flex items-center justify-center gap-2 rounded-2xl
        bg-red-500/10 px-4 py-3 font-black text-red-300
        ring-1 ring-red-400/20 transition-all
        hover:bg-red-500/20 hover:ring-red-400/40
      "
    >
      {children}
    </button>
  );
}
