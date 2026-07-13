import { Search } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <Search size={18} className="text-slate-400" />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
      />
    </div>
  );
}
