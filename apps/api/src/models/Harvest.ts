import { Schema, model, Document } from "mongoose";

export interface IHarvest extends Document {
  safra: string;
  fazenda: string;
  talhao: string;
  cultura: string;
  variedade?: string;
  areaHa: number;
  dataInicio: string;
  dataFim?: string;
  operador?: string;
  maquina?: string;
  destino?: string;
  caminhao?: string;
  pesoBruto: number;
  tara: number;
  pesoLiquido: number;
  umidade?: number;
  produtividade: number;
  custoMaoObra?: number;
  custoMaquina?: number;
  custoCombustivel?: number;
  outrosCustos?: number;
  custoTotal: number;
  status: "PLANEJADA" | "EM_ANDAMENTO" | "FINALIZADA" | "PAUSADA";
  observacoes?: string;
  ticketBalanca?: string; // Base64 image
}

const HarvestSchema = new Schema<IHarvest>(
  {
    safra: { type: String, required: true, trim: true },
    fazenda: { type: String, required: true, trim: true },
    talhao: { type: String, required: true, trim: true },
    cultura: { type: String, default: "Arroz", trim: true },
    variedade: { type: String, trim: true },
    areaHa: { type: Number, required: true, default: 0 },
    dataInicio: { type: String, required: true },
    dataFim: { type: String },
    operador: { type: String, trim: true },
    maquina: { type: String, trim: true },
    destino: { type: String, trim: true },
    caminhao: { type: String, trim: true },
    pesoBruto: { type: Number, default: 0 },
    tara: { type: Number, default: 0 },
    pesoLiquido: { type: Number, default: 0 },
    umidade: { type: Number, default: 0 },
    produtividade: { type: Number, default: 0 },
    custoMaoObra: { type: Number, default: 0 },
    custoMaquina: { type: Number, default: 0 },
    custoCombustivel: { type: Number, default: 0 },
    outrosCustos: { type: Number, default: 0 },
    custoTotal: { type: Number, default: 0 },
    status: { type: String, default: "EM_ANDAMENTO" },
    observacoes: { type: String, trim: true },
    ticketBalanca: { type: String }
  },
  { timestamps: true }
);

export const Harvest = model<IHarvest>("Harvest", HarvestSchema);