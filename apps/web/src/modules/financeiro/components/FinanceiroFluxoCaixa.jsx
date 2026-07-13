export default function FinanceiroFluxoCaixa({
  lancamentos = []
}) {

  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez"
  ];

  const fluxo = meses.map(
    (_, index) => {

      const receitas =
        lancamentos
          .filter(item => {

            const data =
              new Date(
                item.dataLancamento ||
                item.criadoEm ||
                Date.now()
              );

            return (
              item.tipo === "RECEITA" &&
              data.getMonth() === index
            );

          })
          .reduce(
            (acc, item) =>
              acc +
              Number(
                item.valor || 0
              ),
            0
          );

      const despesas =
        lancamentos
          .filter(item => {

            const data =
              new Date(
                item.dataLancamento ||
                item.criadoEm ||
                Date.now()
              );

            return (
              item.tipo === "DESPESA" &&
              data.getMonth() === index
            );

          })
          .reduce(
            (acc, item) =>
              acc +
              Number(
                item.valor || 0
              ),
            0
          );

      return {
        mes:
          meses[index],
        receitas,
        despesas,
        saldo:
          receitas -
          despesas
      };

    }
  );

  return (

    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        p-6
        shadow-2xl
      "
    >

      <div className="mb-5">

        <h2
          className="
            text-xl
            font-black
            text-white
          "
        >
          Fluxo de Caixa
        </h2>

        <p
          className="
            text-sm
            text-slate-400
          "
        >
          Receitas e despesas por mes
        </p>

      </div>

      <div className="overflow-x-auto">

        <table
          className="
            w-full
            min-w-[900px]
          "
        >

          <thead>

            <tr
              className="
                border-b
                border-white/10
              "
            >

              <th className="pb-4 text-left text-slate-300">
                Mes
              </th>

              <th className="pb-4 text-left text-slate-300">
                Receitas
              </th>

              <th className="pb-4 text-left text-slate-300">
                Despesas
              </th>

              <th className="pb-4 text-left text-slate-300">
                Saldo
              </th>

            </tr>

          </thead>

          <tbody>

            {fluxo.map(item => (

              <tr
                key={item.mes}
                className="
                  border-b
                  border-white/5
                "
              >

                <td className="py-4 text-white">
                  {item.mes}
                </td>

                <td className="py-4 text-green-400 font-bold">
                  R$ {item.receitas.toLocaleString("pt-BR")}
                </td>

                <td className="py-4 text-red-400 font-bold">
                  R$ {item.despesas.toLocaleString("pt-BR")}
                </td>

                <td
                  className={
                    item.saldo >= 0
                      ? "py-4 text-emerald-400 font-black"
                      : "py-4 text-red-400 font-black"
                  }
                >
                  R$ {item.saldo.toLocaleString("pt-BR")}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}
