import { Router } from "express";
import {
  getFinances,
  createFinance,
  updateFinance,
  deleteFinance
} from "../controllers/FinanceController.js";

const router = Router();

router.get("/", getFinances);
router.post("/", createFinance);
router.put("/:id", updateFinance);
router.delete("/:id", deleteFinance);

export default router;