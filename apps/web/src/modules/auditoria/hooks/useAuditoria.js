import { useEffect, useMemo, useState } from "react";
import {
  deleteRegistro,
  gerarEventoTeste,
  getAuditoria,
  getAuditoriaApiFirst,
  getResumo,
  limparAuditoria
} from "../services/auditoriaService.js";

export function useAuditoria() {
  const [registros, setRegistros] = useState(() => getAuditoria());
  const [busca, setBusca] = useState("");
  const [acao, setAcao] = useState("TODOS");
  const [nivel, setNivel] = useState("TODOS");
  const [modulo, setModulo] = useState("TODOS");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  async function reload() {
    const lista = await getAuditoriaApiFirst();
    setRegistros(lista);
  }

  useEffect(() => {
    reload();
  }, []);

  async function excluir(id) {
    deleteRegistro(id);
    await reload();
  }

  async function limpar() {
    limparAuditoria();
    await reload();
  }

  async function teste() {
    gerarEventoTeste();
    await reload();
  }

  const filtrados = useMemo(() => {
    return registros.filter((item) => {
      const texto = `${item.usuario} ${item.modulo} ${item.acao}${item.descricao} ${item.nivel}`.toLowerCase();
      const okBusca = texto.includes(busca.toLowerCase());
      const okAcao = acao === "TODOS" || String(item.acao || "").toUpperCase() === acao;
      const okNivel = nivel === "TODOS" || String(item.nivel || "").toUpperCase() === nivel;
      const okModulo = modulo === "TODOS" || String(item.modulo || "") === modulo;

      const data = String(item.dataHora || "").slice(0, 10);
      const okInicio = !dataInicio || data >= dataInicio;
      const okFim = !dataFim || data <= dataFim;

      return okBusca && okAcao && okNivel && okModulo && okInicio && okFim;
    });
  }, [registros, busca, acao, nivel, modulo, dataInicio, dataFim]);

  return {
    registros,
    filtrados,
    resumo: getResumo(),
    busca,
    setBusca,
    acao,
    setAcao,
    nivel,
    setNivel,
    modulo,
    setModulo,
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    excluir,
    limpar,
    teste,
    reload
  };
}
