import { Request, Response } from "express";
import { Operator } from "../models/Operator.js";

export const getOperators = async (req: Request, res: Response): Promise<void> => {
  try {
    const records = await Operator.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar registros de operadores." });
  }
};

export const createOperator = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.nomeOperador || !req.body.cliente) {
      res.status(400).json({ error: "Operador e Cliente são obrigatórios." });
      return;
    }

    const newRecord = new Operator(req.body);
    await newRecord.save();
    
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar registro." });
  }
};

export const updateOperator = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    delete updateData._id;
    delete updateData.id;

    const updatedRecord = await Operator.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedRecord) {
      res.status(404).json({ error: "Registro não encontrado." });
      return;
    }

    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar registro." });
  }
};

export const deleteOperator = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Operator.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir registro." });
  }
};