import { Search } from "lucide-react";
import { CATEGORIAS_DOCUMENTOS } from "../utils/documentosUtils.js";

export default function FiltrosDocumentos({
  busca,
  setBusca,
  filtroTipo,
  setFiltroTipo,
  filtroCategoria,
  setFiltroCategoria,
  mostrarArquivados,
  setMostrarArquivados
}) {
  return (
    <div className="doc-filters">
      <div className="doc-search">
        <Search size={20} />
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar por nome, categoria, tipo ou usuario..." />
      </div>

      <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
        <option value="TODOS">Todos</option>
        <option value="PDF">PDF</option>
        <option value="IMAGEM">Imagem</option>
        <option value="PLANILHA">Planilha</option>
        <option value="CONTRATOS">Contrato</option>
        <option value="FAVORITOS">Favoritos</option>
      </select>

      <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
        <option value="TODOS">Todas categorias</option>
        {CATEGORIAS_DOCUMENTOS.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
      </select>

      <label className="doc-toggle">
        <input type="checkbox" checked={mostrarArquivados} onChange={(e) => setMostrarArquivados(e.target.checked)} />
        Mostrar arquivados
      </label>
    </div>
  );
}
