import { Router } from "express";
import {
  getPlots,
  createPlot,
  updatePlot,
  deletePlot
} from "../controllers/PlotController.js";

const router = Router();

router.get("/", getPlots);
router.post("/", createPlot);
router.put("/:id", updatePlot);
router.delete("/:id", deletePlot);

export default router;