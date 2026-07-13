import { Router } from "express";
import {
  getMachines,
  createMachine,
  updateMachine,
  deleteMachine
} from "../controllers/MachineController.js";

const router = Router();

router.get("/", getMachines);
router.post("/", createMachine);
router.put("/:id", updateMachine);
router.delete("/:id", deleteMachine);

export default router;