import { Router } from "express";
import {
  getEmployees,
  getMaps,
  getPlots,
  getInventory,
  getMachines,
  getPlantings,
  getHarvests,
  getIrrigations,
  getDocuments,
  getAudit,
  getFinance
} from "../controllers/DashboardController.js";

const router = Router();

router.get("/employees", getEmployees);
router.get("/maps", getMaps);
router.get("/plots", getPlots);
router.get("/inventory", getInventory);
router.get("/machines", getMachines);
router.get("/plantings", getPlantings);
router.get("/harvests", getHarvests);
router.get("/irrigations", getIrrigations);
router.get("/documents", getDocuments);
router.get("/audit", getAudit);
router.get("/finance", getFinance);

export default router;