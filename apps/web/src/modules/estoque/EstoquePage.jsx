import { useEffect, useState } from "react";
import EstoqueDashboard from "./components/EstoqueDashboard.jsx";
import EstoqueAlertas from "./components/EstoqueAlertas.jsx";
import EstoqueMovimentacoes from "./components/EstoqueMovimentacoes.jsx";
import EstoqueHistorico from "./components/EstoqueHistorico.jsx";
import EstoqueExportacao from "./components/EstoqueExportacao.jsx";
import EstoqueForm from "./components/EstoqueForm.jsx";
import EstoqueTable from "./components/EstoqueTable.jsx";
import EstoqueEditModal from "./components/EstoqueEditModal.jsx"; // NOVO MODAL

import {
  getProdutosApiFirst,
  createProdutoApiFirst,
  deleteProdutoApiFirst,
  updateProdutoApiFirst
} from "./services/estoqueService.js";

import { registrarAuditoria } from "./services/estoqueAuditoriaService.js";

export default function EstoquePage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduto, setEditingProduto] = useState(null); // CONTROLE DO MODAL DE EDIÇÃO

  async function carregar() {
    setLoading(true);
    try {
      const lista = await getProdutosApiFirst();
      setProdutos(lista);
    } catch (error) {
      console.error("Erro ao carregar estoque:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionar(novoProduto) {
    try {
      await createProdutoApiFirst(novoProduto);

      registrarAuditoria({
        acao: "CADASTRO",
        descricao: `Produto cadastrado: ${novoProduto.nome}`,
        nivel: "INFO"
      });

      await carregar();
      alert("Produto salvo com sucesso no estoque!");
    } catch (error) {
      alert(error.message || "Erro ao salvar o produto.");
    }
  }

  async function atualizar(id, dadosAtualizados) {
    try {
      await updateProdutoApiFirst(id, dadosAtualizados);
      
      registrarAuditoria({
        acao: "EDICAO",
        descricao: `Produto atualizado: ${dadosAtualizados.nome}`,
        nivel: "INFO"
      });
      
      setEditingProduto(null);
      await carregar();
      alert("Produto atualizado com sucesso!");
    } catch (error) {
      alert(error.message || "Erro ao atualizar o produto.");
    }
  }

  async function remover(id) {
    const produto = produtos.find(p => String(p.id) === String(id) || String(p._id) === String(id));

    if (!window.confirm(`Deseja realmente excluir o produto "${produto?.nome || 'selecionado'}" do estoque?`)) {
      return;
    }

    try {
      await deleteProdutoApiFirst(id);

      registrarAuditoria({
        acao: "EXCLUSAO",
        descricao: `Produto removido: ${produto?.nome || "Sem nome"}`,
        nivel: "ALERTA"
      });

      await carregar();
    } catch (error) {
      alert(error.message || "Erro ao excluir o produto.");
    }
  }

  if (loading && produtos.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white">
        <span className="text-lg font-bold tracking-widest text-emerald-400">CARREGANDO DADOS DO ESTOQUE...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EstoqueDashboard produtos={produtos} />
      <EstoqueAlertas produtos={produtos} />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <EstoqueMovimentacoes />
        <EstoqueHistorico />
      </div>

      <EstoqueExportacao />

      <EstoqueForm onSubmit={adicionar} />

      <EstoqueTable
        data={produtos}
        onDelete={remover}
        onEdit={setEditingProduto}
      />

      {editingProduto && (
        <EstoqueEditModal
          produto={editingProduto}
          onUpdate={atualizar}
          onClose={() => setEditingProduto(null)}
        />
      )}
    </div>
  );
}