export default function PremiumSelect({
  label,
  name,
  value,
  onChange,
  options = []
}) {
  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-bold text-slate-700">{label}</span>}

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full rounded-2xl border border-slate-300
          bg-white/90 px-5 py-4 text-slate-900
          outline-none transition-all
          focus:border-yellow-600 focus:ring-4 focus:ring-yellow-600/20
        "
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
