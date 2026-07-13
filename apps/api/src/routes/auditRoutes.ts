import { Router } from "express";
import { getAudits, createAudit, deleteAudit, clearAudits } from "../controllers/AuditController.js";

const router = Router();
router.get("/", getAudits);
router.post("/", createAudit);
router.post("/clear", clearAudits); // Rota especial para limpar tudo
router.delete("/:id", deleteAudit);

export default router;