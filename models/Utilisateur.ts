import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUtilisateur extends Document {
  nomUtilisateur: string;
  email: string;
  motDePasse: string;
  role: 'admin' | 'client';
  favoris: mongoose.Types.ObjectId[];
  creeLe: Date;
}

const UtilisateurSchema: Schema = new Schema({
  nomUtilisateur: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  favoris: [{ type: Schema.Types.ObjectId, ref: 'Bijou' }],
  creeLe: { type: Date, default: Date.now },
}, { collection: 'utilisateurs' });

export const Utilisateur: Model<IUtilisateur> = 
  mongoose.models.Utilisateur || mongoose.model<IUtilisateur>('Utilisateur', UtilisateurSchema);
