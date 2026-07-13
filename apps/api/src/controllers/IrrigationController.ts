import { Request, Response } from "express";
import { Irrigation } from "../models/Irrigation.js";

export const getIrrigations = async (req: Request, res: Response): Promise<void> => {
  try {
    const records = await Irrigation.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar registros de irrigação." });
  }
};

export const createIrrigation = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.empresaAgua) {
      res.status(400).json({ error: "O nome da empresa de água é obrigatório." });
      return;
    }
    const newRecord = new Irrigation(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar registro de irrigação." });
  }
};

export const updateIrrigation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;

    const updatedRecord = await Irrigation.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedRecord) {
      res.status(404).json({ error: "Registro não encontrado." });
      return;
    }
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar registro de irrigação." });
  }
};

export const deleteIrrigation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Irrigation.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir registro de irrigação." });
  }
};