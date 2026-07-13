import { useEffect, useMemo, useState } from "react";
import {
  arquivarDocumento,
  createDocumento,
  deleteDocumento,
  duplicarDocumento,
  getDocumentos,
  getDocumentosApiFirst,
  getResumo,
  toggleFavorito,
  updateDocumento
} from "../services/documentosService.js";

export function useDocumentos() {
  const [documentos, setDocumentos] = useState(() => getDocumentos());
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const [filtroCategoria, setFiltroCategoria] = useState("TODOS");
  const [mostrarArquivados, setMostrarArquivados] = useState(false);

  async function reload() {
    const lista = await getDocumentosApiFirst();
    setDocumentos(lista);
  }

  useEffect(() => {
    reload();
  }, []);

  async function upload(payload) {
    await createDocumento(payload);
    await reload();
  }

  async function editar(id, patch) {
    updateDocumento(id, patch);
    await reload();
  }

  async function excluir(id) {
    deleteDocumento(id);
    await reload();
  }

  async function duplicar(id) {
    duplicarDocumento(id);
    await reload();
  }

  async function favorito(id) {
    toggleFavorito(id);
    await reload();
  }

  async function arquivar(id) {
    arquivarDocumento(id);
    await reload();
  }

  const filtrados = useMemo(() => {
    return documentos.filter((doc) => {
      const texto = `${doc.titulo} ${doc.categoria} ${doc.tipo} ${doc.usuario} ${doc.descricao}`.toLowerCase();
      const okBusca = texto.includes(busca.toLowerCase());
      const okTipo =
        filtroTipo === "TODOS" ||
        doc.tipo === filtroTipo ||
        (filtroTipo === "FAVORITOS" && doc.favorito) ||
        (filtroTipo === "CONTRATOS" && doc.categoria === "Contratos");
      const okCategoria = filtroCategoria === "TODOS" || doc.categoria === filtroCategoria;
      const okStatus = mostrarArquivados ? true : doc.status !== "ARQUIVADO";
      return okBusca && okTipo && okCategoria && okStatus;
    });
  }, [documentos, busca, filtroTipo, filtroCategoria, mostrarArquivados]);

  return {
    documentos,
    filtrados,
    resumo: getResumo(),
    busca,
    setBusca,
    filtroTipo,
    setFiltroTipo,
    filtroCategoria,
    setFiltroCategoria,
    mostrarArquivados,
    setMostrarArquivados,
    upload,
    editar,
    excluir,
    duplicar,
    favorito,
    arquivar,
    reload
  };
}
