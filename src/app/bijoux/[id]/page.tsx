import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Bijou } from '../../../../models/Bijou';
import { connectDatabase } from '../../../../server/db';
import ProductActions from './ProductActions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '../../components/ui/utils';

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            
            {/* Section Image (Gauche) */}
            <div className="relative aspect-[4/5] bg-[#f9f5f0] overflow-hidden group">
              <ImageWithFallback
                src={bijou.imagePrincipale}
                alt={bijou.nom}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Optional: CldImage usage would look like this:
              <CldImage
                src={bijou.imagePrincipale}
                alt={bijou.nom}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                crop="fill"
              />
              */}
              
              {bijou.stock === 0 && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-[#2F3C67] text-white px-8 py-3 text-[10px] tracking-[0.4em] uppercase">
                    Épuisé
                  </span>
                </div>
              )}
            </div>

            {/* Section Infos (Droite) */}
            <div className="flex flex-col">
              <div className="flex flex-col gap-2 mb-6">
                <span className="text-[#853D28] text-[11px] tracking-[0.5em] uppercase font-medium">
                  {bijou.categorie}
                </span>
                <h1 className="text-[36px] md:text-[48px] text-[#2F3C67] font-serif leading-tight tracking-wide">
                  {bijou.nom}
                </h1>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-[24px] text-[#2F3C67] font-light">
                  {formatPrice(bijou.prix)}
                </span>
                <div className="h-4 w-[1px] bg-[#DDC2A7]" />
                <span className="text-[#2F3C67] text-[11px] tracking-[0.2em] uppercase opacity-60">
                  {bijou.materiau}
                </span>
              </div>

              {/* Court descriptif technique */}
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center py-4 border-y border-[#f0f0f0]">
                  <span className="text-[10px] tracking-[0.2em] text-[#2F3C67] uppercase opacity-60">Métaux & Pierres</span>
                  <span className="text-[12px] text-[#2F3C67] font-medium">{bijou.materiau}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-[#f0f0f0]">
                  <span className="text-[10px] tracking-[0.2em] text-[#2F3C67] uppercase opacity-60">Disponibilité</span>
                  <span className={`text-[12px] font-medium ${bijou.stock > 0 ? 'text-[#2F3C67]' : 'text-red-500'}`}>
                    {bijou.stock > 0 ? `En stock (${bijou.stock} unités)` : 'Rupture de stock'}
                  </span>
                </div>
              </div>

              {/* Actions (Client Component) */}
              <ProductActions 
                bijouId={bijou._id.toString()} 
                stock={bijou.stock} 
                nom={bijou.nom} 
              />

              {/* Trust badges ou infos complémentaires */}
              <div className="mt-12 grid grid-cols-2 gap-6 pt-12 border-t border-[#f0f0f0]">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] tracking-[0.3em] text-[#853D28] uppercase">Livraison</span>
                  <p className="text-[11px] text-[#2F3C67] opacity-70">Offerte partout au Maroc sous 48h.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] tracking-[0.3em] text-[#853D28] uppercase">Écrin de luxe</span>
                  <p className="text-[11px] text-[#2F3C67] opacity-70">Chaque bijou est livré dans son écrin Mezor.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section Histoire & Détails (Storytelling) */}
          <section className="mt-32 pt-24 border-t border-[#DDC2A7]/30">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-[#853D28] text-[10px] tracking-[0.6em] uppercase mb-8 block">
                L&apos;Histoire de la Pièce
              </span>
              <h2 className="text-[32px] md:text-[42px] text-[#2F3C67] font-serif mb-12 leading-snug">
                Un chef-d&apos;œuvre d&apos;artisanat et d&apos;élégance intemporelle
              </h2>
              <div className="w-12 h-[1px] bg-[#853D28] mx-auto mb-12" />
              <div className="text-[15px] md:text-[17px] text-[#2F3C67] leading-[2] text-justify md:text-center opacity-80 font-light italic">
                {bijou.description.split('\n').map((para, i) => (
                  <p key={i} className="mb-6 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </section>
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
