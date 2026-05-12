import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEssaiVirtuel extends Document {
  utilisateurId: mongoose.Types.ObjectId;
  bijouId: mongoose.Types.ObjectId;
  photoUtilisateurUrl: string;
  dateEssai: Date;
}

const EssaiVirtuelSchema: Schema = new Schema({
  utilisateurId: { type: Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  bijouId: { type: Schema.Types.ObjectId, ref: 'Bijou', required: true },
  photoUtilisateurUrl: { type: String, required: true },
  dateEssai: { type: Date, default: Date.now },
}, { collection: 'essais_virtuels' });

export const EssaiVirtuel: Model<IEssaiVirtuel> = 
  mongoose.models.EssaiVirtuel || mongoose.model<IEssaiVirtuel>('EssaiVirtuel', EssaiVirtuelSchema);
