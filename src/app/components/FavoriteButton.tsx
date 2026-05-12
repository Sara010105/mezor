"use client";

import { useState, useOptimistic, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toggleFavorite } from '../../../actions/mezorActions';
import { toast } from 'sonner';
import { cn } from './ui/utils';

interface FavoriteButtonProps {
  bijouId: string;
  initialIsFavorite: boolean;
  utilisateurId: string;
}

export default function FavoriteButton({ 
  bijouId, 
  initialIsFavorite, 
  utilisateurId 
}: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  // Optimistic update
  const [optimisticFavorite, toggleOptimisticFavorite] = useOptimistic(
    isFavorite,
    (state) => !state
  );

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!utilisateurId) {
      toast.error("Veuillez vous connecter pour ajouter des favoris");
      return;
    }

    startTransition(async () => {
      // Apply optimistic update
      toggleOptimisticFavorite(null);
      
      try {
        const result = await toggleFavorite(utilisateurId, bijouId);
        if (result.success) {
          setIsFavorite(result.isFavorite!);
          toast.success(result.isFavorite ? "Ajouté aux favoris" : "Retiré des favoris");
        } else {
          toast.error("Une erreur est survenue");
        }
      } catch (error) {
        toast.error("Erreur réseau");
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "p-2 rounded-full transition-all duration-300 hover:scale-110",
        optimisticFavorite ? "text-[#853D28]" : "text-[#2F3C67] opacity-60 hover:opacity-100"
      )}
    >
      <Heart 
        size={20} 
        strokeWidth={1.5} 
        fill={optimisticFavorite ? "currentColor" : "none"} 
      />
    </button>
  );
}
