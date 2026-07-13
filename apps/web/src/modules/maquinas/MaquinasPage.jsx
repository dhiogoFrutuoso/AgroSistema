import { useEffect, useState } from "react";
import MaquinasForm from "./components/MaquinasForm.jsx";
import MaquinasTable from "./components/MaquinasTable.jsx";
import MaquinasEditModal from "./components/MaquinasEditModal.jsx";
import MaquinasManutencoes from "./components/MaquinasManutencoes.jsx";
import MaquinasIntegracoes from "./components/MaquinasIntegracoes.jsx";
import MaquinasPainelResumo from "./components/MaquinasPainelResumo.jsx";
import MaquinasRelatorios from "./components/MaquinasRelatorios.jsx";

import {
  getMaquinas,
  createMaquina,
  deleteMaquina,
  updateMaquina
} from "./services/MaquinasService.js";

export default function MaquinasPage() {
  const [maquinas, setMaquinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMaquina, setEditingMaquina] = useState(null);

  async function carregar() {
    setLoading(true);
    try {
      const lista = await getMaquinas();
      setMaquinas(lista);
    } catch (error) {
      console.error("Erro ao carregar máquinas:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionar(novaMaquina) {
    try {
      await createMaquina(novaMaquina);
      await carregar();
      alert("Máquina cadastrada com sucesso!");
    } catch (error) {
      alert(error.message || "Erro ao salvar a máquina.");
    }
  }

  async function atualizar(id, dadosAtualizados) {
    try {
      await updateMaquina(id, dadosAtualizados);
      setEditingMaquina(null);
      await carregar();
      alert("Máquina atualizada com sucesso!");
    } catch (error) {
      alert(error.message || "Erro ao atualizar a máquina.");
    }
  }

  async function remover(id) {
    const maquina = maquinas.find(m => String(m.id) === String(id) || String(m._id) === String(id));

    if (!window.confirm(`Deseja realmente excluir a máquina "${maquina?.nome || 'selecionada'}"?`)) {
      return;
    }

    try {
      await deleteMaquina(id);
      await carregar();
    } catch (error) {
      alert(error.message || "Erro ao excluir a máquina.");
    }
  }

  if (loading && maquinas.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white">
        <span className="text-lg font-bold tracking-widest text-indigo-400">CARREGANDO FROTAS E MÁQUINAS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <MaquinasIntegracoes />
        <div className="flex flex-col gap-6">
          <MaquinasPainelResumo />
          <MaquinasRelatorios />
        </div>
      </div>

      <MaquinasManutencoes />

      <MaquinasForm onSubmit={adicionar} />

      <MaquinasTable
        maquinas={maquinas}
        onDelete={remover}
        onEdit={setEditingMaquina}
      />

      {editingMaquina && (
        <MaquinasEditModal
          maquina={editingMaquina}
          onUpdate={atualizar}
          onClose={() => setEditingMaquina(null)}
        />
      )}
    </div>
  );
}