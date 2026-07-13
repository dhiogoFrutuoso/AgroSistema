import { useEffect, useState } from "react";
import PlantioDashboard from "./components/PlantioDashboard.jsx";
import PlantioCustosInsumos from "./components/PlantioCustosInsumos.jsx";
import PlantioCronograma from "./components/PlantioCronograma.jsx";
import PlantioIntegracoes from "./components/PlantioIntegracoes.jsx";
import PlantioExportacao from "./components/PlantioExportacao.jsx";
import PlantioRelatorios from "./components/PlantioRelatorios.jsx";
import PlantioPainelResumo from "./components/PlantioPainelResumo.jsx";
import PlantioForm from "./components/PlantioForm.jsx";
import PlantioTable from "./components/PlantioTable.jsx";
import PlantioEditModal from "./components/PlantioEditModal.jsx";

import {
  getPlantiosApiFirst,
  createPlantioApiFirst,
  updatePlantioApiFirst,
  deletePlantioApiFirst,
  getResumoPlantioApiFirst
} from "./services/plantioService.js";

export default function PlantioPage() {
  const [plantios, setPlantios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlantio, setEditingPlantio] = useState(null);

  const [resumo, setResumo] = useState({ total: 0, areaTotal: 0, custoTotal: 0, custoPorHa: 0, planejados: 0, andamento: 0, concluidos: 0 });

  async function carregar() {
    setLoading(true);
    try {
      const lista = await getPlantiosApiFirst();
      const resumoAtual = await getResumoPlantioApiFirst();
      setPlantios(lista || []);
      setResumo(resumoAtual);
    } catch (err) {
      console.error("Erro ao carregar plantio", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionar(plantio) {
    try {
      await createPlantioApiFirst(plantio);
      await carregar();
      alert("Plantio registrado com sucesso!");
    } catch (error) {
      alert(error.message || "Erro ao salvar.");
    }
  }

  async function atualizar(id, dadosAtualizados) {
    try {
      await updatePlantioApiFirst(id, dadosAtualizados);
      setEditingPlantio(null);
      await carregar();
      alert("Plantio atualizado com sucesso!");
    } catch (error) {
      alert(error.message || "Erro ao atualizar.");
    }
  }

  async function remover(id) {
    if (!window.confirm("Deseja excluir este plantio?")) return;
    try {
      await deletePlantioApiFirst(id);
      await carregar();
    } catch (error) {
      alert(error.message || "Erro ao excluir.");
    }
  }

  if (loading && plantios.length === 0) {
    return <div className="flex min-h-[50vh] items-center justify-center font-bold tracking-widest text-green-400">CARREGANDO DADOS DE PLANTIO...</div>;
  }

  return (
    <div className="space-y-6">
      <PlantioDashboard resumo={resumo} />
      <PlantioCustosInsumos plantios={plantios} />
      
      <div className="grid gap-6 lg:grid-cols-2">
         <PlantioIntegracoes plantios={plantios} />
         <div className="flex flex-col gap-6">
           <PlantioPainelResumo resumo={resumo} />
           <PlantioExportacao plantios={plantios} />
         </div>
      </div>

      <PlantioCronograma plantios={plantios} />
      <PlantioRelatorios plantios={plantios} />

      <PlantioForm onSubmit={adicionar} />
      
      <PlantioTable 
        plantios={plantios} 
        onDelete={remover} 
        onEdit={setEditingPlantio} 
      />

      {editingPlantio && (
        <PlantioEditModal
          linha={editingPlantio}
          onUpdate={atualizar}
          onClose={() => setEditingPlantio(null)}
        />
      )}
    </div>
  );
}