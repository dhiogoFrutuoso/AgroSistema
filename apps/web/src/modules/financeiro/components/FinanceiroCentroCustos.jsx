export default function FinanceiroCentroCustos({
  lancamentos = []
}) {

  const agrupado = {};

  lancamentos.forEach(item => {

    const chave =
      [
        item.fazenda || "Sem Fazenda",
        item.talhao || "Sem Talhao"
      ].join(" | ");

    if (!agrupado[chave]) {

      agrupado[chave] = {
        fazenda:
          item.fazenda ||
          "Sem Fazenda",

        talhao:
          item.talhao ||
          "Sem Talhao",

        total: 0
      };

    }

    agrupado[chave].total +=
      Number(
        item.valor || 0
      );

  });

  const ranking =
    Object.values(
      agrupado
    )
      .sort(
        (a, b) =>
          b.total -
          a.total
      )
      .slice(0, 10);

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
          Centro de Custos
        </h2>

        <p
          className="
            text-sm
            text-slate-400
          "
        >
          Custos por fazenda e talhao
        </p>

      </div>

      {ranking.length === 0 && (

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-white/10
            p-8
            text-center
            text-slate-400
          "
        >
          Nenhum custo registrado.
        </div>

      )}

      <div className="space-y-3">

        {ranking.map(item => (

          <div
            key={
              item.fazenda +
              item.talhao
            }
            className="
              flex
              flex-col
              gap-2
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              p-4
              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            <div>

              <h3
                className="
                  font-bold
                  text-white
                "
              >
                {item.fazenda}
              </h3>

              <p
                className="
                  text-sm
                  text-slate-400
                "
              >
                {item.talhao}
              </p>

            </div>

            <div
              className="
                text-xl
                font-black
                text-red-400
              "
            >
              R$ {Number(
                item.total || 0
              ).toLocaleString(
                "pt-BR"
              )}
            </div>

          </div>

        ))}

      </div>

    </div>

  );
}
