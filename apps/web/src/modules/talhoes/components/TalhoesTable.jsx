import { Edit3, Eye, FileText, MapPinned, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

function num(v, d = 2) {
  return Number(v || 0).toLocaleString("pt-BR", { maximumFractionDigits: d });
}

export default function TalhoesTable({ dados, onDelete, onEdit, onSelect, onPdf, onGps }) {
  const [busca, setBusca] = useState("");
  const [origem, setOrigem] = useState("TODOS");

  const filtrados = useMemo(() => {
    return dados.filter((item) => {
      const texto = `${item.nome} ${item.fazenda} ${item.cultura} ${item.safra}`.toLowerCase();
      const okBusca = texto.includes(busca.toLowerCase());
      const okOrigem = origem === "TODOS" || String(item.origem || "").toUpperCase() === origem;
      return okBusca && okOrigem;
    });
  }, [dados, busca, origem]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Talhões cadastrados</h2>
          <p className="text-sm text-slate-400">Lista integrada automaticamente com GPS.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-300">
            <Search size={18} />
            <input className="bg-transparent outline-none" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar..." />
          </div>

          <select className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" value={origem} onChange={(e) => setOrigem(e.target.value)}>
            <option value="TODOS">TODOS</option>
            <option value="GPS">GPS</option>
            <option value="MANUAL">MANUAL</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-slate-400">
            <tr className="border-b border-white/10">
              <th className="px-3 py-3">Imagem</th>
              <th className="px-3 py-3">Nome</th>
              <th className="px-3 py-3">Fazenda</th>
              <th className="px-3 py-3">Cultura</th>
              <th className="px-3 py-3">Safra</th>
              <th className="px-3 py-3">Área</th>
              <th className="px-3 py-3">Perímetro</th>
              <th className="px-3 py-3">Origem</th>
              <th className="px-3 py-3 text-right">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10 text-slate-200">
            {filtrados.map((item) => (
              <tr key={item.id || item._id} className="hover:bg-white/[0.03]">
                <td className="px-3 py-4">
                  <div className="h-16 w-24 overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
                    {item.imagemMapa ? (
                      <img src={item.imagemMapa} alt={item.nome} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-500 text-xs">Sem imagem</div>
                    )}
                  </div>
                </td>
                <td className="px-3 py-4 font-black text-white">{item.nome || "-"}</td>
                <td className="px-3 py-4">{item.fazenda || "-"}</td>
                <td className="px-3 py-4">{item.cultura || "-"}</td>
                <td className="px-3 py-4">{item.safra || "-"}</td>
                <td className="px-3 py-4">{num(item.areaHa)} ha</td>
                <td className="px-3 py-4">{num(item.perimetroM)} m</td>
                <td className="px-3 py-4">
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-200">
                    {item.origem || "MANUAL"}
                  </span>
                </td>
                <td className="px-3 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onSelect(item)} className="rounded-xl bg-blue-500/10 p-2 text-blue-200"><Eye size={17} /></button>
                    <button onClick={() => onEdit(item)} className="rounded-xl bg-purple-500/10 p-2 text-purple-200"><Edit3 size={17} /></button>
                    <button onClick={() => onGps(item)} className="rounded-xl bg-emerald-500/10 p-2 text-emerald-200"><MapPinned size={17} /></button>
                    <button onClick={() => onPdf(item)} className="rounded-xl bg-amber-500/10 p-2 text-amber-200"><FileText size={17} /></button>
                    <button onClick={() => onDelete(item.id || item._id)} className="rounded-xl bg-red-500/10 p-2 text-red-200"><Trash2 size={17} /></button>
                  </div>
                </td>
              </tr>
            ))}

            {filtrados.length === 0 && (
              <tr>
                <td colSpan="9" className="px-3 py-10 text-center text-slate-400">Nenhum talhão encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}