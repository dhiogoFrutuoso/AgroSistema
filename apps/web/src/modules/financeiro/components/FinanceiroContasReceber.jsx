import { useEffect, useState } from "react";
import {
  Calendar,
  TrendingUp
} from "lucide-react";

const STORAGE_KEY =
  "@arroz:financeiro:contas-receber";

function getContasReceber() {

  try {

    const data =
      localStorage.getItem(
        STORAGE_KEY
      );

    return data
      ? JSON.parse(data)
      : [];

  } catch {

    return [];

  }

}

export default function FinanceiroContasReceber() {

  const [contas, setContas] =
    useState([]);

  useEffect(() => {

    setContas(
      getContasReceber()
    );

  }, []);

  const totalPrevisto =
    contas.reduce(
      (acc, item) =>
        acc +
        Number(
          item.valor || 0
        ),
      0
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

      <div
        className="
          mb-5
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-xl
              font-black
              text-white
            "
          >
            Contas a Receber
          </h2>

          <p
            className="
              text-sm
              text-slate-400
            "
          >
            Recebimentos previstos
          </p>

        </div>

        <div
          className="
            rounded-2xl
            bg-green-500/10
            px-4
            py-3
          "
        >
          <div
            className="
              text-xs
              text-green-300
            "
          >
            Previsao
          </div>

          <div
            className="
              font-black
              text-green-400
            "
          >
            R$ {totalPrevisto.toLocaleString("pt-BR")}
          </div>

        </div>

      </div>

      {contas.length === 0 && (

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
          Nenhum recebimento cadastrado.
        </div>

      )}

      <div className="space-y-3">

        {contas.map(conta => (

          <div
            key={conta.id}
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

              <h3
                className="
                  font-bold
                  text-white
                "
              >
                {conta.cliente}
              </h3>

              <p
                className="
                  text-sm
                  text-slate-400
                "
              >
                {conta.descricao}
              </p>

            </div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <Calendar
                size={18}
                className="
                  text-slate-400
                "
              />

              <span
                className="
                  text-slate-300
                "
              >
                {conta.vencimento}
              </span>

            </div>

            <div
              className="
                flex
                items-center
                gap-2
                font-black
                text-green-400
              "
            >

              <TrendingUp
                size={18}
              />

              R$ {Number(
                conta.valor || 0
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
