import { Router } from "express";
import { getPlantings, createPlanting, updatePlanting, deletePlanting } from "../controllers/PlantingController.js";

const router = Router();
router.get("/", getPlantings);
router.post("/", createPlanting);
router.put("/:id", updatePlanting);
router.delete("/:id", deletePlanting);

export default router;