import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/SettingController.js";

const router = Router();
router.get("/", getSettings);
router.post("/", updateSettings); // Usaremos POST para atualizar/criar a config única

export default router;