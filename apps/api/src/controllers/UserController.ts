import { Request, Response } from "express";
import { User } from "../models/User.js";

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, cpf, senha, isAdmin } = req.body;

    if (!nome || !cpf || !senha) {
      res.status(400).json({ error: "Nome, CPF e Senha são obrigatórios." });
      return;
    }

    // Gerar usuario baseado no CPF se nao enviado
    const usuario = req.body.usuario || cpf;

    const userExists = await User.findOne({ $or: [{ cpf }, { usuario }] });
    if (userExists) {
      res.status(409).json({ error: "Usuário ou CPF já cadastrado no sistema." });
      return;
    }

    // Define o perfil
    const perfil = isAdmin ? "ADMIN" : "FUNCIONARIO";

    const newUser = new User({
      nome,
      cpf,
      usuario,
      senha,
      perfil
    });

    await newUser.save();

    // Remove a senha antes de retornar
    const userResponse = newUser.toObject();
    delete userResponse.senha;

    res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
      user: userResponse
    });
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno ao processar a criação do usuário." });
  }
};