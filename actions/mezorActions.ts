"use server";

import { connectDatabase } from '../server/db';
import { Bijou } from '../models/Bijou';
import { Panier } from '../models/Panier';
import { Commande } from '../models/Commande';
import { EssaiVirtuel } from '../models/EssaiVirtuel';
import { ContactMessage } from '../models/ContactMessage';
import { Utilisateur } from '../models/Utilisateur';
import mongoose from 'mongoose';
import cloudinary from '../lib/cloudinary';
import { revalidatePath } from 'next/cache';
import dotenv from 'dotenv';
import path from 'path';

// Force le chargement de .env.local au plus tôt pour les Server Actions
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

/**
 * Adds a jewelry item to a user's cart.
 */
export async function addToCart(utilisateurId: string, bijouId: string, quantite: number = 1) {
  try {
    await connectDatabase();
    
    let panier = await Panier.findOne({ utilisateurId });
    
    if (!panier) {
      panier = new Panier({
        utilisateurId,
        articles: [{ bijouId, quantite }],
        sousTotal: 0,
      });
    } else {
      const articleExistante = panier.articles.find(a => a.bijouId.toString() === bijouId);
      
      if (articleExistante) {
        articleExistante.quantite += quantite;
      } else {
        panier.articles.push({ bijouId: new mongoose.Types.ObjectId(bijouId) as any, quantite });
      }
    }
    
    // Calculate sousTotal
    const bijouxIds = panier.articles.map(a => a.bijouId);
    const detailsBijoux = await Bijou.find({ _id: { $in: bijouxIds } });
    
    panier.sousTotal = panier.articles.reduce((total, article) => {
      const bijou = detailsBijoux.find(b => b._id.toString() === article.bijouId.toString());
      return total + (bijou ? bijou.prix * article.quantite : 0);
    }, 0);
    
    panier.misAJourLe = new Date();
    await panier.save();
    
    return { success: true, panier };
  } catch (error: any) {
    console.error('Error in addToCart:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Critical Logic for Checkout (Non-Transactional for local dev support)
 * Modified to support standalone MongoDB without Replica Set
 */
export async function processCheckout(utilisateurId: string, adresseLivraison: any, articles?: any[]) {
  try {
    await connectDatabase();
    
    let articlesToProcess = [];
    
    if (articles && articles.length > 0) {
      articlesToProcess = articles;
    } else {
      const panier = await Panier.findOne({ utilisateurId });
      if (!panier || panier.articles.length === 0) {
        throw new Error('Panier vide');
      }
      articlesToProcess = panier.articles;
    }
    
    const articlesCommande = [];
    let montantTotal = 0;
    
    // 1. Rigorous Stock Validation Before Order Creation
    for (const article of articlesToProcess) {
      const bijouId = article.bijouId || article.product?._id;
      const quantite = article.quantite || article.quantity;
      
      if (!bijouId) continue;

      const bijou = await Bijou.findById(bijouId);
      
      if (!bijou) throw new Error(`Bijou non trouvé: ${bijouId}`);
      if (bijou.stock < quantite) {
        throw new Error(`Stock insuffisant pour ${bijou.nom} (Disponible: ${bijou.stock})`);
      }
      
      articlesCommande.push({
        bijouId: bijou._id,
        quantite: quantite,
        prixAuMomentAchat: bijou.prix
      });
      
      montantTotal += bijou.prix * quantite;
    }
    
    if (articlesCommande.length === 0) throw new Error('Aucun article valide');

    // 2. Create the Order
    const nouvelleCommande = new Commande({
      utilisateurId: (utilisateurId === 'guest_user' || !mongoose.Types.ObjectId.isValid(utilisateurId)) 
        ? new mongoose.Types.ObjectId() 
        : new mongoose.Types.ObjectId(utilisateurId),
      montantTotal,
      statut: 'en attente',
      adresseLivraison,
      articles: articlesCommande,
    });
    
    await nouvelleCommande.save();
    
    // 3. Update Stocks Sequentially
    for (const item of articlesCommande) {
      await Bijou.findByIdAndUpdate(
        item.bijouId,
        { $inc: { stock: -item.quantite } }
      );
    }
    
    // 4. Cleanup Cart
    if (utilisateurId !== 'guest_user') {
      await Panier.findOneAndUpdate({ utilisateurId }, { articles: [], sousTotal: 0 });
    }
    
    return { success: true, commandeId: nouvelleCommande._id.toString() };
    
  } catch (error: any) {
    console.error('Error in processCheckout:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Record a virtual try-on session
 */
export async function logVirtualTryOn(utilisateurId: string, bijouId: string, photoUtilisateurUrl: string) {
  try {
    await connectDatabase();
    
    const nouvelEssai = new EssaiVirtuel({
      utilisateurId,
      bijouId,
      photoUtilisateurUrl,
    });
    
    await nouvelEssai.save();
    return { success: true };
  } catch (error: any) {
    console.error('Error in logVirtualTryOn:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Save customer inquiry
 */
export async function submitContactForm(formData: { name: string, email: string, message: string }) {
  try {
    await connectDatabase();
    
    const nouveauMessage = new ContactMessage(formData);
    await nouveauMessage.save();
    
    return { success: true };
  } catch (error: any) {
    console.error('Error in submitContactForm:', error);
    return { success: false, error: error.message };
  }
}
/**
 * Uploads a file to Cloudinary from a Buffer
 */
async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  console.log(`[Cloudinary] Starting upload to folder: ${folder}...`);
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error(`[Cloudinary] Upload failed for ${folder}:`, error);
            return reject(error);
          }
          console.log(`[Cloudinary] Upload successful: ${result?.secure_url}`);
          resolve(result!.secure_url);
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error(`[Cloudinary] Error processing file for ${folder}:`, error);
    throw error;
  }
}

/**
 * Adds a new jewelry item with Cloudinary image uploads
 */
export async function ajouterBijou(formData: FormData) {
  console.log('[Server Action] ajouterBijou triggered');
  
  // Debug Avancé des variables d'environnement
  const debugEnv = (name: string) => {
    const value = process.env[name];
    const status = value === undefined ? 'UNDEFINED' : value === '' ? 'EMPTY STRING' : `FOUND (length: ${value.length})`;
    console.log(`[Env Debug] ${name}: ${status}`);
    return value;
  };

  const url = debugEnv('CLOUDINARY_URL');
  const key = debugEnv('CLOUDINARY_API_KEY');
  const name = debugEnv('CLOUDINARY_CLOUD_NAME');
  const secret = debugEnv('CLOUDINARY_API_SECRET');

  if (!url && (!key || !name || !secret)) {
    console.error('[Server Action] Erreur: Configuration Cloudinary incomplète.');
    return { 
      success: false, 
      error: "Le fichier .env.local n'est pas détecté ou est mal configuré (injected env 0). Assurez-vous qu'il est à la racine du projet et contient les clés nécessaires." 
    };
  }

  try {
    await connectDatabase();
    console.log('[Server Action] Database connected');

    const nom = formData.get('nom') as string;
    const description = formData.get('description') as string;
    const prix = parseFloat(formData.get('prix') as string);
    const categorie = formData.get('categorie') as string;
    const materiau = formData.get('materiau') as string;
    const stock = parseInt(formData.get('stock') as string);
    const misEnAvant = formData.get('misEnAvant') === 'true';

    console.log('[Server Action] Payload extracted:', { nom, prix, categorie });

    const imagePrincipaleFile = formData.get('imagePrincipale') as File;
    const imageTransparenteFile = formData.get('imageTransparente') as File;

    if (!imagePrincipaleFile || imagePrincipaleFile.size === 0) {
      throw new Error('Image principale manquante ou vide.');
    }
    if (!imageTransparenteFile || imageTransparenteFile.size === 0) {
      throw new Error('Image transparente manquante ou vide.');
    }

    console.log('[Server Action] Files verified, starting Cloudinary uploads...');

    // 1. Upload images to Cloudinary FIRST
    const [imagePrincipaleUrl, imageTransparenteUrl] = await Promise.all([
      uploadToCloudinary(imagePrincipaleFile, 'mezor/bijoux/principale'),
      uploadToCloudinary(imageTransparenteFile, 'mezor/bijoux/transparente'),
    ]);

    console.log('[Server Action] Cloudinary uploads finished, saving to MongoDB...');

    // 2. Synchronize with MongoDB
    const nouveauBijou = await Bijou.create({
      nom,
      description,
      prix,
      categorie,
      materiau,
      stock,
      misEnAvant,
      imagePrincipale: imagePrincipaleUrl,
      imageTransparente: imageTransparenteUrl,
      creeLe: new Date(),
    });

    console.log('[Server Action] Successfully saved to MongoDB:', nouveauBijou._id);

    revalidatePath('/mezorAdminDash');
    return { success: true, bijouId: nouveauBijou._id.toString() };

  } catch (error: any) {
    console.error('[Server Action] Error in ajouterBijou:', error);
    return { success: false, error: error.message || 'Une erreur est survenue lors de l\'ajout du bijou.' };
  }
}

/**
 * Toggles a jewelry item in a user's favorites list.
 */
export async function toggleFavorite(utilisateurId: string, bijouId: string) {
  try {
    await connectDatabase();
    
    const utilisateur = await Utilisateur.findById(utilisateurId);
    if (!utilisateur) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }
    
    const bijouObjectId = new mongoose.Types.ObjectId(bijouId);
    const index = utilisateur.favoris.findIndex(id => id.toString() === bijouId);
    
    if (index === -1) {
      utilisateur.favoris.push(bijouObjectId as any);
    } else {
      utilisateur.favoris.splice(index, 1);
    }
    
    await utilisateur.save();
    revalidatePath('/favoris');
    revalidatePath('/');
    return { success: true, isFavorite: index === -1 };
  } catch (error: any) {
    console.error('Error in toggleFavorite:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all favorite jewelry for a user
 */
export async function getFavorites(utilisateurId: string) {
  try {
    await connectDatabase();
    const utilisateur = await Utilisateur.findById(utilisateurId).populate('favoris');
    if (!utilisateur) return { success: false, error: 'Utilisateur non trouvé' };
    return { success: true, favoris: utilisateur.favoris };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
