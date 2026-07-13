import app from "./app.js"; // Importa o app configurado acima
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 3333;

const startServer = async () => {
  try {
    // 1. Conecta ao banco de dados
    await connectDB();
    
    // 2. Inicia o servidor usando o app configurado
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Falha crítica ao iniciar o servidor:", err);
    process.exit(1); 
  }
};

startServer();