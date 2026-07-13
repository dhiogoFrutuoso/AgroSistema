import { Schema, model, Document } from "mongoose";

export interface IIrrigation extends Document {
  empresaAgua: string;
  responsavelEmpresa?: string;
  telefoneEmpresa?: string;
  documentoEmpresa?: string;
  tipoCobranca: string;
  mesReferencia: string;
  dataLancamento: string;
  vincularTalhao: boolean;
  talhaoId?: string;
  talhaoNome?: string;
  fazenda?: string;
  cultura?: string;
  safra?: string;
  rotaParaTalhao: boolean;
  observacoesRota?: string;
  valorHa: number;
  hectares: number;
  loteHa: number;
  meses: number;
  lotes: number;
  valorMensal: number;
  valorTotal: number;
  valorPago: number;
  valorDevido: number;
  statusPagamento: "DEVENDO" | "PARCIAL" | "PAGO";
  statusOperacao: "ATIVA" | "CONCLUIDA" | "PAUSADA" | "CANCELADA";
  observacoes?: string;
  comprovante?: string; // Imagem Base64 do contrato ou recibo
}

const IrrigationSchema = new Schema<IIrrigation>(
  {
    empresaAgua: { type: String, required: true, trim: true },
    responsavelEmpresa: { type: String, trim: true },
    telefoneEmpresa: { type: String, trim: true },
    documentoEmpresa: { type: String, trim: true },
    tipoCobranca: { type: String, default: "AGRANEL" },
    mesReferencia: { type: String, required: true },
    dataLancamento: { type: String, required: true },
    vincularTalhao: { type: Boolean, default: false },
    talhaoId: { type: String },
    talhaoNome: { type: String, trim: true },
    fazenda: { type: String, trim: true },
    cultura: { type: String, default: "Arroz", trim: true },
    safra: { type: String, trim: true },
    rotaParaTalhao: { type: Boolean, default: false },
    observacoesRota: { type: String, trim: true },
    valorHa: { type: Number, default: 0 },
    hectares: { type: Number, default: 0 },
    loteHa: { type: Number, default: 0 },
    meses: { type: Number, default: 1 },
    lotes: { type: Number, default: 0 },
    valorMensal: { type: Number, default: 0 },
    valorTotal: { type: Number, default: 0 },
    valorPago: { type: Number, default: 0 },
    valorDevido: { type: Number, default: 0 },
    statusPagamento: { type: String, default: "DEVENDO" },
    statusOperacao: { type: String, default: "ATIVA" },
    observacoes: { type: String, trim: true },
    comprovante: { type: String }
  },
  { timestamps: true }
);

export const Irrigation = model<IIrrigation>("Irrigation", IrrigationSchema);