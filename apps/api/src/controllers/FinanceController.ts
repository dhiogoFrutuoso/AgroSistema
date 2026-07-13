import { Request, Response } from "express";
import { Finance } from "../models/Finance.js";

export const getFinances = async (req: Request, res: Response): Promise<void> => {
  try {
    const finances = await Finance.find().sort({ createdAt: -1 });
    res.status(200).json(finances);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar lançamentos financeiros." });
  }
};

export const createFinance = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.descricao || req.body.valor === undefined) {
      res.status(400).json({ error: "Descrição e valor são obrigatórios." });
      return;
    }

    const newFinance = new Finance(req.body);
    await newFinance.save();
    
    res.status(201).json(newFinance);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar lançamento financeiro." });
  }
};

export const updateFinance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    delete updateData._id;
    delete updateData.id;

    const updatedFinance = await Finance.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedFinance) {
      res.status(404).json({ error: "Lançamento não encontrado." });
      return;
    }

    res.status(200).json(updatedFinance);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar lançamento financeiro." });
  }
};

export const deleteFinance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Finance.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir lançamento financeiro." });
  }
};