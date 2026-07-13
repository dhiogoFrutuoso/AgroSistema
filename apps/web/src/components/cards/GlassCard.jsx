export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-3xl border border-white/10
        bg-white/[0.06] backdrop-blur-2xl
        shadow-[0_25px_80px_rgba(0,0,0,0.45)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
