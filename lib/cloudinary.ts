import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Force load .env.local aggressively from root
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Debug logs
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudinaryUrl = process.env.CLOUDINARY_URL;

console.log('[Cloudinary Config] Diagnosis:');
console.log(' - CLOUDINARY_CLOUD_NAME:', cloudName ? '✅ FOUND' : '❌ MISSING');
console.log(' - CLOUDINARY_API_KEY:', apiKey ? '✅ FOUND' : '❌ MISSING');
console.log(' - CLOUDINARY_URL:', cloudinaryUrl ? '✅ FOUND' : '❌ MISSING');

if (cloudinaryUrl) {
  cloudinary.config({
    cloudinary_url: cloudinaryUrl,
    secure: true
  });
} else if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
} else {
  // REMOVED FALLBACK - Throwing explicit error instead
  const errorMsg = '[Cloudinary Config] FATAL: Aucune variable d\'environnement Cloudinary n\'a été détectée. Le fichier .env.local est probablement manquant ou vide à la racine.';
  console.error(errorMsg);
  // We don't throw here to avoid crashing the build process, 
  // but we will throw during the actual upload action.
}

export default cloudinary;
