import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPanier extends Document {
  utilisateurId: mongoose.Types.ObjectId;
  articles: {
    bijouId: mongoose.Types.ObjectId;
    quantite: number;
  }[];
  sousTotal: number;
  misAJourLe: Date;
}

const PanierSchema: Schema = new Schema({
  utilisateurId: { type: Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  articles: [{
    bijouId: { type: Schema.Types.ObjectId, ref: 'Bijou', required: true },
    quantite: { type: Number, required: true, min: 1 }
  }],
  sousTotal: { type: Number, default: 0 },
  misAJourLe: { type: Date, default: Date.now }
}, { collection: 'paniers' });

export const Panier: Model<IPanier> = 
  mongoose.models.Panier || mongoose.model<IPanier>('Panier', PanierSchema);
