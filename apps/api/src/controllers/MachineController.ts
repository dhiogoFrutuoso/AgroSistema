import { Request, Response } from "express";
import { Machine } from "../models/Machine.js";

export const getMachines = async (req: Request, res: Response): Promise<void> => {
  try {
    const machines = await Machine.find().sort({ createdAt: -1 });
    res.status(200).json(machines);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar máquinas." });
  }
};

export const createMachine = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.nome) {
      res.status(400).json({ error: "O nome da máquina é obrigatório." });
      return;
    }

    const newMachine = new Machine(req.body);
    await newMachine.save();
    
    res.status(201).json(newMachine);
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar máquina." });
  }
};

export const updateMachine = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    delete updateData._id;
    delete updateData.id;

    const updatedMachine = await Machine.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedMachine) {
      res.status(404).json({ error: "Máquina não encontrada." });
      return;
    }

    res.status(200).json(updatedMachine);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar máquina." });
  }
};

export const deleteMachine = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Machine.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir máquina." });
  }
};