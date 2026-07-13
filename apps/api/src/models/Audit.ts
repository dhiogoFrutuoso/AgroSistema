import { Schema, model, Document } from "mongoose";

export interface IAudit extends Document {
  usuario: string;
  modulo: string;
  acao: string;
  descricao: string;
  nivel: "INFO" | "ALERTA" | "CRITICO";
  dataHora: string;
}

const AuditSchema = new Schema<IAudit>(
  {
    usuario: { type: String, required: true, default: "Sistema" },
    modulo: { type: String, required: true },
    acao: { type: String, required: true },
    descricao: { type: String, required: true },
    nivel: { type: String, default: "INFO" },
    dataHora: { type: String, required: true }
  },
  { timestamps: true }
);

export const Audit = model<IAudit>("Audit", AuditSchema);