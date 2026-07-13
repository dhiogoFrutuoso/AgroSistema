import { Request, Response } from "express";
import { Setting } from "../models/Setting.js";

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Se não existir nenhuma config no banco, cria uma vazia (o front-end preenche o default)
      settings = await Setting.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar configurações." });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
      res.status(201).json(settings);
      return;
    }

    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;

    const updatedRecord = await Setting.findByIdAndUpdate(settings._id, updateData, { new: true });
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar configurações." });
  }
};