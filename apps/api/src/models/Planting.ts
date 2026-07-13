import { Schema, model, Document } from "mongoose";

export interface IPlanting extends Document {
  safra: string;
  fazenda: string;
  talhao: string;
  cultura: string;
  variedade?: string;
  area: number;
  dataInicio: string;
  dataFim?: string;
  operador?: string;
  maquina?: string;
  sementes?: number;
  insumos?: number;
  custoMaquina?: number;
  maoObra?: number;
  outrosCustos?: number;
  custoTotal: number;
  produtividadePrevista?: number;
  status: "PLANEJADO" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO";
  observacoes?: string;
  anexo?: string; // Imagem Base64
}

const PlantingSchema = new Schema<IPlanting>(
  {
    safra: { type: String, required: true, trim: true },
    fazenda: { type: String, required: true, trim: true },
    talhao: { type: String, required: true, trim: true },
    cultura: { type: String, default: "Arroz", trim: true },
    variedade: { type: String, trim: true },
    area: { type: Number, required: true, default: 0 },
    dataInicio: { type: String, required: true },
    dataFim: { type: String },
    operador: { type: String, trim: true },
    maquina: { type: String, trim: true },
    sementes: { type: Number, default: 0 },
    insumos: { type: Number, default: 0 },
    custoMaquina: { type: Number, default: 0 },
    maoObra: { type: Number, default: 0 },
    outrosCustos: { type: Number, default: 0 },
    custoTotal: { type: Number, default: 0 },
    produtividadePrevista: { type: Number, default: 0 },
    status: { type: String, default: "PLANEJADO" },
    observacoes: { type: String, trim: true },
    anexo: { type: String }
  },
  { timestamps: true }
);

export const Planting = model<IPlanting>("Planting", PlantingSchema);