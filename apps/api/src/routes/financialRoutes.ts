import { Router } from "express";
import { FinancialController } from "../controllers/FinancialController.js";

const router = Router();

router.post("/transactions", FinancialController.createTransaction);
router.get("/transactions", FinancialController.listTransactions);

export default router;