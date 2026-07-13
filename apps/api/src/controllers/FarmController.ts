import { Request, Response } from "express";
import { Farm } from "../models/Farm.js";
import { Plot } from "../models/Plot.js";

export class FarmController {
  // POST /api/farms - Cadastra uma nova fazenda
  static async createFarm(req: Request, res: Response): Promise<any> {
    try {
      const { name, owner, city, state, totalAreaHa } = req.body;

      if (!name) {
        return res.status(400).json({ error: "O nome da fazenda é obrigatório" });
      }

      const newFarm = new Farm({
        name,
        owner,
        city,
        state,
        totalAreaHa,
        status: "active"
      });

      await newFarm.save();
      return res.status(201).json({ success: true, data: newFarm });
    } catch (error) {
      console.error("❌ Erro ao criar fazenda:", error);
      return res.status(500).json({ error: "Erro interno ao salvar fazenda" });
    }
  }

  // GET /api/farms - Lista todas as fazendas
  static async listFarms(req: Request, res: Response): Promise<any> {
    try {
      const farms = await Farm.find();
      return res.status(200).json({ total: farms.length, data: farms });
    } catch (error) {
      console.error("❌ Erro ao listar fazendas:", error);
      return res.status(500).json({ error: "Erro interno ao buscar fazendas" });
    }
  }

  // POST /api/farms/:farmId/plots - Cria um talhão dentro de uma fazenda
  static async createPlot(req: Request, res: Response): Promise<any> {
    try {
      const { farmId } = req.params;
      const { name, areaHa, cropType } = req.body;

      if (!name) {
        return res.status(400).json({ error: "O nome do talhão é obrigatório" });
      }

      // Verifica se a fazenda informada realmente existe
      const farmExists = await Farm.findById(farmId);
      if (!farmExists) {
        return res.status(444).json({ error: "Fazenda não encontrada" });
      }

      const newPlot = new Plot({
        farmId,
        name,
        areaHa,
        cropType: cropType || "Arroz",
        status: "active"
      });

      await newPlot.save();
      return res.status(201).json({ success: true, data: newPlot });
    } catch (error) {
      console.error("❌ Erro ao criar talhão:", error);
      return res.status(500).json({ error: "Erro interno ao salvar talhão" });
    }
  }

  // GET /api/farms/plots - Lista todos os talhões trazendo os dados da fazenda junto
  static async listAllPlots(req: Request, res: Response): Promise<any> {
    try {
      const plots = await Plot.find().populate("farmId", "name owner city");
      return res.status(200).json({ total: plots.length, data: plots });
    } catch (error) {
      console.error("❌ Erro ao listar talhões:", error);
      return res.status(500).json({ error: "Erro interno ao buscar talhões" });
    }
  }
}