import { useEffect, useState } from "react";
import {
  aplicarTema,
  getConfiguracoes,
  getResumo,
  importarConfiguracoes,
  resetConfiguracoes,
  saveConfiguracoes
} from "../services/configuracoesService.js";

export function useConfiguracoes() {
  const [config, setConfig] = useState(() => getConfiguracoes());

  useEffect(() => {
    aplicarTema(config);
  }, [config]);

  function updateGrupo(grupo, campo, valor) {
    setConfig((prev) => ({
      ...prev,
      [grupo]: {
        ...prev[grupo],
        [campo]: valor
      }
    }));
  }

  function toggleGrupo(grupo, campo) {
    setConfig((prev) => ({
      ...prev,
      [grupo]: {
        ...prev[grupo],
        [campo]: !prev[grupo][campo]
      }
    }));
  }

  function salvar() {
    const salvo = saveConfiguracoes(config);
    setConfig(salvo);
    return salvo;
  }

  function resetar() {
    const novo = resetConfiguracoes();
    setConfig(novo);
  }

  async function importar(file) {
    const novo = await importarConfiguracoes(file);
    setConfig(novo);
  }

  return {
    config,
    setConfig,
    resumo: getResumo(),
    updateGrupo,
    toggleGrupo,
    salvar,
    resetar,
    importar
  };
}
