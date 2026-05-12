import { Metadata } from 'next';
import { connectDatabase } from '../../../server/db';
import { Utilisateur } from '../../../models/Utilisateur';
import { Bijou } from '../../../models/Bijou';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, cn } from '../components/ui/utils';
import FavoriteButton from '../components/FavoriteButton';
import { ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mes Favoris | Mezor Haute Joaillerie',
  description: 'Retrouvez vos pièces préférées de notre collection de haute joaillerie.',
};

export default async function FavorisPage() {
  await connectDatabase();
  
  // Simulation de l'utilisateur actuel (premier client trouvé en DB)
  const user = await Utilisateur.findOne({ role: 'client' }).populate('favoris');
  
  if (!user) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-[#F9F5F0]">
        <h1 className="text-[32px] font-serif text-[#2F3C67] mb-4">Veuillez vous connecter</h1>
        <p className="text-[#2F3C67] opacity-60">Pour voir vos favoris, vous devez être authentifié.</p>
      </div>
    );
  }

  const favorites = (user.favoris as any[]) || [];

  return (
    <div className="min-h-screen bg-[#F9F5F0] pt-40 pb-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center text-center mb-24">
          <span className="text-[#853D28] text-[11px] tracking-[0.6em] uppercase mb-5 font-medium">Ma Sélection Personnelle</span>
          <h1 className="text-[48px] md:text-[64px] text-[#2F3C67] font-serif tracking-tight leading-none mb-8">
            Votre Boîte à Bijoux
          </h1>
          <div className="w-16 h-[1px] bg-[#853D28] opacity-30" />
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-[1px] bg-[#DDC2A7] mb-12" />
            <p className="text-[#2F3C67] text-[18px] font-serif italic opacity-60 mb-10">
              &quot;Votre boîte à bijoux est vide pour le moment...&quot;
            </p>
            <Link 
              href="/#collection"
              className="group relative overflow-hidden bg-[#2F3C67] text-white px-12 py-5 text-[11px] tracking-[0.4em] uppercase transition-all hover:bg-[#1a233d]"
            >
              <span className="relative z-10">Retourner à la boutique</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {favorites.map((bijou, index) => (
              <div 
                key={bijou._id} 
                className={cn(
                  "group relative flex flex-col bg-white p-6 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2",
                  index % 3 === 1 ? "md:mt-12" : "" // Effet décalé pour style Bento/Galerie
                )}
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-[#F9F5F0] mb-8">
                  <Link href={`/bijoux/${bijou._id}`}>
                    <Image
                      src={bijou.imagePrincipale}
                      alt={bijou.nom}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </Link>
                  
                  {/* Bouton de retrait rapide */}
                  <div className="absolute top-6 right-6 z-10">
                    <FavoriteButton 
                      bijouId={bijou._id.toString()} 
                      initialIsFavorite={true} 
                      utilisateurId={user._id.toString()} 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                      <span className="text-[#853D28] text-[9px] tracking-[0.4em] uppercase font-medium">
                        {bijou.categorie}
                      </span>
                      <h3 className="text-[#2F3C67] text-[18px] font-serif tracking-wide uppercase">
                        {bijou.nom}
                      </h3>
                    </div>
                    <span className="text-[#2F3C67] text-[16px] font-light">
                      {formatPrice(bijou.prix)}
                    </span>
                  </div>
                  
                  <div className="w-full h-[1px] bg-[#F0F0F0] my-2" />
                  
                  <Link 
                    href={`/bijoux/${bijou._id}`}
                    className="text-[10px] tracking-[0.3em] text-[#2F3C67] opacity-60 hover:opacity-100 transition-opacity uppercase"
                  >
                    Voir la pièce →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer Décoratif */}
      <div className="max-w-[1400px] mx-auto mt-40 pt-20 border-t border-[#DDC2A7]/30 text-center">
        <p className="text-[#2F3C67] text-[10px] tracking-[0.5em] opacity-40 uppercase">
          Mezor Jewels — L&apos;excellence à l&apos;état pur
        </p>
      </div>
    </div>
  );
}
