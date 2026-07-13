export default function PremiumButton({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full rounded-2xl px-6 py-4
        bg-gradient-to-r from-yellow-700 via-yellow-600 to-amber-500
        text-white font-black tracking-wide
        shadow-[0_8px_0_rgba(120,74,15,0.9),0_18px_35px_rgba(0,0,0,0.45)]
        active:translate-y-1 active:shadow-[0_4px_0_rgba(120,74,15,0.9),0_10px_20px_rgba(0,0,0,0.4)]
        hover:brightness-110 transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}
