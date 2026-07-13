import { Schema, model, Document } from "mongoose";

export interface IOperator extends Document {
  data: string;
  nomeOperador: string;
  maquinaAgricola: string;
  cliente: string;
  fazenda?: string;
  talhao?: string;
  servico: string;
  horaInicio: string;
  horaFim: string;
  horasTrabalhadas: number;
  valorHorario: number;
  valorTotal: number;
  litrosOleo: number;
  valorLitroOleo: number;
  gastoOleo: number;
  outrosGastos: number;
  custoTotal: number;
  lucroLiquido: number;
  tipoLancamentoFinanceiro: string;
  status: string;
  observacoes?: string;
  assinaturaCliente?: string; // Base64
}

const OperatorSchema = new Schema<IOperator>(
  {
    data: { type: String, required: true },
    nomeOperador: { type: String, required: true, trim: true },
    maquinaAgricola: { type: String, required: true, trim: true },
    cliente: { type: String, required: true, trim: true },
    fazenda: { type: String, trim: true },
    talhao: { type: String, trim: true },
    servico: { type: String, required: true, trim: true },
    horaInicio: { type: String, required: true },
    horaFim: { type: String, required: true },
    horasTrabalhadas: { type: Number, default: 0 },
    valorHorario: { type: Number, default: 0 },
    valorTotal: { type: Number, default: 0 },
    litrosOleo: { type: Number, default: 0 },
    valorLitroOleo: { type: Number, default: 0 },
    gastoOleo: { type: Number, default: 0 },
    outrosGastos: { type: Number, default: 0 },
    custoTotal: { type: Number, default: 0 },
    lucroLiquido: { type: Number, default: 0 },
    tipoLancamentoFinanceiro: { type: String, default: "RECEITA" },
    status: { type: String, default: "ABERTO" },
    observacoes: { type: String, trim: true },
    assinaturaCliente: { type: String }
  },
  { timestamps: true }
);

export const Operator = model<IOperator>("Operator", OperatorSchema);