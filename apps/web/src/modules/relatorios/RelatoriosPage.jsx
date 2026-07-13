import { useEffect, useMemo, useState } from "react";
import RelatoriosDashboard from "./components/RelatoriosDashboard.jsx";
import RelatoriosExportacao from "./components/RelatoriosExportacao.jsx";
import RelatoriosForm from "./components/RelatoriosForm.jsx";
import RelatoriosTabela from "./components/RelatoriosTabela.jsx";
import RelatoriosModal from "./components/RelatoriosModal.jsx";
import RelatoriosEditModal from "./components/RelatoriosEditModal.jsx";
import {
  criarRegistroRelatorioApiFirst,
  atualizarRegistroRelatorioApiFirst,
  excluirRegistroRelatorioApiFirst,
  getRegistrosRelatoriosApiFirst,
  getResumo
} from "./services/relatoriosService.js";

export default function RelatoriosPage() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumo, setResumo] = useState(null);
  
  const [busca, setBusca] = useState("");
  const [moduloFiltro, setModuloFiltro] = useState("TODOS");
  
  const [viewModal, setViewModal] = useState(null);
  const [editando, setEditando] = useState(null);

  async function carregar() {
    setLoading(true);
    try {
      const lista = await getRegistrosRelatoriosApiFirst();
      setRegistros(lista || []);
      setResumo(getResumo());
    } catch (error) {
      console.error("Erro ao carregar relatórios", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleCriar(payload) {
    try {
      await criarRegistroRelatorioApiFirst(payload);
      await carregar();
      alert("Relatório registrado com sucesso!");
    } catch (error) {
      alert("Erro ao registrar.");
    }
  }

  async function handleAtualizar(id, payload) {
    try {
      await atualizarRegistroRelatorioApiFirst(id, payload);
      setEditando(null);
      await carregar();
    } catch (error) {
      alert("Erro ao atualizar.");
    }
  }

  async function handleExcluir(id) {
    if (!window.confirm("Deseja excluir este registro de relatório?")) return;
    try {
      await excluirRegistroRelatorioApiFirst(id);
      await carregar();
    } catch (error) {
      alert("Erro ao excluir.");
    }
  }

  const filtrados = useMemo(() => {
    return registros.filter((item) => {
      const texto = `${item.titulo} ${item.modulo} ${item.tipo} ${item.responsavel}`.toLowerCase();
      const okBusca = texto.includes(busca.toLowerCase());
      const okModulo = moduloFiltro === "TODOS" || item.modulo === moduloFiltro;
      return okBusca && okModulo;
    });
  }, [registros, busca, moduloFiltro]);

  if (loading && registros.length === 0) {
    return <div className="flex min-h-[50vh] items-center justify-center font-bold tracking-widest text-amber-400">CARREGANDO DADOS E CONSOLIDANDO RELATÓRIOS...</div>;
  }

  return (
    <div className="space-y-6">
      <RelatoriosDashboard resumo={resumo || getResumo()} />
      
      <div className="grid gap-6 lg:grid-cols-2">
         <RelatoriosExportacao />
         <RelatoriosForm onCreate={handleCriar} />
      </div>

      <RelatoriosTabela
        registros={filtrados}
        busca={busca}
        setBusca={setBusca}
        moduloFiltro={moduloFiltro}
        setModuloFiltro={setModuloFiltro}
        onView={setViewModal}
        onEdit={setEditando}
        onDelete={handleExcluir}
      />

      <RelatoriosModal 
        registro={viewModal} 
        onClose={() => setViewModal(null)} 
      />
      
      {editando && (
        <RelatoriosEditModal 
          linha={editando} 
          onUpdate={handleAtualizar} 
          onClose={() => setEditando(null)} 
        />
      )}
    </div>
  );
}