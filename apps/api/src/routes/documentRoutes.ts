import { Router } from "express";
import { getDocuments, createDocument, updateDocument, deleteDocument } from "../controllers/DocumentController.js";

const router = Router();
router.get("/", getDocuments);
router.post("/", createDocument);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);

export default router;