import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local first
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

import { Bijou } from './models/Bijou';
import { connectDatabase } from './server/db';

async function seed() {
  await connectDatabase();

  await Bijou.deleteMany({});
  await Bijou.insertMany([
    {
      nom: 'Bague Celeste',
      prix: 2450,
      description: 'Bague en or blanc sertie d un diamant central taille brillant.',
      categorie: 'bagues',
      materiau: 'Or Blanc 18K',
      imagesFinitions: {
        orJaune: 'https://images.unsplash.com/photo-1748023593753-4949fdc19045?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        orRose: 'https://images.unsplash.com/photo-1748023593753-4949fdc19045?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        argent: 'https://images.unsplash.com/photo-1748023593753-4949fdc19045?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      },
      imageTransparente:
        'https://res.cloudinary.com/dbjfbmvmt/image/upload/v1746558600/mezor/transparent/ring.png',
      stock: 10,
    },
    {
      nom: 'Collier Heritage',
      prix: 3200,
      description: 'Collier raffine en or jaune inspire des ateliers traditionnels.',
      categorie: 'colliers',
      materiau: 'Or Jaune 18K',
      imagesFinitions: {
        orJaune: 'https://images.unsplash.com/photo-1762505464446-c0760d740aee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        orRose: 'https://images.unsplash.com/photo-1762505464446-c0760d740aee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        argent: 'https://images.unsplash.com/photo-1762505464446-c0760d740aee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      },
      imageTransparente:
        'https://res.cloudinary.com/dbjfbmvmt/image/upload/v1746558600/mezor/transparent/necklace.png',
      stock: 5,
    },
    {
      nom: 'Boucles Radiance',
      prix: 1890,
      description: 'Boucles d oreilles elegantes en perles fines et or rose.',
      categorie: 'boucles',
      materiau: 'Or Rose 18K',
      imagesFinitions: {
        orJaune: 'https://images.unsplash.com/photo-1704957205327-9fbd44d683b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        orRose: 'https://images.unsplash.com/photo-1704957205327-9fbd44d683b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        argent: 'https://images.unsplash.com/photo-1704957205327-9fbd44d683b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      },
      imageTransparente:
        'https://res.cloudinary.com/dbjfbmvmt/image/upload/v1746558600/mezor/transparent/earrings.png',
      stock: 8,
    },
  ]);

  // eslint-disable-next-line no-console
  console.log('Seed completed: 3 pieces inserted into bijoux collection.');
  process.exit(0);
}

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seed failed:', error);
  process.exit(1);
});
