import { Router } from "express";
import { getHarvests, createHarvest, updateHarvest, deleteHarvest } from "../controllers/HarvestController.js";

const router = Router();

router.get("/", getHarvests);
router.post("/", createHarvest);
router.put("/:id", updateHarvest);
router.delete("/:id", deleteHarvest);

export default router;