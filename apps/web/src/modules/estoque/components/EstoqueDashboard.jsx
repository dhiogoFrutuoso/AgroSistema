import EstoqueCards from "./EstoqueCards.jsx";

export default function EstoqueDashboard({
  produtos = []
}) {

  const totalItens =
    produtos.length;

  const estoqueBaixo =
    produtos.filter(
      item =>
        Number(item.quantidade || 0) <=
        Number(item.minimo || 0)
    ).length;

  const valorTotal =
    produtos.reduce(
      (acc, item) =>
        acc +
        (
          Number(item.quantidade || 0) *
          Number(item.preco || 0)
        ),
      0
    );

  const ultimos =
    [...produtos]
      .sort(
        (a, b) =>
          new Date(
            b.criadoEm || 0
          ) -
          new Date(
            a.criadoEm || 0
          )
      )
      .slice(0, 5);

  return (
    <div className="space-y-6">

      <EstoqueCards
        totalItens={totalItens}
        estoqueBaixo={estoqueBaixo}
        valorTotal={valorTotal}
      />

      <div
        className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.04]
          p-6
          shadow-2xl
          backdrop-blur-xl
        "
      >

        <div className="mb-5">

          <h2 className="text-xl font-black text-white">
            Ultimos Produtos
          </h2>

          <p className="text-sm text-slate-400">
            Produtos cadastrados recentemente
          </p>

        </div>

        {ultimos.length === 0 && (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-white/10
              p-10
              text-center
              text-slate-400
            "
          >
            Nenhum produto encontrado.
          </div>
        )}

        {ultimos.length > 0 && (

          <div className="space-y-3">

            {ultimos.map(item => (

              <div
                key={item.id}
                className="
                  flex
                  flex-col
                  gap-3
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

                  <h3 className="font-bold text-white">
                    {item.nome}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {item.categoria}
                  </p>

                </div>

                <div className="text-right">

                  <div className="font-black text-emerald-400">
                    {item.quantidade}
                  </div>

                  <div className="text-xs text-slate-500">
                    unidades
                  </div>

                </div>

              </div>

            ))}
          </div>

        )}

      </div>

    </div>
  );
}
