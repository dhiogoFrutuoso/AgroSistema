import { useState, useEffect, useMemo } from "react";
import AuditoriaDashboard from "./components/AuditoriaDashboard.jsx";
import AuditoriaExportacao from "./components/AuditoriaExportacao.jsx";
import AuditoriaTable from "./components/AuditoriaTable.jsx";
import AuditoriaTimeline from "./components/AuditoriaTimeline.jsx";
import AuditoriaModal from "./components/AuditoriaModal.jsx";

import {
  isAdmin,
  getAuditoriaApiFirst,
  deleteRegistroApiFirst,
  limparAuditoriaApiFirst,
  gerarEventoTeste,
  getResumo
} from "./services/auditoriaService.js";

export default function AuditoriaPage() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumo, setResumo] = useState({ total: 0, hojeTotal: 0 });

  // Filtros de Tabela
  const [busca, setBusca] = useState("");
  const [acao, setAcao] = useState("TODOS");
  const [nivel, setNivel] = useState("TODOS");
  const [modulo, setModulo] = useState("TODOS");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [detalhes, setDetalhes] = useState(null);

  async function carregar() {
    setLoading(true);
    try {
      const lista = await getAuditoriaApiFirst();
      setRegistros(lista || []);
      setResumo(getResumo());
    } catch (error) {
      console.error("Erro ao carregar auditoria:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  if (!isAdmin()) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
        <h1 className="text-3xl font-black text-white">Acesso Restrito</h1>
        <p className="mt-2 text-slate-300">Somente o Perfil Administrador pode visualizar logs de segurança e auditoria.</p>
      </div>
    );
  }

  async function confirmarExcluir(id) {
    if (!window.confirm("Deseja excluir este registro de auditoria?")) return;
    try {
      await deleteRegistroApiFirst(id);
      await carregar();
    } catch (error) {
      alert("Erro ao excluir log.");
    }
  }

  async function confirmarLimpar() {
    if (!window.confirm("ALERTA CRÍTICO: Deseja apagar TODO o histórico de auditoria? Esta ação não pode ser desfeita.")) return;
    try {
      await limparAuditoriaApiFirst();
      await carregar();
      alert("Auditoria limpa com sucesso.");
    } catch (error) {
      alert("Erro ao limpar auditoria.");
    }
  }

  async function dispararTeste() {
    gerarEventoTeste();
    await carregar();
  }

  const filtrados = useMemo(() => {
    return registros.filter((item) => {
      const texto = `${item.usuario} ${item.modulo} ${item.acao}${item.descricao} ${item.nivel}`.toLowerCase();
      const okBusca = texto.includes(busca.toLowerCase());
      const okAcao = acao === "TODOS" || String(item.acao || "").toUpperCase() === acao;
      const okNivel = nivel === "TODOS" || String(item.nivel || "").toUpperCase() === nivel;
      const okModulo = modulo === "TODOS" || String(item.modulo || "") === modulo;

      const data = String(item.dataHora || "").slice(0, 10);
      const okInicio = !dataInicio || data >= dataInicio;
      const okFim = !dataFim || data <= dataFim;

      return okBusca && okAcao && okNivel && okModulo && okInicio && okFim;
    });
  }, [registros, busca, acao, nivel, modulo, dataInicio, dataFim]);

  if (loading && registros.length === 0) {
    return <div className="flex min-h-[50vh] items-center justify-center font-bold tracking-widest text-indigo-400">CARREGANDO LOGS DE SEGURANÇA...</div>;
  }

  return (
    <div className="space-y-6">
      <AuditoriaDashboard resumo={resumo} />

      <AuditoriaExportacao
        registros={filtrados}
        onLimpar={confirmarLimpar}
        onTeste={dispararTeste}
      />

      <AuditoriaTimeline registros={filtrados} onSelect={setDetalhes} />

      <AuditoriaTable
        registros={filtrados}
        onSelect={setDetalhes}
        onDelete={confirmarExcluir}
        filtros={{ busca, setBusca, acao, setAcao, nivel, setNivel, modulo, setModulo, dataInicio, setDataInicio, dataFim, setDataFim }}
      />

      <AuditoriaModal registro={detalhes} onClose={() => setDetalhes(null)} />
    </div>
  );
}