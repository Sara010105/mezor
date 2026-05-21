import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Bijou } from '../../../../models/Bijou';
import { connectDatabase } from '../../../../server/db';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductDetailsClient from './ProductDetailsClient';

// Note: If you have next-cloudinary installed, use CldImage instead of Image
// import { CldImage } from 'next-cloudinary';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  await connectDatabase();
  const bijou = await Bijou.findById(id);
  
  if (!bijou) return { title: 'Produit non trouvé | Mezor' };
  
  return {
    title: `${bijou.nom} | Mezor Jewels`,
    description: bijou.description.substring(0, 160),
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  
  try {
    await connectDatabase();
    const bijou = await Bijou.findById(id);

    if (!bijou) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-white">
        {/* Navigation / Back Button */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 pt-32 pb-8">
          <Link 
            href="/#collection" 
            className="group flex items-center gap-2 text-[#2F3C67] text-[10px] tracking-[0.3em] uppercase hover:text-[#853D28] transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Retour à la collection
          </Link>
        </div>

        <main className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 pb-24">
          <ProductDetailsClient bijou={JSON.parse(JSON.stringify(bijou))} />
        </main>

        {/* Footer placeholder (should probably be a shared component) */}
        <div className="bg-[#2F3C67] py-16 mt-20">
          <div className="max-w-[1400px] mx-auto px-6 text-center">
             <p className="text-[#DDC2A7] text-[10px] tracking-[0.5em] uppercase opacity-50">Mezor Jewels - L&apos;Excellence à l&apos;état pur</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}
