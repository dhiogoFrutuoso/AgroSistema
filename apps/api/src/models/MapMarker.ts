import { Schema, model, Document } from "mongoose";

export interface IMapMarker extends Document {
  farmId: Schema.Types.ObjectId;
  plotId: Schema.Types.ObjectId;
  name: string;
  latitude?: number;
  longitude?: number;
  type: string;
  status: string;
  notes?: string;
}

const MapMarkerSchema = new Schema<IMapMarker>(
  {
    farmId: { type: Schema.Types.ObjectId, ref: "Farm", required: true },
    plotId: { type: Schema.Types.ObjectId, ref: "Field", required: true },
    name: { type: String, required: true, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    type: { type: String, default: "talhao", trim: true },
    status: { type: String, default: "active", trim: true },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

export const MapMarker = model<IMapMarker>("MapMarker", MapMarkerSchema);