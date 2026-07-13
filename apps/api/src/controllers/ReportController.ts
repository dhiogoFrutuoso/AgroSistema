import { Request, Response } from "express";
import { Report } from "../models/Report.js";

export const getReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const records = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar histórico de relatórios." });
  }
};

export const createReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const newRecord = new Report(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar relatório." });
  }
};

export const updateReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;

    const updatedRecord = await Report.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedRecord) {
      res.status(404).json({ error: "Registro não encontrado." });
      return;
    }
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar registro." });
  }
};

export const deleteReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Report.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir registro." });
  }
};