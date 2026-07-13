import { Router } from "express";
import { MapController } from "../controllers/MapController.js";

const router = Router();

router.post("/fields", MapController.createField);
router.post("/markers", MapController.createMarker);
router.get("/farms/:farmId", MapController.getFarmGeographics);

export default router;