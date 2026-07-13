import { Schema, model, Document } from "mongoose";

export interface IField extends Document {
  farmId: Schema.Types.ObjectId;
  name: string;
  crop: string;
  areaHa: number;
  geojson?: Record<string, any>;
  active: boolean;
}

const FieldSchema = new Schema<IField>(
  {
    farmId: { type: Schema.Types.ObjectId, ref: "Farm", required: true },
    name: { type: String, required: true, trim: true },
    crop: { type: String, default: "Arroz", trim: true },
    areaHa: { type: Number, default: 0, min: 0 },
    geojson: { type: Schema.Types.Mixed }, // Permite salvar polígonos do mapa (JSONB original)
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Field = model<IField>("Field", FieldSchema);