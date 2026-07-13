import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  nome: string;
  cpf: string;
  rg?: string;
  dataNascimento?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cargo?: string;
  salario?: number;
  dataAdmissao?: string;
  usuario: string;
  senha?: string;
  foto?: string;
  perfil: "ADMIN" | "OPERADOR";
  status: "ATIVO" | "BLOQUEADO";
  permissoes: Record<string, boolean>;
  ultimoLogin?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    nome: { type: String, required: true, trim: true },
    cpf: { type: String, required: true, unique: true, trim: true },
    rg: { type: String, trim: true },
    dataNascimento: { type: String },
    telefone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    endereco: { type: String, trim: true },
    cidade: { type: String, trim: true },
    estado: { type: String, trim: true },
    cargo: { type: String, trim: true },
    salario: { type: Number, default: 0 },
    dataAdmissao: { type: String },
    usuario: { type: String, required: true, unique: true, trim: true, lowercase: true },
    senha: { type: String, required: true },
    foto: { type: String },
    perfil: { type: String, enum: ["ADMIN", "OPERADOR"], default: "OPERADOR" },
    status: { type: String, enum: ["ATIVO", "BLOQUEADO"], default: "ATIVO" },
    permissoes: { type: Map, of: Boolean, default: {} },
    ultimoLogin: { type: Date }
  },
  { timestamps: true }
);

UserSchema.pre<IUser>("save", async function (this: IUser) {
  if (!this.isModified("senha") || !this.senha) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
  } catch (error: any) {
    throw error;
  }
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  if (!this.senha) return false;
  return bcrypt.compare(password, this.senha);
};

export const User = model<IUser>("User", UserSchema);