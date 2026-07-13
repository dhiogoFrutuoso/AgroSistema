import { Router } from "express";
import { getOperators, createOperator, updateOperator, deleteOperator } from "../controllers/operatorController.js";

const router = Router();

router.get("/", getOperators);
router.post("/", createOperator);
router.put("/:id", updateOperator);
router.delete("/:id", deleteOperator);

export default router;