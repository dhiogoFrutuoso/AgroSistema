import FinanceiroCards from "./FinanceiroCards.jsx";

export default function FinanceiroDashboard({
  lancamentos = []
}) {

  const receitas = lancamentos
    .filter(item => item.tipo === "RECEITA")
    .reduce(
      (acc, item) =>
        acc + Number(item.valor || 0),
      0
    );

  const despesas = lancamentos
    .filter(item => item.tipo === "DESPESA")
    .reduce(
      (acc, item) =>
        acc + Number(item.valor || 0),
      0
    );

  const saldo =
    receitas - despesas;

  const pendentes =
    lancamentos.filter(
      item =>
        item.status === "PENDENTE"
    ).length;

  const ultimos =
    [...lancamentos]
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

      <FinanceiroCards
        saldo={saldo}
        receitas={receitas}
        despesas={despesas}
        pendentes={pendentes}
        lancamentos={
          lancamentos.length
        }
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
        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-black text-white">
              Ultimos Lancamentos
            </h2>

            <p className="text-sm text-slate-400">
              Movimentacoes financeiras recentes
            </p>
          </div>

        </div>

        {ultimos.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-slate-400">
            Nenhum lancamento encontrado.
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
                    {item.descricao}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {item.categoria || "Sem categoria"}
                  </p>
                </div>

                <div className="text-right">

                  <div
                    className={
                      item.tipo === "RECEITA"
                        ? "font-black text-green-400"
                        : "font-black text-red-400"
                    }
                  >
                    R$ {Number(
                      item.valor || 0
                    ).toLocaleString("pt-BR")}
                  </div>

                  <div className="text-xs text-slate-500">
                    {item.tipo}
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
