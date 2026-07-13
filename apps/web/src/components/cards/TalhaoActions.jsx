import { Map, Coins, Wheat, Droplets, Tractor, FileText } from "lucide-react";

export default function TalhaoActions({ onAction }) {
  const actions = [
    { title: "Mapa", icon: Map },
    { title: "Gastos", icon: Coins },
    { title: "Plantio", icon: Wheat },
    { title: "Irrigação", icon: Droplets },
    { title: "Colheita", icon: Tractor },
    { title: "PDF", icon: FileText }
  ];

  return (
    <div className="mt-6 grid gap-3 md:grid-cols-6">
      {actions.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.title}
            type="button"
            onClick={() => onAction?.(item.title)}
            className="
              rounded-2xl
              border border-white/10
              bg-white/[0.04]
              p-4
              transition-all
              hover:border-emerald-500/40
              hover:bg-emerald-500/10
              hover:-translate-y-1
              hover:shadow-[0_15px_30px_rgba(16,185,129,0.15)]
            "
          >
            <Icon
              size={24}
              className="mx-auto text-emerald-400"
            />

            <p className="mt-3 text-sm font-bold text-white">
              {item.title}
            </p>
          </button>
        );
      })}
    </div>
  );
}
