import { Schema, model, Document } from "mongoose";

export interface IPlot extends Document {
  nome: string;
  [key: string]: any;
}

const PlotSchema = new Schema<IPlot>(
  {
    nome: { type: String, required: true, trim: true }
  },
  { strict: false, timestamps: true }
);

export const Plot = model<IPlot>("Plot", PlotSchema);