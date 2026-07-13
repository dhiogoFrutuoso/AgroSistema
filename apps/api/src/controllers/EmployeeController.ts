import { Request, Response } from "express";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const employees = await User.find().select("-senha").sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar funcionarios." });
  }
};

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cpf, usuario, senha } = req.body;
    
    if (!senha) {
      res.status(400).json({ error: "A senha e obrigatoria." });
      return;
    }

    const exists = await User.findOne({ $or: [{ cpf }, { usuario }] });
    if (exists) {
      res.status(409).json({ error: "CPF ou Usuario ja cadastrado." });
      return;
    }

    const newUser = new User(req.body);
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.senha;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar funcionario." });
  }
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    delete updateData._id;
    delete updateData.id;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "Funcionario nao encontrado." });
      return;
    }

    if (updateData.cpf && updateData.cpf !== user.cpf) {
      const cpfExists = await User.findOne({ cpf: updateData.cpf });
      if (cpfExists) {
        res.status(409).json({ error: "CPF ja esta em uso." });
        return;
      }
    }

    if (updateData.usuario && updateData.usuario !== user.usuario) {
      const userExists = await User.findOne({ usuario: updateData.usuario });
      if (userExists) {
        res.status(409).json({ error: "Usuario ja esta em uso." });
        return;
      }
    }

    if (updateData.senha) {
      const salt = await bcrypt.genSalt(10);
      updateData.senha = await bcrypt.hash(updateData.senha, salt);
    } else {
      delete updateData.senha;
    }

    Object.assign(user, updateData);
    await user.updateOne(updateData);

    const updatedUser = await User.findById(id).select("-senha");
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar funcionario." });
  }
};

export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir funcionario." });
  }
};