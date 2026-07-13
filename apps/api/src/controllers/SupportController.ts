import { Request, Response } from "express";
import { DocumentModel } from "../models/Document.js";
import { Report } from "../models/Report.js";
import { AuditLog } from "../models/Audit.js";
import { Setting } from "../models/Setting.js";

export class SupportController {
  // --- SETTINGS ---
  static async updateSetting(req: Request, res: Response): Promise<any> {
    try {
      const { key, value, description } = req.body;
      if (!key) return res.status(400).json({ error: "A chave de configuração é obrigatória" });

      const setting = await Setting.findOneAndUpdate(
        { key },
        { value, description },
        { new: true, upsert: true }
      );
      return res.status(200).json({ success: true, data: setting });
    } catch (error) {
      console.error("❌ Erro ao salvar configuração:", error);
      return res.status(500).json({ error: "Erro interno ao salvar configuração" });
    }
  }

  // --- DOCUMENTS ---
  static async createDocument(req: Request, res: Response): Promise<any> {
    try {
      const { title, type, filePath, description, uploadedBy } = req.body;
      if (!title || !filePath) return res.status(400).json({ error: "Título e caminho do arquivo são obrigatórios" });

      const doc = new DocumentModel({ title, type, filePath, description, uploadedBy: uploadedBy || undefined });
      await doc.save();
      return res.status(201).json({ success: true, data: doc });
    } catch (error) {
      console.error("❌ Erro ao salvar documento:", error);
      return res.status(500).json({ error: "Erro interno ao salvar documento" });
    }
  }

  // --- AUDIT LOGS ---
  static async listLogs(req: Request, res: Response): Promise<any> {
    try {
      const logs = await AuditLog.find().populate("userId", "nome usuario").sort({ createdAt: -1 }).limit(100);
      return res.status(200).json({ data: logs });
    } catch (error) {
      console.error("❌ Erro ao listar logs:", error);
      return res.status(500).json({ error: "Erro interno ao buscar logs" });
    }
  }
}