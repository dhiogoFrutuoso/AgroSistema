import { Router } from "express";
import { ProductionController } from "../controllers/ProductionController.js";

const router = Router();

router.post("/plantings", ProductionController.startPlanting);
router.post("/irrigations", ProductionController.logIrrigation);
router.post("/harvests", ProductionController.logHarvest);
router.get("/summary", ProductionController.getProductionSummary);

export default router;