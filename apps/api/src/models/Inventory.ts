import { Schema, model, Document } from "mongoose";

export interface IInventory extends Document {
  nome: string;
  categoria: string;
  unidadeMedida: string;
  quantidade: number;
  minimo: number;
  preco: number;
  lote?: string;
  validade?: string;
  fornecedor?: string;
  local?: string;
  status: "DISPONÍVEL" | "BAIXO" | "ESGOTADO";
  observacoes?: string;
  imagemProduto?: string;
}

const InventorySchema = new Schema<IInventory>(
  {
    nome: { type: String, required: true, trim: true },
    categoria: { type: String, required: true, trim: true, default: "Geral" },
    unidadeMedida: { type: String, default: "Unidades" },
    quantidade: { type: Number, required: true, default: 0 },
    minimo: { type: Number, required: true, default: 0 },
    preco: { type: Number, default: 0 },
    lote: { type: String, trim: true },
    validade: { type: String },
    fornecedor: { type: String, trim: true },
    local: { type: String, trim: true, default: "Depósito Principal" },
    status: { type: String, default: "DISPONÍVEL" },
    observacoes: { type: String, trim: true },
    imagemProduto: { type: String }
  },
  { timestamps: true }
);

export const Inventory = model<IInventory>("Inventory", InventorySchema);