import { useEffect, useMemo, useState } from "react";
import IrrigacaoCronograma from "./components/IrrigacaoCronograma.jsx";
import IrrigacaoCustos from "./components/IrrigacaoCustos.jsx";
import IrrigacaoDashboard from "./components/IrrigacaoDashboard.jsx";
import IrrigacaoExportacao from "./components/IrrigacaoExportacao.jsx";
import IrrigacaoForm from "./components/IrrigacaoForm.jsx";
import IrrigacaoIntegracoes from "./components/IrrigacaoIntegracoes.jsx";
import IrrigacaoPainelResumo from "./components/IrrigacaoPainelResumo.jsx";
import IrrigacaoRelatorios from "./components/IrrigacaoRelatorios.jsx";
import IrrigacaoTable from "./components/IrrigacaoTable.jsx";
import IrrigacaoEditModal from "./components/IrrigacaoEditModal.jsx"; // NOVO

import {
  createRegistroApiFirst,
  updateRegistroApiFirst,
  deleteRegistroApiFirst,
  enviarResumoPainel,
  exportarCSV,
  exportarJSON,
  getDadosApiFirst,
  getResumo,
  registrarAuditoria
} from "./services/IrrigacaoService.js";

function safeParse(value, fallback = []) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

export default function IrrigacaoPage() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRegistro, setEditingRegistro] = useState(null);

  const talhoes = useMemo(() => {
    const gps = safeParse(localStorage.getItem("@arroz:gps:areas"), []);
    const talhoesLocal = safeParse(localStorage.getItem("@arroz:talhoes"), []);
    return [...gps, ...talhoesLocal];
  }, []);

  const financeiro = useMemo(() => safeParse(localStorage.getItem("@arroz:financeiro"), []), [dados]);
  const auditoria = useMemo(() => safeParse(localStorage.getItem("@arroz:auditoria"), []), [dados]);
  const resumo = useMemo(() => getResumo(), [dados]);
  const rotas = useMemo(() => dados.filter((i) => i.rotaParaTalhao).length, [dados]);

  async function carregar() {
    setLoading(true);
    try {
      const lista = await getDadosApiFirst();
      setDados(lista || []);
    } catch (error) {
      console.error("Erro ao carregar irrigação:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleCreate(payload) {
    try {
      await createRegistroApiFirst(payload);
      await carregar();
      alert("Irrigação cadastrada com sucesso!");
    } catch (error) {
      alert(error.message || "Erro ao salvar.");
    }
  }

  async function handleUpdate(id, dadosAtualizados) {
    try {
      await updateRegistroApiFirst(id, dadosAtualizados);
      setEditingRegistro(null);
      await carregar();
      alert("Irrigação atualizada com sucesso!");
    } catch (error) {
      alert(error.message || "Erro ao atualizar.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja realmente excluir este registro de irrigação?")) return;
    try {
      await deleteRegistroApiFirst(id);
      await carregar();
    } catch (error) {
      alert(error.message || "Erro ao excluir.");
    }
  }

  if (loading && dados.length === 0) {
    return <div className="flex min-h-[50vh] items-center justify-center text-blue-400 font-bold tracking-widest">CARREGANDO ÁGUAS E IRRIGAÇÃO...</div>;
  }

  return (
    <div className="space-y-8">
      <IrrigacaoDashboard resumo={resumo} />
      <IrrigacaoCustos resumo={resumo} />
      <IrrigacaoIntegracoes talhoes={talhoes} financeiro={financeiro} auditoria={auditoria} rotas={rotas} />
      <IrrigacaoRelatorios dados={dados} resumo={resumo} />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <IrrigacaoPainelResumo resumo={resumo} onEnviar={enviarResumoPainel} />
        <IrrigacaoExportacao onCSV={exportarCSV} onJSON={exportarJSON} onBackup={() => alert('Backup feito via JSON.')} />
      </div>

      <IrrigacaoCronograma dados={dados} />
      
      <IrrigacaoForm onCreate={handleCreate} talhoes={talhoes} />
      <IrrigacaoTable dados={dados} onDelete={handleDelete} onEdit={setEditingRegistro} />

      {editingRegistro && (
        <IrrigacaoEditModal
          linha={editingRegistro}
          talhoes={talhoes}
          onUpdate={handleUpdate}
          onClose={() => setEditingRegistro(null)}
        />
      )}
    </div>
  );
}