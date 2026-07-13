import { Router } from "express";
import authRoutes from "./authRoutes.js";
import employeeRoutes from "./employeeRoutes.js";
import farmRoutes from "./farmRoutes.js";
import inventoryRoutes from "./inventoryRoutes.js";
import financialRoutes from "./financialRoutes.js";
import productionRoutes from "./productionRoutes.js";
import supportRoutes from "./supportRoutes.js";
import mapRoutes from "./mapRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/farms", farmRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/financial", financialRoutes);
router.use("/production", productionRoutes);
router.use("/support", supportRoutes);
router.use("/maps", mapRoutes);

export default router;