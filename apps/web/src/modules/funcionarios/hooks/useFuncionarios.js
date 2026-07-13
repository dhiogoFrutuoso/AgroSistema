import { useState, useEffect, useCallback } from "react";
import { api } from "../../../services/api.js";

export default function useFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const carregarFuncionarios = useCallback(async () => {
    setLoadingData(true);
    try {
      const response = await api.get("/employees");
      if (response.ok) {
        const dataNormalizada = (response.data || []).map(f => ({
          ...f,
          id: f._id || f.id
        }));
        setFuncionarios(dataNormalizada);
      }
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    carregarFuncionarios();
  }, [carregarFuncionarios]);

  const criar = async (payload) => {
    const response = await api.post("/employees", payload);
    if (response.ok) {
      const novo = { ...response.data, id: response.data._id || response.data.id };
      setFuncionarios(prev => [novo, ...prev]);
      return novo;
    }
    throw new Error(response.error || "Erro ao criar funcionário");
  };

  const editar = async (id, payload) => {
    const response = await api.put(`/employees/${id}`, payload);
    if (response.ok) {
      const editado = { ...response.data, id: response.data._id || response.data.id };
      setFuncionarios(prev => prev.map((f) => (f.id === id ? editado : f)));
      return editado;
    }
    throw new Error(response.error || "Erro ao editar funcionário");
  };

  const excluir = async (id) => {
    const response = await api.delete(`/employees/${id}`);
    if (response.ok) {
      setFuncionarios(prev => prev.filter((f) => f.id !== id));
    } else {
      throw new Error(response.error || "Erro ao excluir funcionário");
    }
  };

  const bloquear = async (id) => {
    return editar(id, { status: "BLOQUEADO" });
  };

  const liberar = async (id) => {
    return editar(id, { status: "ATIVO" });
  };

  const resetar = async (id) => {
    return editar(id, { senha: "123456" });
  };

  const resumo = {
    total: funcionarios.length,
    ativos: funcionarios.filter((f) => f.status === "ATIVO").length,
    bloqueados: funcionarios.filter((f) => f.status === "BLOQUEADO").length,
    admins: funcionarios.filter((f) => f.perfil === "ADMIN").length,
    operadores: funcionarios.filter((f) => f.perfil !== "ADMIN").length
  };

  return {
    funcionarios,
    resumo,
    loadingData,
    criar,
    editar,
    excluir,
    bloquear,
    liberar,
    resetar,
    recarregar: carregarFuncionarios
  };
}