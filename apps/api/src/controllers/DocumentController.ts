import { Request, Response } from "express";
import { AppDocument } from "../models/Document.js";

export const getDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const records = await AppDocument.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar documentos." });
  }
};

export const createDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.arquivo) {
      res.status(400).json({ error: "O arquivo é obrigatório." });
      return;
    }
    const newRecord = new AppDocument(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer upload do documento." });
  }
};

export const updateDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;

    const updatedRecord = await AppDocument.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedRecord) {
      res.status(404).json({ error: "Documento não encontrado." });
      return;
    }
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar documento." });
  }
};

export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await AppDocument.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir documento." });
  }
};