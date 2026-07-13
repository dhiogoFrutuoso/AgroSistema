import { useEffect, useState } from "react";
import {
  Calendar,
  AlertTriangle
} from "lucide-react";

const STORAGE_KEY =
  "@arroz:financeiro:contas-pagar";

function getContas() {

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

export default function FinanceiroContasPagar() {

  const [contas, setContas] =
    useState([]);

  useEffect(() => {

    setContas(
      getContas()
    );

  }, []);

  const hoje =
    new Date();

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
          Contas a Pagar
        </h2>

        <p
          className="
            text-sm
            text-slate-400
          "
        >
          Controle financeiro de despesas futuras
        </p>

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
          Nenhuma conta cadastrada.
        </div>

      )}

      <div className="space-y-3">

        {contas.map(conta => {

          const vencimento =
            new Date(
              conta.vencimento
            );

          const atrasada =
            vencimento < hoje &&
            conta.status !== "PAGO";

          return (

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
                  {conta.descricao}
                </h3>

                <p
                  className="
                    text-sm
                    text-slate-400
                  "
                >
                  {conta.fornecedor}
                </p>

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                {atrasada && (

                  <AlertTriangle
                    size={18}
                    className="
                      text-red-400
                    "
                  />

                )}

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
                  font-black
                  text-white
                "
              >
                R$ {Number(
                  conta.valor || 0
                ).toLocaleString(
                  "pt-BR"
                )}
              </div>

            </div>

          );

        })}

      </div>

    </div>

  );
}
