import 'dotenv/config';
import { Jewelry } from './models/Jewelry';
import { connectDatabase } from './server/db';

async function seed() {
  await connectDatabase();

  await Jewelry.deleteMany({});
  await Jewelry.insertMany([
    {
      name: 'Bague Celeste',
      price: 2450,
      description: 'Bague en or blanc sertie d un diamant central taille brillant.',
      category: 'rings',
      mainImage:
        'https://images.unsplash.com/photo-1748023593753-4949fdc19045?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      transparentImage:
        'https://res.cloudinary.com/dbjfbmvmt/image/upload/v1746558600/mezor/transparent/ring.png',
    },
    {
      name: 'Collier Heritage',
      price: 3200,
      description: 'Collier raffine en or jaune inspire des ateliers traditionnels.',
      category: 'necklaces',
      mainImage:
        'https://images.unsplash.com/photo-1762505464446-c0760d740aee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      transparentImage:
        'https://res.cloudinary.com/dbjfbmvmt/image/upload/v1746558600/mezor/transparent/necklace.png',
    },
    {
      name: 'Boucles Radiance',
      price: 1890,
      description: 'Boucles d oreilles elegantes en perles fines et or rose.',
      category: 'earrings',
      mainImage:
        'https://images.unsplash.com/photo-1704957205327-9fbd44d683b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      transparentImage:
        'https://res.cloudinary.com/dbjfbmvmt/image/upload/v1746558600/mezor/transparent/earrings.png',
    },
  ]);

  // eslint-disable-next-line no-console
  console.log('Seed completed: 3 jewelries inserted.');
  process.exit(0);
}

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seed failed:', error);
  process.exit(1);
});
