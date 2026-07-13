import { Schema, model, Document } from "mongoose";

export interface IFarm extends Document {
  name: string;
  owner?: string;
  city?: string;
  state?: string;
  totalAreaHa: number;
  status: string;
}

const FarmSchema = new Schema<IFarm>(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    totalAreaHa: { type: Number, default: 0 },
    status: { type: String, default: "active" }
  },
  { timestamps: true }
);

export const Farm = model<IFarm>("Farm", FarmSchema);