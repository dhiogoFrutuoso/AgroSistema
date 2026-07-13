import { useEffect, useMemo, useState } from "react";
import OperadorAssinatura from "./components/OperadorAssinatura.jsx";
import OperadorDashboard from "./components/OperadorDashboard.jsx";
import OperadorExportacao from "./components/OperadorExportacao.jsx";
import OperadorPainelResumo from "./components/OperadorPainelResumo.jsx";
import OperadorRelatorios from "./components/OperadorRelatorios.jsx";
import OperadorForm from "./components/OperadorForm.jsx"; // NOVO
import OperadorTable from "./components/OperadorTable.jsx"; // NOVO
import OperadorEditModal from "./components/OperadorEditModal.jsx"; // NOVO

import {
  getDados,
  createOperador,
  updateOperador,
  deleteOperador,
  getResumo
} from "./services/OperadorService.js";

export default function OperadorPage() {
  const [linhas, setLinhas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [assinando, setAssinando] = useState(null);
  const [editingLinha, setEditingLinha] = useState(null);

  const resumo = useMemo(() => getResumo(linhas), [linhas]);

  async function carregar() {
    setLoading(true);
    try {
      const lista = await getDados();
      setLinhas(lista || []);
    } catch (error) {
      console.error("Erro ao carregar dados do operador:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionar(novaLinha) {
    try {
      await createOperador(novaLinha);
      await carregar();
      alert("Serviço registrado com sucesso!");
    } catch (error) {
      alert(error.message || "Erro ao salvar o serviço.");
    }
  }

  async function atualizar(id, dadosAtualizados) {
    try {
      await updateOperador(id, dadosAtualizados);
      setEditingLinha(null);
      await carregar();
      alert("Registro atualizado com sucesso!");
    } catch (error) {
      alert(error.message || "Erro ao atualizar o registro.");
    }
  }

  async function remover(id) {
    if (!window.confirm("Deseja realmente excluir este registro?")) return;
    try {
      await deleteOperador(id);
      await carregar();
    } catch (error) {
      alert(error.message || "Erro ao excluir o registro.");
    }
  }

  async function salvarAssinatura(dataUrl) {
    try {
      await updateOperador(assinando.id || assinando._id, { 
        ...assinando, 
        assinaturaCliente: dataUrl, 
        status: "ASSINADO" 
      });
      setAssinando(null);
      await carregar();
      alert("Assinatura salva com sucesso!");
    } catch (error) {
      alert(error.message || "Erro ao salvar a assinatura.");
    }
  }

  if (loading && linhas.length === 0) {
    return <div className="flex h-64 items-center justify-center text-emerald-400 font-bold tracking-widest">CARREGANDO DADOS...</div>;
  }

  return (
    <div className="space-y-6">
      <OperadorDashboard linhas={linhas} resumo={resumo} />

      <div className="grid gap-6 lg:grid-cols-2">
        <OperadorPainelResumo linhas={linhas} resumo={resumo} />
        <OperadorExportacao linhas={linhas} />
      </div>

      <OperadorRelatorios linhas={linhas} resumo={resumo} />

      <OperadorForm onSubmit={adicionar} />

      <OperadorTable
        linhas={linhas}
        onDelete={remover}
        onEdit={setEditingLinha}
        onAssinar={setAssinando}
      />

      {editingLinha && (
        <OperadorEditModal
          linha={editingLinha}
          onUpdate={atualizar}
          onClose={() => setEditingLinha(null)}
        />
      )}

      <OperadorAssinatura
        aberto={Boolean(assinando)}
        linha={assinando}
        onClose={() => setAssinando(null)}
        onSave={salvarAssinatura}
      />
    </div>
  );
}