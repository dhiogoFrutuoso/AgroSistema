import { Request, Response } from "express";
import { Planting } from "../models/Planting.js";

export const getPlantings = async (req: Request, res: Response): Promise<void> => {
  try {
    const records = await Planting.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar registros de plantio." });
  }
};

export const createPlanting = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.fazenda || !req.body.talhao) {
      res.status(400).json({ error: "Fazenda e Talhão são obrigatórios." });
      return;
    }
    const newRecord = new Planting(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar registro de plantio." });
  }
};

export const updatePlanting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;

    const updatedRecord = await Planting.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedRecord) {
      res.status(404).json({ error: "Registro não encontrado." });
      return;
    }
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar registro." });
  }
};

export const deletePlanting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Planting.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir registro." });
  }
};