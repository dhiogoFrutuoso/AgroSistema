import { useEffect, useState } from "react";
import FinanceiroDashboard from "./components/FinanceiroDashboard.jsx";
import FinanceiroFluxoCaixa from "./components/FinanceiroFluxoCaixa.jsx";
import FinanceiroCentroCustos from "./components/FinanceiroCentroCustos.jsx";
import FinanceiroGraficos from "./components/FinanceiroGraficos.jsx";
import FinanceiroContasPagar from "./components/FinanceiroContasPagar.jsx";
import FinanceiroContasReceber from "./components/FinanceiroContasReceber.jsx";
import FinanceiroExportacao from "./components/FinanceiroExportacao.jsx";
import FinanceiroForm from "./components/FinanceiroForm.jsx";
import FinanceiroTable from "./components/FinanceiroTable.jsx";
import FinanceiroEditModal from "./components/FinanceiroEditModal.jsx"; // IMPORT NOVO MODAL

import {
  getLancamentosApiFirst,
  createLancamentoApiFirst,
  deleteLancamentoApiFirst,
  updateLancamentoApiFirst
} from "./services/financeiroService.js";

import { registrarFinanceiro } from "./services/financeiroAuditoriaService.js";

export default function FinanceiroPage() {
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLancamento, setEditingLancamento] = useState(null); // NOVO STATE DE EDICAO

  async function carregar() {
    setLoading(true);
    try {
      const lista = await getLancamentosApiFirst();
      setLancamentos(lista);
    } catch (error) {
      console.error("Erro ao carregar os lançamentos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionar(novoLancamento) {
    try {
      await createLancamentoApiFirst(novoLancamento);

      registrarFinanceiro({
        acao: "CADASTRO",
        descricao: `Lançamento criado: ${novoLancamento.descricao || "Sem descrição"}`,
        nivel: "INFO"
      });

      await carregar();
      alert("Lançamento salvo com sucesso!");
    } catch (error) {
      alert(error.message || "Erro ao salvar o lançamento. Verifique a conexão com o banco de dados.");
    }
  }

  async function atualizar(id, dadosAtualizados) {
    try {
      await updateLancamentoApiFirst(id, dadosAtualizados);
      
      registrarFinanceiro({
        acao: "EDICAO",
        descricao: `Lançamento atualizado: ${dadosAtualizados.descricao || "Sem descrição"}`,
        nivel: "INFO"
      });
      
      setEditingLancamento(null);
      await carregar();
      alert("Lançamento atualizado com sucesso!");
    } catch (error) {
      alert(error.message || "Erro ao atualizar o lançamento.");
    }
  }

  async function remover(id) {
    const lancamento = lancamentos.find(item => String(item.id) === String(id) || String(item._id) === String(id));

    if (!window.confirm(`Deseja realmente excluir o lançamento "${lancamento?.descricao || 'selecionado'}"?`)) {
      return;
    }

    try {
      await deleteLancamentoApiFirst(id);

      registrarFinanceiro({
        acao: "EXCLUSAO",
        descricao: `Lançamento removido: ${lancamento?.descricao || "Sem descrição"}`,
        nivel: "ALERTA"
      });

      await carregar();
    } catch (error) {
      alert(error.message || "Erro ao excluir o lançamento.");
    }
  }

  if (loading && lancamentos.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white">
        <span className="text-lg font-bold tracking-widest text-emerald-400">CARREGANDO DADOS FINANCEIROS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FinanceiroDashboard lancamentos={lancamentos} />
      <FinanceiroGraficos lancamentos={lancamentos} />
      <FinanceiroFluxoCaixa lancamentos={lancamentos} />
      <FinanceiroCentroCustos lancamentos={lancamentos} />

      <div className="grid gap-6 lg:grid-cols-2">
        <FinanceiroContasPagar />
        <FinanceiroContasReceber />
      </div>

      <FinanceiroExportacao />

      <FinanceiroForm onSubmit={adicionar} />

      <FinanceiroTable
        data={lancamentos}
        onDelete={remover}
        onEdit={setEditingLancamento}
      />

      {editingLancamento && (
        <FinanceiroEditModal
          lancamento={editingLancamento}
          onUpdate={atualizar}
          onClose={() => setEditingLancamento(null)}
        />
      )}
    </div>
  );
}