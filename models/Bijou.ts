import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBijou extends Document {
  nom: string;
  description: string;
  prix: number;
  categorie: string;
  materiau: string;
  imagesFinitions: {
    orJaune: string;
    orRose: string;
    argent: string;
  };
  videos?: string[];
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
  imagesFinitions: {
    orJaune: { type: String, required: true },
    orRose: { type: String, required: true },
    argent: { type: String, required: true }
  },
  videos: [{ type: String }],
  imageTransparente: { type: String },
  stock: { type: Number, required: true, default: 0 },
  misEnAvant: { type: Boolean, default: false },
  creeLe: { type: Date, default: Date.now },
}, { collection: 'bijoux' });

export const Bijou: Model<IBijou> = 
  mongoose.models.Bijou || mongoose.model<IBijou>('Bijou', BijouSchema);
