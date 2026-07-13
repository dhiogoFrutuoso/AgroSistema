import { Router } from "express";
import { SupportController } from "../controllers/SupportController.js";

const router = Router();

router.post("/settings", SupportController.updateSetting);
router.post("/documents", SupportController.createDocument);
router.get("/logs", SupportController.listLogs);

export default router;