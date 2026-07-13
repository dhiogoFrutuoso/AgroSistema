import { Request, Response } from "express";
import { Inventory } from "../models/Inventory.js";

export const getInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Inventory.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos do estoque." });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.nome || req.body.quantidade === undefined) {
      res.status(400).json({ error: "Nome e quantidade são obrigatórios." });
      return;
    }

    const status = Number(req.body.quantidade) <= 0 ? "ESGOTADO" : Number(req.body.quantidade) <= Number(req.body.minimo) ? "BAIXO" : "DISPONÍVEL";
    
    const newProduct = new Inventory({ ...req.body, status });
    await newProduct.save();
    
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar produto no estoque." });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    delete updateData._id;
    delete updateData.id;

    if (updateData.quantidade !== undefined || updateData.minimo !== undefined) {
      const qtd = Number(updateData.quantidade || 0);
      const min = Number(updateData.minimo || 0);
      updateData.status = qtd <= 0 ? "ESGOTADO" : qtd <= min ? "BAIXO" : "DISPONÍVEL";
    }

    const updatedProduct = await Inventory.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedProduct) {
      res.status(404).json({ error: "Produto não encontrado." });
      return;
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar produto no estoque." });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Inventory.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir produto do estoque." });
  }
};