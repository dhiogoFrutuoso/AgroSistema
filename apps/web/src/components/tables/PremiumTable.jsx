export default function PremiumTable({ columns = [], data = [] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead className="bg-white/[0.08] text-xs uppercase tracking-[0.2em] text-slate-300">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {data.map((row, index) => (
              <tr key={index} className="text-slate-200 hover:bg-white/[0.05]">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4">
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-slate-400"
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
