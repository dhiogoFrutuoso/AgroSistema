import { api } from "./api.js";

export const login = async (usuario, senha) => {
  try {
    const response = await api.post("/api/auth/login", { usuario, senha });

    if (response.ok && response.data && response.data.token) {
      const user = response.data;
      const token = user.token;
      
      localStorage.setItem("@arroz:token", token);
      localStorage.setItem("@arroz:user", JSON.stringify(user));
      
      return { success: true, user };
    }

    return { 
      success: false, 
      error: response.data?.error || "Credenciais inválidas." 
    };
  } catch (error) {
    return { success: false, error: "Servidor offline ou recusou a conexão." };
  }
};

export const logout = () => {
  localStorage.removeItem("@arroz:token");
  localStorage.removeItem("@arroz:user");
};

export const getLoggedUser = () => {
  try {
    const user = localStorage.getItem("@arroz:user");
    if (!user || user === "undefined" || user === "null") {
      return null;
    }
    return JSON.parse(user);
  } catch (error) {
    return null;
  }
};