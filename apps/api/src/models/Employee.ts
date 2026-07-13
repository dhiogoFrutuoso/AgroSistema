import { Schema, model, Document } from "mongoose";

export interface IEmployee extends Document {
  nome: string;
  cpf?: string;
  telefone?: string;
  cargo?: string;
  salario?: number;
  dataAdmissao?: Date;
  userId?: Schema.Types.ObjectId; // Vinculo opcional com a conta de acesso
  ativo: boolean;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    nome: { type: String, required: true, trim: true },
    cpf: { type: String, sparse: true, trim: true },
    telefone: { type: String, trim: true },
    cargo: { type: String, trim: true },
    salario: { type: Number, default: 0 },
    dataAdmissao: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    ativo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Employee = model<IEmployee>("Employee", EmployeeSchema);