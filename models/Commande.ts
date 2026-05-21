import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICommande extends Document {
  utilisateurId: mongoose.Types.ObjectId;
  montantTotal: number;
  statut: 'en attente' | 'confirmée' | 'expédiée' | 'livrée' | 'annulée';
  adresseLivraison: {
    rue: string;
    ville: string;
    codePostal: string;
    pays: string;
  };
  articles: {
    bijouId: mongoose.Types.ObjectId;
    quantite: number;
    prixAuMomentAchat: number;
    finition: string;
  }[];
  creeLe: Date;
}

const CommandeSchema: Schema = new Schema({
  utilisateurId: { type: Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  montantTotal: { type: Number, required: true },
  statut: { 
    type: String, 
    enum: ['en attente', 'confirmée', 'expédiée', 'livrée', 'annulée'], 
    default: 'en attente' 
  },
  adresseLivraison: {
    rue: { type: String, required: true },
    ville: { type: String, required: true },
    codePostal: { type: String, required: true },
    pays: { type: String, required: true },
  },
  articles: [{
    bijouId: { type: Schema.Types.ObjectId, ref: 'Bijou', required: true },
    quantite: { type: Number, required: true },
    prixAuMomentAchat: { type: Number, required: true },
    finition: { type: String, required: true },
  }],
  creeLe: { type: Date, default: Date.now },
}, { collection: 'commandes' });

export const Commande: Model<ICommande> = 
  mongoose.models.Commande || mongoose.model<ICommande>('Commande', CommandeSchema);
