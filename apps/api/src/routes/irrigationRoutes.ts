import { Router } from "express";
import { getIrrigations, createIrrigation, updateIrrigation, deleteIrrigation } from "../controllers/IrrigationController.js";

const router = Router();
router.get("/", getIrrigations);
router.post("/", createIrrigation);
router.put("/:id", updateIrrigation);
router.delete("/:id", deleteIrrigation);

export default router;