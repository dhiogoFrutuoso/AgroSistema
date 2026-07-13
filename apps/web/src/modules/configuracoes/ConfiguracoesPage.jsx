import { useEffect, useState } from "react";
import ConfiguracoesDashboard from "./components/ConfiguracoesDashboard.jsx";
import ConfigEmpresa from "./components/ConfigEmpresa.jsx";
import ConfigAparencia from "./components/ConfigAparencia.jsx";
import ConfigSeguranca from "./components/ConfigSeguranca.jsx";
import ConfigNotificacoes from "./components/ConfigNotificacoes.jsx";
import ConfigModulos from "./components/ConfigModulos.jsx";
import ConfigBackup from "./components/ConfigBackup.jsx";

import {
  getConfiguracoesApiFirst,
  saveConfiguracoesApiFirst,
  resetConfiguracoesApiFirst,
  importarConfiguracoes,
  getResumo
} from "./services/configuracoesService.js";

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState(null);
  const [resumo, setResumo] = useState({ modulosAtivos: 0 });

  async function loadData() {
    const cfg = await getConfiguracoesApiFirst();
    setConfig(cfg);
    setResumo(getResumo());
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateGrupo(grupo, campo, valor) {
    setConfig((prev) => ({ ...prev, [grupo]: { ...prev[grupo], [campo]: valor } }));
  }

  function toggleGrupo(grupo, campo) {
    setConfig((prev) => ({ ...prev, [grupo]: { ...prev[grupo], [campo]: !prev[grupo][campo] } }));
  }

  async function handleSalvar() {
    const salvo = await saveConfiguracoesApiFirst(config);
    setConfig(salvo);
    setResumo(getResumo());
    alert("Configurações aplicadas e salvas com sucesso no Banco de Dados!");
  }

  async function handleReset() {
    if (!window.confirm("Atenção: Restaurar o Padrão de Fábrica vai apagar todas as configurações da empresa. Continuar?")) return;
    const novo = await resetConfiguracoesApiFirst();
    setConfig(novo);
    setResumo(getResumo());
    alert("Sistema restaurado para o padrão original.");
  }

  async function handleImportar(file) {
    try {
      const novo = await importarConfiguracoes(file);
      setConfig(novo);
      setResumo(getResumo());
      alert("Arquivo de configurações importado com sucesso!");
    } catch {
      alert("Arquivo inválido. Certifique-se de importar um JSON do sistema.");
    }
  }

  if (!config) {
    return <div className="flex min-h-[50vh] items-center justify-center font-bold tracking-widest text-indigo-400">CARREGANDO ARQUIVOS DO SISTEMA...</div>;
  }

  return (
    <div className="space-y-6">
      <ConfiguracoesDashboard resumo={resumo} />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <ConfigEmpresa config={config} updateGrupo={updateGrupo} />
        <ConfigAparencia config={config} updateGrupo={updateGrupo} toggleGrupo={toggleGrupo} />
      </div>

      <ConfigModulos config={config} toggleGrupo={toggleGrupo} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ConfigSeguranca config={config} toggleGrupo={toggleGrupo} />
        <ConfigNotificacoes config={config} toggleGrupo={toggleGrupo} />
      </div>

      <ConfigBackup 
        config={config} 
        onSave={handleSalvar} 
        onReset={handleReset} 
        onImport={handleImportar} 
      />
    </div>
  );
}