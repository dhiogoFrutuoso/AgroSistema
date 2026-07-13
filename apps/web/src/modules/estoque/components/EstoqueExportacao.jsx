import {
  Download,
  FileJson,
  FileSpreadsheet
} from "lucide-react";

export default function EstoqueExportacao() {

  function exportarJson() {

    const dados =
      localStorage.getItem(
        "@arroz:estoque"
      ) || "[]";

    const blob =
      new Blob(
        [dados],
        {
          type:
            "application/json"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        "a"
      );

    a.href = url;

    a.download =
      "estoque-backup.json";

    a.click();

    URL.revokeObjectURL(
      url
    );
  }

  function exportarCsv() {

    const dados =
      JSON.parse(
        localStorage.getItem(
          "@arroz:estoque"
        ) || "[]"
      );

    if (
      !dados.length
    ) {
      return;
    }

    const cabecalho =
      Object.keys(
        dados[0]
      ).join(",");

    const linhas =
      dados.map(
        item =>
          Object.values(
            item
          ).join(",")
      );

    const csv =
      [
        cabecalho,
        ...linhas
      ].join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        "a"
      );

    a.href = url;

    a.download =
      "estoque.csv";

    a.click();

    URL.revokeObjectURL(
      url
    );
  }

  return (

    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        p-6
      "
    >

      <h2
        className="
          mb-5
          text-xl
          font-black
          text-white
        "
      >
        Exportacao
      </h2>

      <div
        className="
          flex
          flex-wrap
          gap-3
        "
      >

        <button
          onClick={
            exportarCsv
          }
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-green-600
            px-5
            py-3
            font-black
            text-white
          "
        >
          <FileSpreadsheet
            size={18}
          />
          CSV
        </button>

        <button
          onClick={
            exportarJson
          }
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-blue-600
            px-5
            py-3
            font-black
            text-white
          "
        >
          <FileJson
            size={18}
          />
          JSON
        </button>

        <button
          onClick={
            exportarJson
          }
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-yellow-600
            px-5
            py-3
            font-black
            text-white
          "
        >
          <Download
            size={18}
          />
          Backup
        </button>

      </div>

    </div>

  );
}
