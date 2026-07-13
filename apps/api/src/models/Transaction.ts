import { Schema, model, Document } from "mongoose";

export interface ITransaction extends Document {
  description: string;
  type: "receita" | "despesa";
  category: "venda_producao" | "insumos" | "manutencao" | "salario" | "combustivel" | "outros";
  value: number;
  dueDate: Date;
  paymentDate?: Date;
  status: "pago" | "pendente" | "cancelado";
  farmId?: Schema.Types.ObjectId;
  machineId?: Schema.Types.ObjectId;
  notes?: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    description: { type: String, required: true, trim: true },
    type: { type: String, enum: ["receita", "despesa"], required: true },
    category: {
      type: String,
      enum: ["venda_producao", "insumos", "manutencao", "salario", "combustivel", "outros"],
      required: true
    },
    value: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    paymentDate: { type: Date },
    status: { type: String, enum: ["pago", "pendente", "cancelado"], default: "pendente" },
    farmId: { type: Schema.Types.ObjectId, ref: "Farm" },
    machineId: { type: Schema.Types.ObjectId, ref: "Machine" },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>("Transaction", TransactionSchema);