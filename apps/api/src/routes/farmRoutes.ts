import { Router } from "express";
import { FarmController } from "../controllers/FarmController.js";

const router = Router();

router.post("/", FarmController.createFarm);
router.get("/", FarmController.listFarms);
router.post("/:farmId/plots", FarmController.createPlot);
router.get("/plots", FarmController.listAllPlots);

export default router;