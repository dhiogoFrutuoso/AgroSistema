import { Schema, model, Document as MongoDocument } from "mongoose";

export interface IDocument extends MongoDocument {
  titulo: string;
  descricao?: string;
  categoria: string;
  prioridade: "CRITICO" | "ALTO" | "MEDIO" | "BAIXO";
  vinculoModulo?: string;
  vinculoId?: string;
  extensao: string;
  tipo: string;
  tamanho: number;
  tamanhoFormatado: string;
  dataUpload: string;
  usuario: string;
  nomeOriginal: string;
  mimeType: string;
  arquivo: string; // Base64
  favorito: boolean;
  status: "ATIVO" | "ARQUIVADO";
}

const DocumentSchema = new Schema<IDocument>(
  {
    titulo: { type: String, required: true, trim: true },
    descricao: { type: String, trim: true },
    categoria: { type: String, default: "Outros" },
    prioridade: { type: String, default: "MEDIO" },
    vinculoModulo: { type: String, trim: true },
    vinculoId: { type: String, trim: true },
    extensao: { type: String, required: true },
    tipo: { type: String, required: true },
    tamanho: { type: Number, required: true },
    tamanhoFormatado: { type: String, required: true },
    dataUpload: { type: String, required: true },
    usuario: { type: String, required: true },
    nomeOriginal: { type: String, required: true },
    mimeType: { type: String, required: true },
    arquivo: { type: String, required: true }, // Suporta strings grandes (Base64)
    favorito: { type: Boolean, default: false },
    status: { type: String, default: "ATIVO" }
  },
  { timestamps: true }
);

export const AppDocument = model<IDocument>("Document", DocumentSchema);