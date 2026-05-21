"use client";

import { useState } from 'react';
import { formatPrice } from '../../components/ui/utils';
import ProductActions from './ProductActions';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

interface ProductDetailsClientProps {
  bijou: {
    _id: string;
    nom: string;
    categorie: string;
    prix: number;
    materiau: string;
    stock: number;
    description: string;
    imagesFinitions: {
      orJaune: string;
      orRose: string;
      argent: string;
    };
    videos?: string[];
  };
}

export default function ProductDetailsClient({ bijou }: ProductDetailsClientProps) {
  const [selectedFinish, setSelectedFinish] = useState('18k Gold Vermeil');

  const finishes = [
    { id: '18k Gold Vermeil', name: '18k Gold Vermeil', colorClass: 'bg-[#EEDCA5]' },
    { id: '18k Rose Gold Vermeil', name: '18k Rose Gold Vermeil', colorClass: 'bg-[#E8C5C8]' },
    { id: 'S925 Rhodium Vermeil', name: 'S925 Rhodium Vermeil', colorClass: 'bg-[#E2E8F0]' }
  ];

  const getCurrentImage = () => {
    switch (selectedFinish) {
      case '18k Rose Gold Vermeil':
        return bijou.imagesFinitions?.orRose;
      case 'S925 Rhodium Vermeil':
        return bijou.imagesFinitions?.argent;
      case '18k Gold Vermeil':
      default:
        return bijou.imagesFinitions?.orJaune;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        
        {/* Section Image (Gauche) */}
        <div className="relative aspect-[4/5] bg-[#f9f5f0] overflow-hidden group">
          <ImageWithFallback
            src={getCurrentImage() || ''}
            alt={`${bijou.nom} - ${selectedFinish}`}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          
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

          {/* Sélecteur de Finition */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] tracking-[0.2em] text-[#2F3C67] uppercase opacity-60">Finition</span>
              <span className="text-[11px] text-[#2F3C67] font-medium tracking-wide">
                {finishes.find(f => f.id === selectedFinish)?.name}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {finishes.map((finish) => (
                <button
                  key={finish.id}
                  onClick={() => setSelectedFinish(finish.id)}
                  className={`w-8 h-8 rounded-full ${finish.colorClass} transition-all duration-300 relative ${
                    selectedFinish === finish.id ? 'ring-1 ring-[#C4A77D] ring-offset-2' : 'border border-black/5 hover:scale-105'
                  }`}
                  aria-label={finish.name}
                  title={finish.name}
                />
              ))}
            </div>
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
            selectedFinish={selectedFinish}
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

      {/* Section Vidéos */}
      {bijou.videos && bijou.videos.length > 0 && (
        <section className="mt-32 pt-24 border-t border-[#DDC2A7]/30">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <span className="text-[#853D28] text-[10px] tracking-[0.6em] uppercase mb-6 block">
              Savoir-Faire
            </span>
            <h2 className="text-[28px] md:text-[36px] text-[#2F3C67] font-serif leading-snug">
              Le bijou en mouvement
            </h2>
          </div>
          <div className={`grid grid-cols-1 ${bijou.videos.length > 1 ? 'md:grid-cols-2' : ''} gap-12`}>
            {bijou.videos.map((vidUrl, index) => (
              <div key={index} className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-[#FDFCFB] border border-[#E5E5E5]">
                <video 
                  controls 
                  src={vidUrl} 
                  className="w-full h-full object-cover" 
                  autoPlay={index === 0} 
                  muted 
                  loop
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
