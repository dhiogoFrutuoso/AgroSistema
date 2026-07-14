import { Request, Response } from "express";
import { Planting } from "../models/Planting.js";
import { Irrigation } from "../models/Irrigation.js";
import { Harvest } from "../models/Harvest.js";

export class ProductionController {
  static async startPlanting(req: Request, res: Response): Promise<any> {
    try {
      const { farmId, fieldId, cropVariety, startDate, estimatedHarvestDate } = req.body;
      if (!farmId || !fieldId || !startDate) {
        return res.status(400).json({ error: "Campos farmId, fieldId e startDate são obrigatórios" });
      }

      const planting = new Planting({ farmId, fieldId, cropVariety, startDate, estimatedHarvestDate });
      await planting.save();
      return res.status(201).json({ success: true, data: planting });
    } catch (error) {
      console.error("❌ Erro ao registrar plantio:", error);
      return res.status(500).json({ error: "Erro interno ao salvar plantio" });
    }
  }

  static async logIrrigation(req: Request, res: Response): Promise<any> {
    try {
      const { fieldId, litersPerSquareMeter, durationMinutes, date, status } = req.body;
      if (!fieldId || litersPerSquareMeter === undefined || durationMinutes === undefined) {
        return res.status(400).json({ error: "Dados de volumetria e identificação do talhão são obrigatórios" });
      }

      const irrigation = new Irrigation({ fieldId, litersPerSquareMeter, durationMinutes, date, status });
      await irrigation.save();
      return res.status(201).json({ success: true, data: irrigation });
    } catch (error) {
      console.error("❌ Erro ao registrar irrigação:", error);
      return res.status(500).json({ error: "Erro interno ao salvar irrigação" });
    }
  }

  static async logHarvest(req: Request, res: Response): Promise<any> {
    try {
      const { plantingId, fieldId, quantityTons, harvestDate, qualityGrade } = req.body;
      if (!plantingId || !fieldId || quantityTons === undefined) {
        return res.status(400).json({ error: "Dados de produção e fechamento de lote são obrigatórios" });
      }

      const harvest = new Harvest({ plantingId, fieldId, quantityTons, harvestDate, qualityGrade });
      await harvest.save();

      await Planting.findByIdAndUpdate(plantingId, { status: "CONCLUIDO" });

      return res.status(201).json({ success: true, data: harvest });
    } catch (error) {
      console.error("❌ Erro ao registrar colheita:", error);
      return res.status(500).json({ error: "Erro interno ao salvar colheita" });
    }
  }

  static async getProductionSummary(req: Request, res: Response): Promise<any> {
    try {
      const activePlantings = await Planting.find({ status: "EM_ANDAMENTO" })
        .populate("farmId", "name")
        .populate("fieldId", "name areaHa");

      const totalHarvested = await Harvest.find();
      const totalTons = totalHarvested.reduce((acc, h) => acc + (h as any).quantityTons, 0);

      return res.status(200).json({
        activePlantingsCount: activePlantings.length,
        totalTonsHarvestedAllTime: totalTons,
        currentFields: activePlantings
      });
    } catch (error) {
      console.error("❌ Erro ao buscar sumário:", error);
      return res.status(500).json({ error: "Erro interno ao compilar sumário de safra" });
    }
  }
}