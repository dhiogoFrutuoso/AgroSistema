import { Schema, model, Document } from "mongoose";

export interface IMachine extends Document {
  codigo?: string;
  nome: string;
  marca?: string;
  modelo?: string;
  ano?: string;
  placa?: string;
  operador?: string;
  fazenda?: string;
  talhao?: string;
  horimetro?: number;
  combustivel?: string;
  consumo?: number;
  status: "DISPONIVEL" | "OPERANDO" | "MANUTENCAO" | "PARADA";
  observacoes?: string;
  imagemMaquina?: string;
}

const MachineSchema = new Schema<IMachine>(
  {
    codigo: { type: String, trim: true },
    nome: { type: String, required: true, trim: true },
    marca: { type: String, trim: true },
    modelo: { type: String, trim: true },
    ano: { type: String, trim: true },
    placa: { type: String, trim: true },
    operador: { type: String, trim: true },
    fazenda: { type: String, trim: true },
    talhao: { type: String, trim: true },
    horimetro: { type: Number, default: 0 },
    combustivel: { type: String, default: "Diesel" },
    consumo: { type: Number, default: 0 },
    status: { type: String, default: "DISPONIVEL" },
    observacoes: { type: String, trim: true },
    imagemMaquina: { type: String }
  },
  { timestamps: true }
);

export const Machine = model<IMachine>("Machine", MachineSchema);