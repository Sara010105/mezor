"use client";

import { useState } from 'react';
import { ShoppingBag, Sparkles, Minus, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { addToCart } from '../../../../actions/mezorActions';
import { useRouter } from 'next/navigation';

interface ProductActionsProps {
  bijouId: string;
  stock: number;
  nom: string;
  selectedFinish: string;
}

export default function ProductActions({ bijouId, stock, nom, selectedFinish }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      // Assuming a guest user or some mechanism to identify the user
      // For now, using a placeholder for utilisateurId if not handled by auth
      const result = await addToCart("guest_user", bijouId, quantity, selectedFinish);
      if (result.success) {
        toast.success(`${nom} ajouté au panier`);
      } else {
        toast.error("Erreur lors de l'ajout au panier");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleVirtualTryOn = () => {
    // Redirect to AR page or open modal
    // For now, redirecting to a placeholder AR route
    router.push(`/essai-virtuel/${bijouId}`);
  };

  return (
    <div className="flex flex-col gap-8 mt-10">
      {/* Quantité */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] tracking-[0.3em] text-[#2F3C67] uppercase opacity-60">Quantité</span>
        <div className="flex items-center gap-6 border border-[#DDC2A7] w-fit px-4 py-2">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="text-[#2F3C67] hover:text-[#853D28] transition-colors"
          >
            <Minus size={16} strokeWidth={1} />
          </button>
          <span className="text-[14px] font-medium w-8 text-center text-[#2F3C67]">{quantity}</span>
          <button 
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            className="text-[#2F3C67] hover:text-[#853D28] transition-colors"
          >
            <Plus size={16} strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleAddToCart}
          disabled={loading || stock === 0}
          className="flex-1 bg-[#853D28] hover:bg-[#6d3220] text-white rounded-none py-7 text-[11px] tracking-[0.3em] uppercase transition-all"
        >
          <ShoppingBag className="mr-3" size={18} strokeWidth={1.2} />
          {loading ? "Chargement..." : "Ajouter au Panier"}
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleVirtualTryOn}
          className="flex-1 border-[#2F3C67] text-[#2F3C67] hover:bg-[#2F3C67] hover:text-white rounded-none py-7 text-[11px] tracking-[0.3em] uppercase transition-all"
        >
          <Sparkles className="mr-3" size={18} strokeWidth={1.2} />
          Essai Virtuel
        </Button>
      </div>

      {stock <= 5 && stock > 0 && (
        <p className="text-[#853D28] text-[11px] tracking-widest uppercase italic">
          Plus que {stock} articles en stock
        </p>
      )}
      {stock === 0 && (
        <p className="text-[#853D28] text-[11px] tracking-widest uppercase italic font-bold">
          Rupture de stock
        </p>
      )}
    </div>
  );
}
