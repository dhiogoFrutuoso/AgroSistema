import { api } from "./api.js"; 

export async function createAdminOrUser(payload) {
  try {
    console.log("Service: chamando api.post('/users', ...)", payload);
    const response = await api.post("/users", payload);
    console.log("Service: Resposta recebida", response);
    return { success: true, data: response.data };
  } catch (error) {
    // IMPORTANTE: Logs detalhados
    if (error.response) {
      console.error("Erro na API (Status " + error.response.status + "):", error.response.data);
    } else {
      console.error("Erro de conexão (o servidor nem respondeu):", error);
    }
    return { success: false, error: "Falha na requisição" };
  }
}