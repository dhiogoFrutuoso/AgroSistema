import { Request, Response } from "express";
import { Types } from "mongoose";
import { Field } from "../models/Field.js";
import { MapMarker } from "../models/MapMarker.js";

export class MapController {
  // POST /api/maps/fields - Cria um talhão com dados de área
  static async createField(req: Request, res: Response): Promise<any> {
    try {
      const { farmId, name, crop, areaHa, geojson, active } = req.body;
      if (!farmId || !name) {
        return res.status(400).json({ error: "Os campos farmId e name são obrigatórios" });
      }

      const field = new Field({ farmId, name, crop, areaHa, geojson, active });
      await field.save();
      return res.status(201).json({ success: true, data: field });
    } catch (error) {
      console.error("❌ Erro ao criar área/talhão:", error);
      return res.status(500).json({ error: "Erro interno ao salvar talhão" });
    }
  }

  // POST /api/maps/markers - Cria um marcador de GPS (latitude/longitude)
  static async createMarker(req: Request, res: Response): Promise<any> {
    try {
      const { farmId, plotId, name, latitude, longitude, type, status, notes } = req.body;
      if (!farmId || !plotId || !name) {
        return res.status(400).json({ error: "Os campos farmId, plotId e name são obrigatórios" });
      }

      const marker = new MapMarker({ farmId, plotId, name, latitude, longitude, type, status, notes });
      await marker.save();
      return res.status(201).json({ success: true, data: marker });
    } catch (error) {
      console.error("❌ Erro ao criar marcador no mapa:", error);
      return res.status(500).json({ error: "Erro interno ao salvar marcador" });
    }
  }

  // GET /api/maps/farms/:farmId - Traz todos os dados geográficos de uma fazenda de uma vez só
  static async getFarmGeographics(req: Request, res: Response): Promise<any> {
    try {
      const { farmId } = req.params;

      if (!farmId || typeof farmId !== "string") {
        return res.status(400).json({ error: "O parâmetro farmId é obrigatório e deve ser uma string simples" });
      }

      // Valida se a string recebida é um ID hexadecimal válido de 24 caracteres do MongoDB
      if (!Types.ObjectId.isValid(farmId)) {
        return res.status(400).json({ error: "O formato do farmId fornecido é inválido" });
      }

      // Busca os registros associando o ID convertido de forma segura para o Mongoose
      const fields = await Field.find({ farmId: farmId as any });
      const markers = await MapMarker.find({ farmId: farmId as any }).populate("plotId", "name areaHa");

      return res.status(200).json({
        farmId,
        totalFields: fields.length,
        totalMarkers: markers.length,
        geometry: {
          fields,
          markers
        }
      });
    } catch (error) {
      console.error("❌ Erro ao buscar dados do mapa:", error);
      return res.status(500).json({ error: "Erro interno ao buscar dados geográficos" });
    }
  }
}