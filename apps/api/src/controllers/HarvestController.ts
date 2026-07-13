import { Request, Response } from "express";
import { Harvest } from "../models/Harvest.js";

export const getHarvests = async (req: Request, res: Response): Promise<void> => {
  try {
    const records = await Harvest.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar registros de colheita." });
  }
};

export const createHarvest = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.fazenda || !req.body.talhao) {
      res.status(400).json({ error: "Fazenda e Talhão são obrigatórios." });
      return;
    }

    const newRecord = new Harvest(req.body);
    await newRecord.save();
    
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar registro de colheita." });
  }
};

export const updateHarvest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    delete updateData._id;
    delete updateData.id;

    const updatedRecord = await Harvest.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedRecord) {
      res.status(404).json({ error: "Registro de colheita não encontrado." });
      return;
    }

    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar registro de colheita." });
  }
};

export const deleteHarvest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Harvest.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir registro de colheita." });
  }
};