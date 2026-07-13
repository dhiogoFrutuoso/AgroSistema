import { Request, Response } from "express";
import { Audit } from "../models/Audit.js";

export const getAudits = async (req: Request, res: Response): Promise<void> => {
  try {
    // Retorna os últimos 1000 registros para não pesar a rede
    const records = await Audit.find().sort({ dataHora: -1 }).limit(1000);
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar auditoria." });
  }
};

export const createAudit = async (req: Request, res: Response): Promise<void> => {
  try {
    const newRecord = new Audit(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar evento na auditoria." });
  }
};

export const deleteAudit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Audit.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir registro." });
  }
};

export const clearAudits = async (req: Request, res: Response): Promise<void> => {
  try {
    await Audit.deleteMany({});
    
    // Registra quem limpou a base
    const clearRecord = new Audit({
      usuario: req.body.usuario || "Administrador",
      modulo: "Auditoria",
      acao: "EXCLUSAO",
      descricao: "Todo o histórico de auditoria foi apagado.",
      nivel: "CRITICO",
      dataHora: new Date().toISOString()
    });
    await clearRecord.save();

    res.status(200).json({ success: true, message: "Auditoria limpa." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao limpar auditoria." });
  }
};