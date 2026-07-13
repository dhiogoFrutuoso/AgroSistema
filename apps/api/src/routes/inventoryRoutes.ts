import { Router } from "express";
import {
  getInventory,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/InventoryController.js";

const router = Router();

router.get("/", getInventory);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;