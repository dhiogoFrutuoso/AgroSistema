import { useEffect, useMemo, useState } from "react";
import ColheitaCustos from "./components/ColheitaCustos.jsx";
import ColheitaCronograma from "./components/ColheitaCronograma.jsx";
import ColheitaDashboard from "./components/ColheitaDashboard.jsx";
import ColheitaExportacao from "./components/ColheitaExportacao.jsx";
import ColheitaForm from "./components/ColheitaForm.jsx";
import ColheitaIntegracoes from "./components/ColheitaIntegracoes.jsx";
import ColheitaPainelResumo from "./components/ColheitaPainelResumo.jsx";
import ColheitaRelatorios from "./components/ColheitaRelatorios.jsx";
import ColheitaTable from "./components/ColheitaTable.jsx";
import ColheitaEditModal from "./components/ColheitaEditModal.jsx"; // NOVO MODAL

import {
  createRegistroApiFirst,
  deleteRegistroApiFirst,
  updateRegistroApiFirst,
  enviarResumoPainel,
  exportarCSV,
  exportarJSON,
  getDadosApiFirst,
  getResumo,
  registrarAuditoria
} from "./services/ColheitaService.js";

function safeParse(value, fallback = []) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

function baixarBackup() {
  const payload = { modulo: "Colheita", data: new Date().toISOString(), registros: safeParse(localStorage.getItem("@arroz:colheita"), []), resumo: safeParse(localStorage.getItem("@arroz:colheita:resumo"), {}) };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "backup-colheita.json"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

export default function ColheitaPage() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRegistro, setEditingRegistro] = useState(null);

  const talhoes = useMemo(() => {
    const gps = safeParse(localStorage.getItem("@arroz:gps:areas"), []);
    const talhoesLocal = safeParse(localStorage.getItem("@arroz:talhoes"), []);
    return [...gps, ...talhoesLocal];
  }, []);

  const maquinas = useMemo(() => safeParse(localStorage.getItem("@arroz:maquinas"), []), []);
  const financeiro = useMemo(() => safeParse(localStorage.getItem("@arroz:financeiro"), []), [dados]);
  const auditoria = useMemo(() => safeParse(localStorage.getItem("@arroz:auditoria"), []), [dados]);
  const resumo = useMemo(() => getResumo(), [dados]);

  async function carregar() {
    setLoading(true);
    try {
      const lista = await getDadosApiFirst();
      setDados(lista || []);
    } catch (error) {
      console.error("Erro ao carregar colheita:", error);
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
      alert("Registro de Colheita salvo com sucesso!");
    } catch (error) {
      alert(error.message || "Erro ao salvar a colheita.");
    }
  }

  async function handleUpdate(id, dadosAtualizados) {
    try {
      await updateRegistroApiFirst(id, dadosAtualizados);
      setEditingRegistro(null);
      await carregar();
      alert("Registro atualizado com sucesso!");
    } catch (error) {
      alert(error.message || "Erro ao atualizar a colheita.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja realmente excluir este registro de colheita?")) return;
    try {
      await deleteRegistroApiFirst(id);
      await carregar();
    } catch (error) {
      alert(error.message || "Erro ao excluir o registro.");
    }
  }

  function handleResumo() {
    enviarResumoPainel();
    alert("Resumo da Colheita enviado para o Painel.");
  }

  function handleBackup() {
    baixarBackup();
    registrarAuditoria("EXPORTACAO", "Backup de colheita exportado");
  }

  if (loading && dados.length === 0) {
    return <div className="flex min-h-[50vh] items-center justify-center text-blue-400 font-bold tracking-widest">CARREGANDO LOGÍSTICA E COLHEITA...</div>;
  }

  return (
    <div className="space-y-8">
      <ColheitaDashboard resumo={resumo} />
      <ColheitaCustos dados={dados} />
      <ColheitaIntegracoes talhoes={talhoes} maquinas={maquinas} financeiro={financeiro} auditoria={auditoria} />
      <ColheitaRelatorios dados={dados} resumo={resumo} />
      <ColheitaExportacao onCSV={exportarCSV} onJSON={exportarJSON} onBackup={handleBackup} />
      <ColheitaPainelResumo resumo={resumo} onEnviar={handleResumo} />
      <ColheitaCronograma dados={dados} />
      
      <ColheitaForm 
        onCreate={handleCreate} 
        talhoes={talhoes} 
        maquinas={maquinas} 
      />
      
      <ColheitaTable 
        dados={dados} 
        onDelete={handleDelete} 
        onEdit={setEditingRegistro} 
      />

      {editingRegistro && (
        <ColheitaEditModal
          linha={editingRegistro}
          talhoes={talhoes}
          maquinas={maquinas}
          onUpdate={handleUpdate}
          onClose={() => setEditingRegistro(null)}
        />
      )}
    </div>
  );
}