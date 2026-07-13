import { Router } from "express";
import { createUser } from "../controllers/UserController.js"; // Ajuste o caminho conforme seu projeto

const router = Router();

// A rota aqui é '/' porque no app.ts ela será montada como '/users'
router.post("/", createUser);

export default router;