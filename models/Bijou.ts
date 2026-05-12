import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBijou extends Document {
  nom: string;
  description: string;
  prix: number;
  categorie: string;
  materiau: string;
  imagePrincipale: string;
  imageTransparente?: string;
  stock: number;
  misEnAvant: boolean;
  creeLe: Date;
}

const BijouSchema: Schema = new Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  prix: { type: Number, required: true },
  categorie: { type: String, required: true },
  materiau: { type: String, required: true },
  imagePrincipale: { type: String, required: true },
  imageTransparente: { type: String },
  stock: { type: Number, required: true, default: 0 },
  misEnAvant: { type: Boolean, default: false },
  creeLe: { type: Date, default: Date.now },
}, { collection: 'bijoux' });

export const Bijou: Model<IBijou> = 
  mongoose.models.Bijou || mongoose.model<IBijou>('Bijou', BijouSchema);
