import { Schema, model, Document } from "mongoose";

export interface ISetting extends Document {
  empresa: any;
  aparencia: any;
  seguranca: any;
  notificacoes: any;
  modulos: any;
  backup: any;
  historico: any[];
}

const SettingSchema = new Schema<ISetting>(
  {
    empresa: { type: Schema.Types.Mixed, default: {} },
    aparencia: { type: Schema.Types.Mixed, default: {} },
    seguranca: { type: Schema.Types.Mixed, default: {} },
    notificacoes: { type: Schema.Types.Mixed, default: {} },
    modulos: { type: Schema.Types.Mixed, default: {} },
    backup: { type: Schema.Types.Mixed, default: {} },
    historico: { type: [Object], default: [] }
  },
  { timestamps: true }
);

export const Setting = model<ISetting>("Setting", SettingSchema);