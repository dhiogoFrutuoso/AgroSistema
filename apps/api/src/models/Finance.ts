import { Schema, model, Document } from "mongoose";

export interface IFinance extends Document {
  tipo: "RECEITA" | "DESPESA";
  descricao: string;
  categoria?: string;
  valor: number;
  dataLancamento?: string;
  dataVencimento?: string;
  status: "PENDENTE" | "PAGO" | "ATRASADO" | "CANCELADO";
  formaPagamento?: string;
  fornecedor?: string;
  centroCusto?: string;
  contaBancaria?: string;
  competencia?: string;
  comprovante?: string; // Base64
  fazenda?: string;
  talhao?: string;
  responsavel?: string;
  observacoes?: string;
}

const FinanceSchema = new Schema<IFinance>(
  {
    tipo: { type: String, enum: ["RECEITA", "DESPESA"], required: true },
    descricao: { type: String, required: true, trim: true },
    categoria: { type: String, trim: true, default: "Geral" },
    valor: { type: Number, required: true },
    dataLancamento: { type: String },
    dataVencimento: { type: String },
    status: { type: String, default: "PENDENTE" },
    formaPagamento: { type: String, default: "Dinheiro" },
    fornecedor: { type: String, trim: true },
    centroCusto: { type: String, trim: true, default: "Geral" },
    contaBancaria: { type: String, trim: true, default: "Caixa Central" },
    competencia: { type: String },
    comprovante: { type: String },
    fazenda: { type: String, trim: true },
    talhao: { type: String, trim: true },
    responsavel: { type: String, trim: true },
    observacoes: { type: String, trim: true }
  },
  { timestamps: true }
);

export const Finance = model<IFinance>("Finance", FinanceSchema);