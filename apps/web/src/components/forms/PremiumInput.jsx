export default function PremiumInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  name
}) {
  return (
    <label className="block space-y-2">
      {label && (
        <span className="text-sm font-bold text-slate-700">
          {label}
        </span>
      )}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full rounded-2xl border border-slate-300
          bg-white/90 px-5 py-4 text-slate-900
          outline-none transition-all
          placeholder:text-slate-400
          focus:border-yellow-600 focus:ring-4 focus:ring-yellow-600/20
        "
      />
    </label>
  );
}
