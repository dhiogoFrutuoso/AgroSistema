import { Request, Response } from "express";
import { Plot } from "../models/Plot.js";

export const getPlots = async (req: Request, res: Response): Promise<void> => {
  try {
    const plots = await Plot.find().sort({ createdAt: -1 });
    res.status(200).json(plots);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar talhoes." });
  }
};

export const createPlot = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.nome) {
      res.status(400).json({ error: "O nome do talhao e obrigatorio." });
      return;
    }

    const newPlot = new Plot(req.body);
    await newPlot.save();
    
    res.status(201).json(newPlot);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar talhao." });
  }
};

export const updatePlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    delete updateData._id;
    delete updateData.id;

    const updatedPlot = await Plot.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedPlot) {
      res.status(404).json({ error: "Talhao nao encontrado." });
      return;
    }

    res.status(200).json(updatedPlot);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar talhao." });
  }
};

export const deletePlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Plot.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir talhao." });
  }
};