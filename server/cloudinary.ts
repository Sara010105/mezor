import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Force load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudinaryUrl = process.env.CLOUDINARY_URL;

console.log('[Server Cloudinary Config] Check:');
console.log(' - CLOUDINARY_CLOUD_NAME:', cloudName ? '✅ FOUND' : '❌ MISSING');
console.log(' - CLOUDINARY_API_KEY:', apiKey ? '✅ FOUND' : '❌ MISSING');

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
  console.error('[Server Cloudinary Config] FATAL: Missing Cloudinary Credentials. Fallback removed.');
}

export { cloudinary };
