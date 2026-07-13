import { Schema, model, Document } from "mongoose";

export interface IReport extends Document {
  titulo: string;
  modulo: string;
  tipo: string;
  responsavel: string;
  periodoInicio?: string;
  periodoFim?: string;
  observacoes?: string;
}

const ReportSchema = new Schema<IReport>(
  {
    titulo: { type: String, required: true, trim: true },
    modulo: { type: String, default: "GERAL", trim: true },
    tipo: { type: String, default: "EXECUTIVO", trim: true },
    responsavel: { type: String, required: true, trim: true },
    periodoInicio: { type: String },
    periodoFim: { type: String },
    observacoes: { type: String, trim: true }
  },
  { timestamps: true }
);

export const Report = model<IReport>("Report", ReportSchema);