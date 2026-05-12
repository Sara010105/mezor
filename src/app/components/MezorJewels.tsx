"use client";

import { useEffect, useRef, useState } from 'react';
import { ShoppingBag, Upload, X, Search, Heart, Plus, Minus, Trash2, Check, Instagram, Facebook, Twitter, CreditCard, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ImageWithFallback } from './figma/ImageWithFallback';
import brandImage from '../../imports/WhatsApp_Image_2026-05-04_at_23.19.38.jpeg';
import { 
  useCart, 
  useFavorites, 
  addToCart, 
  removeFromCart, 
  updateCartQty, 
  toggleFavorite,
  type JewelryProduct
} from '../hooks/useStore';
import { processCheckout } from '../../../actions/mezorActions';
import { toast } from 'sonner';
import { formatPrice } from './ui/utils';
import FavoriteButton from './FavoriteButton';

/* ─── Logo ──────────────────────────────────────────────────── */
function MezorLogo({ beige = true, large = false }: { beige?: boolean; large?: boolean }) {
  const col = beige ? '#DDC2A7' : '#853D28';
  const letterClass = large
    ? 'text-[56px] font-serif'
    : 'text-[22px] font-serif';
  const subClass = large ? 'text-[13px] tracking-[0.5em]' : 'text-[10px] tracking-[0.45em]';
  const tracking = large ? 'tracking-[0.38em]' : 'tracking-[0.35em]';
  const trackValue = large ? '0.38em' : '0.35em';

  return (
    <div className="text-center select-none" style={{ color: col }}>
      <div className={`${letterClass} relative inline-flex items-end leading-none pb-1`}>
        <span className={tracking}>MEZ</span>
        <span className="relative inline-flex flex-col items-center">
          {/* 4-pointed sparkle above the O - Perfectly Centered */}
          <svg
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: large ? '-14px' : '-8px' }}
            width={large ? 12 : 8}
            height={large ? 12 : 8}
            viewBox="0 0 12 12"
            fill={col}
          >
            <path d="M6 0 L6.8 5.2 L6 6 L5.2 5.2 Z" />
            <path d="M12 6 L6.8 6.8 L6 6 L6.8 5.2 Z" />
            <path d="M6 12 L5.2 6.8 L6 6 L6.8 6.8 Z" />
            <path d="M0 6 L5.2 5.2 L6 6 L5.2 6.8 Z" />
          </svg>
          O
        </span>
        <span style={{ width: trackValue }}></span>
        <span>R</span>
      </div>
      <div className="flex items-center gap-2 mt-1" style={{ color: col }}>
        <div className="flex-1 border-t" style={{ borderColor: col, opacity: 0.5 }} />
        <span className={subClass}>JEWELS</span>
        <div className="flex-1 border-t" style={{ borderColor: col, opacity: 0.5 }} />
      </div>
    </div>
  );
}

/* ─── Brand Icon ────────────────────────────────────────────── */
function BrandIcon({ size = 40, color = '#853D28' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="17" stroke={color} strokeWidth="0.8" />
      <path d="M20 4 L21.2 18.8 L20 20 L18.8 18.8 Z" fill={color} />
      <path d="M36 20 L21.2 21.2 L20 20 L21.2 18.8 Z" fill={color} />
      <path d="M20 36 L18.8 21.2 L20 20 L21.2 21.2 Z" fill={color} />
      <path d="M4 20 L18.8 18.8 L20 20 L18.8 21.2 Z" fill={color} />
    </svg>
  );
}

/* ─── Category SVG Icons ────────────────────────────────────── */
function RingIcon() {
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
      <ellipse cx="24" cy="16" rx="20" ry="10" stroke="#853D28" strokeWidth="0.9" />
      <ellipse cx="24" cy="16" rx="12" ry="6" stroke="#853D28" strokeWidth="0.9" />
    </svg>
  );
}

function NecklaceIcon() {
  return (
    <svg width="40" height="56" viewBox="0 0 40 56" fill="none">
      <path d="M8 4 Q20 28 20 40" stroke="#853D28" strokeWidth="0.9" fill="none" />
      <path d="M32 4 Q20 28 20 40" stroke="#853D28" strokeWidth="0.9" fill="none" />
      <circle cx="20" cy="48" r="5" stroke="#853D28" strokeWidth="0.9" />
    </svg>
  );
}

function EarringsIcon() {
  return (
    <svg width="52" height="48" viewBox="0 0 52 48" fill="none">
      <line x1="14" y1="4" x2="14" y2="14" stroke="#853D28" strokeWidth="0.9" />
      <ellipse cx="14" cy="28" rx="9" ry="13" stroke="#853D28" strokeWidth="0.9" />
      <line x1="38" y1="4" x2="38" y2="14" stroke="#853D28" strokeWidth="0.9" />
      <ellipse cx="38" cy="28" rx="9" ry="13" stroke="#853D28" strokeWidth="0.9" />
    </svg>
  );
}

