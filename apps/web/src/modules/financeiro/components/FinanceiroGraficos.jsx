export default function FinanceiroGraficos({
  lancamentos = []
}) {

  const receitas =
    lancamentos
      .filter(
        item =>
          item.tipo ===
          "RECEITA"
      )
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
      .filter(
        item =>
          item.tipo ===
          "DESPESA"
      )
      .reduce(
        (acc, item) =>
          acc +
          Number(
            item.valor || 0
          ),
        0
      );

  const total =
    receitas +
    despesas;

  const receitaPct =
    total > 0
      ? (
          receitas /
          total
        ) * 100
      : 0;

  const despesaPct =
    total > 0
      ? (
          despesas /
          total
        ) * 100
      : 0;

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

      <div className="mb-6">

        <h2
          className="
            text-xl
            font-black
            text-white
          "
        >
          Analise Financeira
        </h2>

        <p
          className="
            text-sm
            text-slate-400
          "
        >
          Receitas versus despesas
        </p>

      </div>

      <div className="space-y-5">

        <div>

          <div
            className="
              mb-2
              flex
              justify-between
            "
          >
            <span className="text-green-400 font-bold">
              Receitas
            </span>

            <span className="text-white">
              {receitaPct.toFixed(1)}%
            </span>

          </div>

          <div
            className="
              h-4
              overflow-hidden
              rounded-full
              bg-slate-800
            "
          >

            <div
              className="
                h-full
                rounded-full
                bg-green-500
              "
              style={{
                width:
                  receitaPct + "%"
              }}
            />

          </div>

        </div>

        <div>

          <div
            className="
              mb-2
              flex
              justify-between
            "
          >
            <span className="text-red-400 font-bold">
              Despesas
            </span>

            <span className="text-white">
              {despesaPct.toFixed(1)}%
            </span>

          </div>

          <div
            className="
              h-4
              overflow-hidden
              rounded-full
              bg-slate-800
            "
          >

            <div
              className="
                h-full
                rounded-full
                bg-red-500
              "
              style={{
                width:
                  despesaPct + "%"
              }}
            />

          </div>

        </div>

      </div>

      <div
        className="
          mt-6
          grid
          gap-4
          md:grid-cols-2
        "
      >

        <div
          className="
            rounded-2xl
            bg-green-500/10
            p-4
          "
        >
          <div className="text-green-300 text-sm">
            Total Receitas
          </div>

          <div
            className="
              mt-2
              text-2xl
              font-black
              text-green-400
            "
          >
            R$ {receitas.toLocaleString("pt-BR")}
          </div>

        </div>

        <div
          className="
            rounded-2xl
            bg-red-500/10
            p-4
          "
        >
          <div className="text-red-300 text-sm">
            Total Despesas
          </div>

          <div
            className="
              mt-2
              text-2xl
              font-black
              text-red-400
            "
          >
            R$ {despesas.toLocaleString("pt-BR")}
          </div>

        </div>

      </div>

    </div>

  );
}
