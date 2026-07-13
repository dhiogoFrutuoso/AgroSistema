import { useEffect, useMemo, useState } from "react";
import {
  criarRegistroRelatorio,
  excluirRegistroRelatorio,
  getRegistrosRelatorios,
  getRegistrosRelatoriosApiFirst,
  getResumo
} from "../services/relatoriosService.js";

export function useRelatorios() {
  const [registros, setRegistros] = useState(() => getRegistrosRelatorios());
  const [busca, setBusca] = useState("");
  const [moduloFiltro, setModuloFiltro] = useState("TODOS");

  async function reload() {
    const lista = await getRegistrosRelatoriosApiFirst();
    setRegistros(lista);
  }

  useEffect(() => {
    reload();
  }, []);

  async function criar(payload) {
    criarRegistroRelatorio(payload);
    await reload();
  }

  async function excluir(id) {
    excluirRegistroRelatorio(id);
    await reload();
  }

  const filtrados = useMemo(() => {
    return registros.filter((item) => {
      const texto = `${item.titulo} ${item.modulo} ${item.tipo} ${item.responsavel}`.toLowerCase();
      const okBusca = texto.includes(busca.toLowerCase());
      const okModulo = moduloFiltro === "TODOS" || item.modulo === moduloFiltro;
      return okBusca && okModulo;
    });
  }, [registros, busca, moduloFiltro]);

  return {
    registros,
    filtrados,
    resumo: getResumo(),
    busca,
    setBusca,
    moduloFiltro,
    setModuloFiltro,
    criar,
    excluir,
    reload
  };
}