/* ─── Main Component ────────────────────────────────────────── */
export function MezorJewels() {
  const router = useRouter();
  
  const { items: cartItems, totalItems, subtotal } = useCart();
  const { isFavorite, favoriteIds } = useFavorites();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [favsOpen, setFavsOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [products, setProducts] = useState<JewelryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<string | null>(null);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', address: '', city: '', country: '' });
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchJewelries = async () => {
      setLoading(true);
      try {
        const url = searchQuery 
          ? `/api/jewelries/search?q=${encodeURIComponent(searchQuery)}`
          : '/api/jewelries';
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchJewelries, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);

      setUploadingImage(true);
      try {
        const response = await fetch('/api/try-on/upload', {
          method: 'POST',
          body: formData,
        });
        const payload = await response.json();
        setSelectedImage(payload.secureUrl || null);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const filtered = activeCategory ? products.filter((p) => p.category === activeCategory) : products;

  const submitContactForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactStatus('SENDING...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });

      if (!response.ok) throw new Error('Contact request failed');

      setContactStatus('MESSAGE SENT');
      setContactForm({ name: '', email: '', message: '' });
    } catch {
      setContactStatus('ERROR, TRY AGAIN');
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus('processing');
    
    try {
      // In a real app, you'd use a real user ID from session.
      // For now, using 'guest_user' placeholder.
      const result = await processCheckout('guest_user', {
        rue: checkoutForm.address,
        ville: checkoutForm.city,
        codePostal: '00000', // Placeholder as not in form
        pays: checkoutForm.country
      }, cartItems);

      if (result.success) {
        setPaymentStatus('success');
        toast.success('Paiement réussi !');
        setTimeout(() => {
          router.push('/checkout/success');
          setCheckoutOpen(false);
          setCartOpen(false);
        }, 1500);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      setPaymentStatus('idle');
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const shippingFees = 25;
  const totalAmount = subtotal + shippingFees;

  return (
    <div className="min-h-screen bg-[#DDC2A7] overflow-x-hidden">
      
      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2F3C67]" style={{ borderBottom: '0.5px solid rgba(221,194,167,0.2)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 md:py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-10">
            <div className="hidden md:flex items-center gap-10">
              <a href="#" className="text-[#DDC2A7] text-[11px] tracking-[0.25em] hover:text-white transition-colors">ACCUEIL</a>
              <a href="#collection" className="text-[#DDC2A7] text-[11px] tracking-[0.25em] hover:text-white transition-colors">COLLECTION</a>
            </div>
            <div className="relative flex items-center">
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#DDC2A7] hover:text-white transition-colors p-2 md:p-0"
              >
                <Search size={18} strokeWidth={1.2} />
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: typeof window !== 'undefined' && window.innerWidth < 768 ? 120 : 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="ml-2 md:ml-4 overflow-hidden"
                  >
                    <input 
                      type="text"
                      placeholder="RECHERCHER..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-b border-[#DDC2A7] text-[#DDC2A7] text-[10px] tracking-[0.2em] outline-none w-full pb-1 focus:border-white transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 scale-75 md:scale-100 transition-transform">
            <MezorLogo beige />
          </div>

          <div className="flex items-center gap-4 md:gap-10">
            <div className="hidden md:flex items-center gap-10">
              <a href="#about" className="text-[#DDC2A7] text-[11px] tracking-[0.25em] hover:text-white transition-colors">À PROPOS</a>
              <a href="#contact" className="text-[#DDC2A7] text-[11px] tracking-[0.25em] hover:text-white transition-colors">CONTACT</a>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => setFavsOpen(true)}
                className="text-[#DDC2A7] hover:text-white transition-colors relative"
              >
                <Heart size={18} strokeWidth={1.2} />
                {favoriteIds.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#853D28] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                    {favoriteIds.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setCartOpen(true)}
                className="text-[#DDC2A7] hover:text-white transition-colors relative"
              >
                <ShoppingBag size={18} strokeWidth={1.2} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#853D28] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden text-[#DDC2A7] hover:text-white transition-colors p-2"
              >
                <Menu size={20} strokeWidth={1.2} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Drawer ──────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-[#2F3C67] z-[101] shadow-2xl flex flex-col md:hidden"
            >
              <div className="p-6 flex justify-end border-b border-[#DDC2A7]/10">
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#DDC2A7] hover:text-white transition-colors"
                >
                  <X size={24} strokeWidth={1} />
                </button>
              </div>
              <div className="flex flex-col gap-8 p-10 mt-10">
                <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-[#DDC2A7] text-[14px] tracking-[0.3em] hover:text-white transition-colors uppercase">ACCUEIL</a>
                <a href="#collection" onClick={() => setMobileMenuOpen(false)} className="text-[#DDC2A7] text-[14px] tracking-[0.3em] hover:text-white transition-colors uppercase">COLLECTION</a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-[#DDC2A7] text-[14px] tracking-[0.3em] hover:text-white transition-colors uppercase">À PROPOS</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-[#DDC2A7] text-[14px] tracking-[0.3em] hover:text-white transition-colors uppercase">CONTACT</a>
              </div>
              <div className="mt-auto p-10">
                <MezorLogo beige large={false} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center overflow-hidden h-[60vh] md:h-screen min-h-[500px]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src="/assets/vedios/home.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.50)', zIndex: 1 }} />
        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.3, delayChildren: 0.2 } },
          }}
        >
          <motion.p
            className="text-[#DDC2A7] text-[10px] tracking-[0.55em] mb-5 uppercase"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
            }}
          >
            BEAUTÉ INTEMPORELLE
          </motion.p>
          <motion.h1
            className="hero-title-shine text-[32px] sm:text-[44px] md:text-[56px] font-serif leading-[1.1] tracking-[0.04em] mb-2"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] } },
            }}
          >
            CRÉÉ
          </motion.h1>
          <motion.h1
            className="hero-title-shine text-[32px] sm:text-[44px] md:text-[56px] font-serif leading-[1.1] tracking-[0.04em] mb-7"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] } },
            }}
          >
            POUR L&apos;ÉTERNITÉ
          </motion.h1>
          <motion.div
            className="hero-divider w-12 border-t mb-7"
            style={{ borderColor: 'rgba(221,194,167,0.45)' }}
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: { opacity: 1, scaleX: 1, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
            }}
          />
          <motion.p
            className="text-[#DDC2A7] text-[11px] tracking-[0.25em] mb-10 max-w-sm leading-loose opacity-70"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 0.7, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
            }}
          >
            L&apos;ARTISANAT RENCONTRE L&apos;ÉLÉGANCE INTEMPORELLE
          </motion.p>
          <motion.a
            href="#collection"
            className="hero-shimmer-btn text-white text-[10px] tracking-[0.35em] px-10 py-4 inline-block transition-colors duration-300"
            style={{
              background: 'linear-gradient(135deg, #853D28 0%, #a64e33 40%, #853D28 100%)',
            }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
            }}
            whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.97 }}
          >
            DÉCOUVRIR LA COLLECTION
          </motion.a>
        </motion.div>
        <div
          className="absolute bottom-0 left-0 right-0 h-28"
          style={{ background: 'linear-gradient(to top, rgba(221,194,167,1) 0%, transparent 100%)', zIndex: 2 }}
        />
      </section>

      {/* ── Category Grid ────────────────────────────────────── */}
      <section id="collection" className="bg-[#DDC2A7]" style={{ borderTop: '0.5px solid rgba(133,61,40,0.2)', borderBottom: '0.5px solid rgba(133,61,40,0.2)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderLeft: '0.5px solid rgba(133,61,40,0.2)' }}>
            {[
              { key: 'rings', label: 'BAGUES', Icon: RingIcon },
              { key: 'necklaces', label: 'COLLIERS', Icon: NecklaceIcon },
              { key: 'earrings', label: 'BOUCLES D\'OREILLES', Icon: EarringsIcon },
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(activeCategory === key ? null : key)}
                className="group flex flex-col items-center py-20 transition-all relative"
                style={{
                  borderRight: '0.5px solid rgba(133,61,40,0.2)',
                  background: activeCategory === key ? 'rgba(255,255,255,0.35)' : 'transparent',
                }}
              >
                <div className="mb-7 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Icon />
                </div>
                <p className="text-[#2F3C67] text-[13px] tracking-[0.3em] font-serif mb-3">{label}</p>
                <p className="text-[#853D28] text-[10px] tracking-[0.4em]">VOIR</p>
                {activeCategory === key && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 border-t-2 border-[#853D28]" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center py-6" style={{ borderTop: '0.5px solid rgba(133,61,40,0.2)' }}>
          <BrandIcon size={28} color="#853D28" />
        </div>
      </section>

      {/* ── Boutique Interior ────────────────────────────────── */}
      <section id="about" className="relative h-[520px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1603133682095-8e6075675ec4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Mezor Jewels boutique"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(47,60,103,0.72)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[#DDC2A7] text-[10px] tracking-[0.5em] mb-8">NOTRE ATELIER</p>
          <MezorLogo beige large />
          <div className="mt-10 w-px h-16 bg-[#DDC2A7] opacity-30" />
          <p className="mt-8 text-[#DDC2A7] text-[12px] tracking-[0.25em] max-w-xs leading-loose opacity-80">
            L&apos;ARTISANAT RENCONTRE<br />L&apos;ÉLÉGANCE INTEMPORELLE
          </p>
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="flex items-center gap-4 md:gap-6 mb-10 md:mb-16">
            <div className="flex-1 border-t" style={{ borderColor: 'rgba(133,61,40,0.2)' }} />
            <div className="text-center">
              <p className="text-[#853D28] text-[10px] tracking-[0.5em] mb-2">NOTRE COLLECTION</p>
              <h2 className="text-[32px] text-[#2F3C67] font-serif tracking-wide">
                {searchQuery ? `Résultats pour "${searchQuery}"` : 'Chefs-d\'œuvre Intemporels'}
              </h2>
            </div>
            <div className="flex-1 border-t" style={{ borderColor: 'rgba(133,61,40,0.2)' }} />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#853D28]"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#2F3C67] text-[14px] tracking-[0.2em] opacity-50 uppercase">Aucune pièce trouvée pour votre sélection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0" style={{ border: '0.5px solid rgba(221,194,167,0.6)' }}>
              {filtered.map((product, i) => (
                <div
                  key={product._id}
                  className="group relative border-b sm:border-r border-[rgba(221,194,167,0.6)]"
                >
                  <div className="aspect-square overflow-hidden bg-[#f9f5f0] relative">
                    <Link href={`/bijoux/${product._id}`}>
                      <ImageWithFallback
                        src={product.mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                      />
                    </Link>
                    <div className="absolute top-4 right-4 z-20">
                      <FavoriteButton 
                        bijouId={product._id} 
                        initialIsFavorite={isFavorite(product._id)} 
                        utilisateurId="dummy_user_id" // Placeholder
                      />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
                      <button
                        onClick={() => {
                          addToCart(product);
                          toast.success(`${product.name} ajouté au panier`);
                        }}
                        className="flex-1 bg-[#2F3C67] text-white text-[9px] tracking-[0.2em] px-4 py-3 hover:bg-[#1a233d] transition-colors"
                      >
                        AJOUTER AU PANIER
                      </button>
                      <button
                        onClick={() => {
                          setTryOnOpen(true);
                          fileInputRef.current?.click();
                        }}
                        className="bg-[#853D28] text-white text-[9px] tracking-[0.2em] px-4 py-3 hover:bg-[#6d3220] transition-colors"
                      >
                        ESSAI VIRTUEL
                      </button>
                    </div>
                  </div>
                  <div className="p-7" style={{ borderTop: '0.5px solid rgba(221,194,167,0.6)' }}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[#2F3C67] text-[14px] font-serif tracking-wide">{product.name}</h3>
                      <span className="text-[#853D28] text-[14px] tracking-wide">{formatPrice(product.price)}</span>
                    </div>
                    <p className="text-[#2F3C67] text-[10px] tracking-[0.1em] opacity-50 mb-4 line-clamp-1 uppercase">{product.category}</p>
                    <Link 
                      href={`/bijoux/${product._id}`}
                      className="text-[10px] tracking-[0.3em] text-[#2F3C67] hover:text-[#853D28] transition-colors border-b border-[#2F3C67] hover:border-[#853D28] pb-0.5 inline-block"
                    >
                      VOIR LES DÉTAILS
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── AI Virtual Try-On strip ──────────────────────────── */}
      <section className="bg-[#2F3C67] py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <p className="text-[#DDC2A7] text-[10px] tracking-[0.5em] mb-3 uppercase">Propulsé par l&apos;IA</p>
            <h2 className="text-[36px] text-white font-serif uppercase">Studio d&apos;Essai Virtuel</h2>
            <p className="text-[#DDC2A7] text-[12px] tracking-[0.15em] mt-4 opacity-70 max-w-sm leading-relaxed">
              Téléchargez votre photo et voyez comment nos pièces vous vont grâce à la visualisation par IA.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
            <div className="flex items-center gap-6 md:gap-8 border-b sm:border-b-0 sm:border-r border-[rgba(221,194,167,0.2)] pb-6 sm:pb-0 sm:pr-8">
              <div className="text-center">
              <p className="text-[#DDC2A7] text-[28px] font-serif">01</p>
              <p className="text-[#DDC2A7] text-[9px] tracking-[0.3em] mt-2 opacity-60 uppercase">Photo</p>
            </div>
            <div className="text-center" style={{ borderRight: '0.5px solid rgba(221,194,167,0.2)', paddingRight: '2rem' }}>
              <p className="text-[#DDC2A7] text-[28px] font-serif">02</p>
              <p className="text-[#DDC2A7] text-[9px] tracking-[0.3em] mt-2 opacity-60 uppercase">Sélection</p>
            </div>
            <div className="text-center" style={{ paddingRight: '2rem' }}>
              <p className="text-[#DDC2A7] text-[28px] font-serif">03</p>
              <p className="text-[#DDC2A7] text-[9px] tracking-[0.3em] mt-2 opacity-60 uppercase">Visualisation</p>
            </div>
            <button
              onClick={() => {
                setTryOnOpen(true);
                fileInputRef.current?.click();
              }}
              className="bg-[#853D28] text-white text-[11px] tracking-[0.3em] px-8 py-4 hover:bg-[#6d3220] transition-colors uppercase w-full sm:w-auto"
            >
              DÉMARRER LA SESSION
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
        </div>
      </section>

      {/* ── Brand Story ─────────────────────────────────────── */}
      <section className="bg-[#DDC2A7] py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[rgba(133,61,40,0.2)]">
            <div className="p-10 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[rgba(133,61,40,0.2)]">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-[#853D28] text-[10px] tracking-[0.5em] mb-6 uppercase"
              >
                Notre Philosophie
              </motion.p>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-[28px] md:text-[36px] text-[#2F3C67] font-serif leading-snug mb-6 md:mb-8"
              >
                Chaque Pièce<br />Raconte Une Histoire
              </motion.h2>
              <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="w-8 border-t mb-8 origin-left" 
                style={{ borderColor: '#853D28' }} 
              />
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.7, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-[#2F3C67] text-[11px] tracking-[0.1em] leading-loose max-w-xs uppercase font-light"
              >
                Mezor Jewels crée des pièces de qualité héritage en utilisant uniquement les métaux précieux les plus fins et des pierres précieuses sourcées de manière éthique.
              </motion.p>
            </div>
            <div className="relative overflow-hidden group" style={{ minHeight: '400px' }}>
              <video
                src="/assets/videos/atelier.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000"
              />
              {/* Glossy Shimmer Effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div 
                  className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-20"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                    repeatDelay: 3 
                  }}
                />
              </div>
              <div className="absolute inset-0" style={{ background: 'rgba(47,60,103,0.1)' }} />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto border border-[rgba(133,61,40,0.25)]">
            <div className="p-8 md:p-12">
              <p className="text-[#853D28] text-[10px] tracking-[0.5em] mb-3 uppercase">Contact</p>
              <h3 className="text-[24px] md:text-[30px] text-[#2F3C67] font-serif mb-6 md:mb-8 uppercase">Contacter Notre Atelier</h3>
              <form onSubmit={submitContactForm} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={contactForm.name}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="border border-[#DDC2A7] px-4 py-3 text-[#2F3C67] text-[12px] tracking-[0.12em] outline-none focus:border-[#853D28] transition-colors w-full"
                  placeholder="NOM"
                  required
                />
                <input
                  value={contactForm.email}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="border border-[#DDC2A7] px-4 py-3 text-[#2F3C67] text-[12px] tracking-[0.12em] w-full outline-none focus:border-[#853D28] transition-colors"
                  placeholder="EMAIL"
                  type="email"
                  required
                />
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                  className="border border-[#DDC2A7] px-4 py-3 text-[#2F3C67] text-[12px] tracking-[0.12em] md:col-span-2 min-h-32 outline-none focus:border-[#853D28] transition-colors w-full"
                  placeholder="MESSAGE"
                  required
                />
                <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button type="submit" className="bg-[#853D28] text-white text-[11px] tracking-[0.3em] px-10 py-4 hover:bg-[#6d3220] transition-colors uppercase w-full sm:w-auto">
                    Envoyer le Message
                  </button>
                  {contactStatus && <p className="text-[#2F3C67] text-[10px] tracking-[0.2em]">{contactStatus}</p>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-[#2F3C67] py-16 md:py-24 border-t border-[#DDC2A7]/20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-20">
            {/* Column 1: Brand Identity */}
            <div className="flex flex-col gap-6 text-center sm:text-left items-center sm:items-start">
              <MezorLogo beige large={false} />
              <p className="text-[#DDC2A7] text-[11px] tracking-[0.15em] leading-relaxed opacity-70 uppercase max-w-xs mt-4">
                La haute joaillerie redéfinie. L'artisanat d'exception à la rencontre de l'élégance intemporelle.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col gap-4 text-center sm:text-left">
              <h4 className="text-white text-[10px] tracking-[0.4em] uppercase font-bold mb-2">Boutique</h4>
              <Link href="#collection" className="text-[#DDC2A7] text-[11px] tracking-[0.2em] opacity-60 hover:opacity-100 hover:text-white transition-all uppercase">Collection</Link>
              <Link href="#about" className="text-[#DDC2A7] text-[11px] tracking-[0.2em] opacity-60 hover:opacity-100 hover:text-white transition-all uppercase">Notre Histoire</Link>
              <Link href="#" className="text-[#DDC2A7] text-[11px] tracking-[0.2em] opacity-60 hover:opacity-100 hover:text-white transition-all uppercase">Guide d'Entretien</Link>
              <Link href="#" className="text-[#DDC2A7] text-[11px] tracking-[0.2em] opacity-60 hover:opacity-100 hover:text-white transition-all uppercase">Sur Mesure</Link>
            </div>

            {/* Column 3: Customer Care */}
            <div className="flex flex-col gap-4 text-center sm:text-left">
              <h4 className="text-white text-[10px] tracking-[0.4em] uppercase font-bold mb-2">Service Client</h4>
              <Link href="#" className="text-[#DDC2A7] text-[11px] tracking-[0.2em] opacity-60 hover:opacity-100 hover:text-white transition-all uppercase">Livraison</Link>
              <Link href="#" className="text-[#DDC2A7] text-[11px] tracking-[0.2em] opacity-60 hover:opacity-100 hover:text-white transition-all uppercase">Retours</Link>
              <Link href="#contact" className="text-[#DDC2A7] text-[11px] tracking-[0.2em] opacity-60 hover:opacity-100 hover:text-white transition-all uppercase">Nous Contacter</Link>
              <Link href="#" className="text-[#DDC2A7] text-[11px] tracking-[0.2em] opacity-60 hover:opacity-100 hover:text-white transition-all uppercase">Confidentialité</Link>
            </div>

            {/* Column 4: Newsletter */}
            <div className="flex flex-col gap-4 text-center sm:text-left items-center sm:items-start">
              <h4 className="text-white text-[10px] tracking-[0.4em] uppercase font-bold mb-2">Newsletter</h4>
              <p className="text-[#DDC2A7] text-[10px] tracking-[0.1em] opacity-60 uppercase mb-2">
                Rejoignez le cercle restreint Mezor Jewels.
              </p>
              <div className="relative group overflow-hidden border-b border-[#DDC2A7]/30 pb-2 flex items-center mt-2">
                <input 
                  type="email" 
                  placeholder="VOTRE ADRESSE EMAIL" 
                  className="bg-transparent outline-none text-[#DDC2A7] text-[10px] tracking-[0.2em] w-full placeholder:text-[#DDC2A7]/40"
                />
                <button className="text-[#DDC2A7] text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors relative z-10">
                  Rejoindre
                </button>
                {/* Shimmer Effect on hover for newsletter */}
                <motion.div 
                  className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  style={{ pointerEvents: 'none' }}
                />
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-[#DDC2A7]/20 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <a href="#" className="text-[#DDC2A7] opacity-60 hover:opacity-100 transition-opacity"><Instagram size={18} strokeWidth={1} /></a>
              <a href="#" className="text-[#DDC2A7] opacity-60 hover:opacity-100 transition-opacity"><Facebook size={18} strokeWidth={1} /></a>
              <a href="#" className="text-[#DDC2A7] opacity-60 hover:opacity-100 transition-opacity"><Twitter size={18} strokeWidth={1} /></a>
            </div>
            
            <p className="text-[#DDC2A7] text-[9px] tracking-[0.3em] opacity-40 uppercase text-center md:text-left">
              © 2026 Mezor Jewels. Tous droits réservés.
            </p>

            <div className="flex items-center gap-4 text-[#DDC2A7] opacity-40">
              <CreditCard size={24} strokeWidth={1} />
              <span className="text-[8px] tracking-[0.2em] uppercase">Paiement Sécurisé</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Favorites Drawer ──────────────────────────────────── */}
      <AnimatePresence>
        {favsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setFavsOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#F9F5F0] z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-[#DDC2A7] flex items-center justify-between">
                <div>
                  <h3 className="text-[#2F3C67] text-[20px] font-serif uppercase tracking-wide">Vos Favoris</h3>
                  <p className="text-[#2F3C67] text-[10px] tracking-[0.2em] mt-1 uppercase opacity-60">{favoriteIds.length} Pièces</p>
                </div>
                <button 
                  onClick={() => setFavsOpen(false)}
                  className="text-[#2F3C67] hover:text-[#853D28] transition-colors"
                >
                  <X size={24} strokeWidth={1} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 custom-scrollbar">
                {favoriteIds.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <Heart size={32} strokeWidth={1} className="text-[#853D28] opacity-30 mb-4" />
                    <p className="text-[#2F3C67] text-[11px] tracking-[0.2em] uppercase opacity-50">Votre liste de souhaits est vide</p>
                  </div>
                ) : (
                  products.filter(p => favoriteIds.includes(p._id)).map((product) => (
                    <div key={product._id} className="flex gap-6 group">
                      <div className="w-24 h-24 bg-white relative overflow-hidden shrink-0">
                        <ImageWithFallback src={product.mainImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="text-[#2F3C67] text-[12px] font-serif tracking-wide uppercase mb-1">{product.name}</h4>
                        <p className="text-[#2F3C67] text-[11px] font-light mb-3">{formatPrice(product.price)}</p>
                        <div className="flex items-center gap-4 mt-auto">
                          <Link href={`/bijoux/${product._id}`} onClick={() => setFavsOpen(false)} className="text-[9px] tracking-[0.3em] uppercase text-[#2F3C67] hover:text-[#853D28] transition-colors pb-1 border-b border-[#2F3C67] hover:border-[#853D28]">
                            Voir la pièce
                          </Link>
                          <button onClick={() => toggleFavorite(product._id)} className="text-[9px] tracking-[0.3em] uppercase text-[#853D28] opacity-60 hover:opacity-100 transition-opacity">
                            Retirer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Cart Drawer ───────────────────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#2F3C67] z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-[#DDC2A7]/10 flex items-center justify-between">
                <div>
                  <h3 className="text-white text-[20px] font-serif uppercase tracking-wide">Votre Sélection</h3>
                  <p className="text-[#DDC2A7] text-[10px] tracking-[0.2em] mt-1 uppercase">{totalItems} Pièces Sélectionnées</p>
                </div>
                <button onClick={() => setCartOpen(false)} className="text-[#DDC2A7] hover:text-white transition-colors">
                  <X size={20} strokeWidth={1} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingBag size={40} strokeWidth={0.5} className="text-[#DDC2A7] opacity-20 mb-6" />
                    <p className="text-[#DDC2A7] text-[12px] tracking-[0.2em] opacity-50 uppercase">Votre panier est vide.</p>
                    <button 
                      onClick={() => setCartOpen(false)}
                      className="mt-8 text-[#DDC2A7] text-[10px] tracking-[0.3em] border-b border-[#DDC2A7] pb-1 uppercase hover:text-white hover:border-white transition-all"
                    >
                      Commencer vos achats
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {cartItems.map((item) => (
                      <div key={item.product._id} className="flex gap-6 group">
                        <div className="w-24 h-24 bg-[#DDC2A7]/5 overflow-hidden">
                          <img src={item.product.mainImage} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 py-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-white text-[13px] font-serif tracking-wide">{item.product.name}</h4>
                            <button 
                              onClick={() => removeFromCart(item.product._id)}
                              className="text-[#DDC2A7] opacity-40 hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={14} strokeWidth={1.2} />
                            </button>
                          </div>
                          <p className="text-[#DDC2A7] text-[10px] tracking-[0.15em] mb-4 opacity-50 uppercase">{item.product.category}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 border border-[#DDC2A7]/20 px-3 py-1.5">
                              <button onClick={() => updateCartQty(item.product._id, item.quantity - 1)} className="text-[#DDC2A7] hover:text-white">
                                <Minus size={12} strokeWidth={1} />
                              </button>
                              <span className="text-[#DDC2A7] text-[11px] font-medium w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateCartQty(item.product._id, item.quantity + 1)} className="text-[#DDC2A7] hover:text-white">
                                <Plus size={12} strokeWidth={1} />
                              </button>
                            </div>
                            <span className="text-white text-[13px] tracking-wide">{formatPrice(item.product.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-8 bg-[#1a233d] border-t border-[#DDC2A7]/10">
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-[#DDC2A7] text-[11px] tracking-[0.1em] uppercase">
                      <span>Sous-total</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#DDC2A7] text-[11px] tracking-[0.1em] uppercase">
                      <span>Livraison</span>
                      <span>Offerte</span>
                    </div>
                    <div className="flex justify-between text-white text-[16px] font-serif pt-3 border-t border-[#DDC2A7]/10 tracking-wide uppercase">
                      <span>Total</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCheckoutOpen(true)}
                    className="w-full bg-[#853D28] text-white text-[11px] tracking-[0.3em] py-5 hover:bg-[#6d3220] transition-colors uppercase"
                  >
                    Passer à la caisse
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Checkout Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {checkoutOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#2F3C67] w-full max-w-3xl relative z-[201] shadow-2xl border border-[#DDC2A7]/10 overflow-hidden"
            >
              <div className="grid md:grid-cols-2">
                <div className="p-10 border-b md:border-b-0 md:border-r border-[#DDC2A7]/10">
                  <h3 className="text-white text-[24px] font-serif mb-8 uppercase tracking-wide">Finaliser la Commande</h3>
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="NOM COMPLET"
                      required
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                      className="w-full bg-transparent border border-[#DDC2A7]/20 p-4 text-[#DDC2A7] text-[11px] tracking-[0.2em] outline-none focus:border-[#853D28] transition-colors"
                    />
                    <input 
                      type="email" 
                      placeholder="ADRESSE EMAIL"
                      required
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                      className="w-full bg-transparent border border-[#DDC2A7]/20 p-4 text-[#DDC2A7] text-[11px] tracking-[0.2em] outline-none focus:border-[#853D28] transition-colors"
                    />
                    <input 
                      type="text" 
                      placeholder="ADRESSE DE LIVRAISON"
                      required
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                      className="w-full bg-transparent border border-[#DDC2A7]/20 p-4 text-[#DDC2A7] text-[11px] tracking-[0.2em] outline-none focus:border-[#853D28] transition-colors"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="VILLE"
                        required
                        value={checkoutForm.city}
                        onChange={(e) => setCheckoutForm({...checkoutForm, city: e.target.value})}
                        className="w-full bg-transparent border border-[#DDC2A7]/20 p-4 text-[#DDC2A7] text-[11px] tracking-[0.2em] outline-none focus:border-[#853D28] transition-colors"
                      />
                      <input 
                        type="text" 
                        placeholder="PAYS"
                        required
                        value={checkoutForm.country}
                        onChange={(e) => setCheckoutForm({...checkoutForm, country: e.target.value})}
                        className="w-full bg-transparent border border-[#DDC2A7]/20 p-4 text-[#DDC2A7] text-[11px] tracking-[0.2em] outline-none focus:border-[#853D28] transition-colors"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={paymentStatus !== 'idle'}
                      className="w-full bg-[#853D28] text-white text-[11px] tracking-[0.3em] py-5 mt-4 hover:bg-[#6d3220] transition-all relative overflow-hidden disabled:opacity-50"
                    >
                      {paymentStatus === 'idle' && 'AUTHORIZE PAYMENT'}
                      {paymentStatus === 'processing' && (
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin h-3 w-3 border-t-2 border-white rounded-full"></div>
                          <span>PROCESSING...</span>
                        </div>
                      )}
                      {paymentStatus === 'success' && (
                        <div className="flex items-center justify-center gap-3">
                          <Check size={16} />
                          <span>SUCCESSFUL</span>
                        </div>
                      )}
                    </button>
                  </form>
                </div>
                
                <div className="p-10 bg-[#1a233d] flex flex-col">
                  <h3 className="text-white text-[20px] font-serif mb-8 uppercase tracking-wide">Summary</h3>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {cartItems.map((item) => (
                      <div key={item.product._id} className="flex justify-between items-center text-[#DDC2A7] text-[11px] tracking-[0.1em] uppercase">
                        <span className="opacity-70">{item.product.name} x {item.quantity}</span>
                        <span>{((item.product.price || 0) * item.quantity).toLocaleString()} DH</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-8 border-t border-[#DDC2A7]/10 mt-6 space-y-3">
                    <div className="flex justify-between text-[#DDC2A7] text-[11px] tracking-[0.1em] uppercase">
                      <span className="opacity-70">Atelier Delivery</span>
                      <span>{(shippingFees || 0).toLocaleString()} DH</span>
                    </div>
                    <div className="flex justify-between text-white text-[20px] font-serif pt-4 uppercase tracking-wide">
                      <span>Total Due</span>
                      <span>{(totalAmount || 0).toLocaleString()} DH</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCheckoutOpen(false)}
                    className="mt-8 text-[#DDC2A7] text-[9px] tracking-[0.3em] uppercase opacity-50 hover:opacity-100 transition-opacity self-center"
                  >
                    Modify Selection
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── AI Try-On Modal ───────────────────────────────────── */}
      {tryOnOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(10,14,30,0.85)' }}>
          <div className="bg-[#2F3C67] w-full max-w-2xl mx-6 relative shadow-2xl" style={{ border: '0.5px solid rgba(221,194,167,0.2)' }}>
            <div className="flex items-center justify-between px-10 py-7" style={{ borderBottom: '0.5px solid rgba(221,194,167,0.15)' }}>
              <div>
                <p className="text-[#DDC2A7] text-[9px] tracking-[0.5em] mb-1 uppercase">AI Powered</p>
                <h3 className="text-white text-[20px] font-serif tracking-wide uppercase">Virtual Try-On Studio</h3>
              </div>
              <button onClick={() => { setTryOnOpen(false); setSelectedImage(null); }} className="text-[#DDC2A7] hover:text-white transition-colors">
                <X size={18} strokeWidth={1.2} />
              </button>
            </div>

            <div className="p-10">
              <div
                className="aspect-video flex flex-col items-center justify-center relative overflow-hidden"
                style={{ border: '0.5px dashed rgba(221,194,167,0.25)', background: 'rgba(0,0,0,0.2)' }}
              >
                {selectedImage ? (
                  <div className="relative w-full h-full">
                    <img src={selectedImage} alt="Uploaded" className="w-full h-full object-contain" />
                    <div className="absolute bottom-0 left-0 right-0 py-4 text-center" style={{ background: 'linear-gradient(to top, rgba(47,60,103,0.9), transparent)' }}>
                      <p className="text-white text-[10px] tracking-[0.3em] uppercase">Jewelry Overlay Preview</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="text-[#DDC2A7] mb-6 opacity-40" size={40} strokeWidth={1} />
                    <p className="text-[#DDC2A7] text-[10px] tracking-[0.4em] mb-6 opacity-60 uppercase">Upload Your Photo</p>
                    <label className="cursor-pointer">
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <span className="bg-[#853D28] text-white text-[10px] tracking-[0.35em] px-8 py-3 inline-block hover:bg-[#6d3220] transition-colors uppercase">
                        Select Image
                      </span>
                    </label>
                    {uploadingImage && <p className="text-[#DDC2A7] text-[9px] tracking-[0.3em] mt-4 opacity-60 uppercase">Uploading...</p>}
                  </>
                )}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                {['01  UPLOAD', '02  SELECT', '03  PREVIEW'].map((step) => (
                  <div key={step} className="text-center py-4" style={{ border: '0.5px solid rgba(221,194,167,0.12)' }}>
                    <p className="text-[#DDC2A7] text-[9px] tracking-[0.3em] opacity-50">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
