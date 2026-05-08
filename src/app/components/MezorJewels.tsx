"use client";

import { useEffect, useRef, useState } from 'react';
import { ShoppingBag, Upload, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import brandImage from '../../imports/WhatsApp_Image_2026-05-04_at_23.19.38.jpeg';

/* ─── Logo ──────────────────────────────────────────────────── */
function MezorLogo({ beige = true, large = false }: { beige?: boolean; large?: boolean }) {
  const col = beige ? '#DDC2A7' : '#853D28';
  const letterClass = large
    ? 'text-[56px] tracking-[0.38em] font-serif'
    : 'text-[22px] tracking-[0.35em] font-serif';
  const subClass = large ? 'text-[13px] tracking-[0.5em]' : 'text-[10px] tracking-[0.45em]';

  return (
    <div className="text-center select-none" style={{ color: col }}>
      <div className={`${letterClass} relative inline-flex items-end leading-none pb-1`}>
        <span>MEZ</span>
        <span className="relative">
          {/* 4-pointed sparkle above the O */}
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<
    Array<{ _id: string; name: string; price: number; description: string; category: string; mainImage: string }>
  >([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      const response = await fetch('/api/jewelries');
      const data = await response.json();
      setProducts(data);
    };

    loadProducts().catch(() => setProducts([]));
  }, []);

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

      if (!response.ok) {
        throw new Error('Contact request failed');
      }

      setContactStatus('MESSAGE SENT');
      setContactForm({ name: '', email: '', message: '' });
    } catch {
      setContactStatus('ERROR, TRY AGAIN');
    }
  };

  return (
    <div className="min-h-screen bg-[#DDC2A7] overflow-x-hidden">

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2F3C67]" style={{ borderBottom: '0.5px solid rgba(221,194,167,0.2)' }}>
        <div className="max-w-[1400px] mx-auto px-10 py-5 flex items-center justify-between">
          {/* Left links */}
          <div className="flex items-center gap-10">
            <a href="#" className="text-[#DDC2A7] text-[11px] tracking-[0.25em] hover:text-white transition-colors">HOME</a>
            <a href="#collection" className="text-[#DDC2A7] text-[11px] tracking-[0.25em] hover:text-white transition-colors">COLLECTION</a>
          </div>

          {/* Center logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <MezorLogo beige />
          </div>

          {/* Right links */}
          <div className="flex items-center gap-10">
            <a href="#about" className="text-[#DDC2A7] text-[11px] tracking-[0.25em] hover:text-white transition-colors">ABOUT</a>
            <a href="#contact" className="text-[#DDC2A7] text-[11px] tracking-[0.25em] hover:text-white transition-colors">CONTACT</a>
            <button className="text-[#DDC2A7] hover:text-white transition-colors ml-2">
              <ShoppingBag size={18} strokeWidth={1.2} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="flex h-screen mt-[68px]" style={{ maxHeight: '760px' }}>
        {/* Text half */}
        <div className="w-1/2 bg-[#2F3C67] flex items-center px-20">
          <div>
            <p className="text-[#DDC2A7] text-[10px] tracking-[0.4em] mb-6">TIMELESS BEAUTY</p>
            <h1 className="text-[64px] text-white font-serif leading-[1.05] mb-8">
              CRAFTED<br />TO ETERNITY
            </h1>
            <div className="w-12 border-t mb-8" style={{ borderColor: 'rgba(221,194,167,0.4)' }} />
            <a href="#collection" className="bg-[#853D28] text-white text-[11px] tracking-[0.3em] px-10 py-4 hover:bg-[#6d3220] transition-colors inline-block">
              DISCOVER COLLECTION
            </a>
          </div>
        </div>

        {/* Image half */}
        <div className="w-1/2 overflow-hidden relative">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1638719802048-a6032d33c5e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
            alt="Woman wearing Mezor Jewels"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(47,60,103,0.3) 0%, transparent 30%)' }} />
        </div>
      </section>

      {/* ── Category Grid ────────────────────────────────────── */}
      <section id="collection" className="bg-[#DDC2A7]" style={{ borderTop: '0.5px solid rgba(133,61,40,0.2)', borderBottom: '0.5px solid rgba(133,61,40,0.2)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-3" style={{ borderLeft: '0.5px solid rgba(133,61,40,0.2)' }}>
            {[
              { key: 'rings', label: 'RINGS', Icon: RingIcon },
              { key: 'necklaces', label: 'NECKLACES', Icon: NecklaceIcon },
              { key: 'earrings', label: 'EARRINGS', Icon: EarringsIcon },
            ].map(({ key, label, Icon }, i) => (
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
                <p className="text-[#853D28] text-[10px] tracking-[0.4em]">VIEW</p>
                {activeCategory === key && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 border-t-2 border-[#853D28]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Center sparkle divider */}
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
          <p className="text-[#DDC2A7] text-[10px] tracking-[0.5em] mb-8">OUR ATELIER</p>
          <MezorLogo beige large />
          <div className="mt-10 w-px h-16 bg-[#DDC2A7] opacity-30" />
          <p className="mt-8 text-[#DDC2A7] text-[12px] tracking-[0.25em] max-w-xs leading-loose opacity-80">
            WHERE CRAFTSMANSHIP<br />MEETS TIMELESS ELEGANCE
          </p>
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-16">
          {/* Section header */}
          <div className="flex items-center gap-6 mb-16">
            <div className="flex-1 border-t" style={{ borderColor: 'rgba(133,61,40,0.2)' }} />
            <div className="text-center">
              <p className="text-[#853D28] text-[10px] tracking-[0.5em] mb-2">OUR COLLECTION</p>
              <h2 className="text-[32px] text-[#2F3C67] font-serif tracking-wide">Timeless Masterpieces</h2>
            </div>
            <div className="flex-1 border-t" style={{ borderColor: 'rgba(133,61,40,0.2)' }} />
          </div>

          <div className="grid grid-cols-3 gap-0" style={{ border: '0.5px solid rgba(221,194,167,0.6)' }}>
            {filtered.map((product, i) => (
              <div
                key={product._id}
                className="group relative"
                style={{ borderRight: (i + 1) % 3 !== 0 ? '0.5px solid rgba(221,194,167,0.6)' : 'none', borderBottom: i < filtered.length - 3 ? '0.5px solid rgba(221,194,167,0.6)' : 'none' }}
              >
                <div className="aspect-square overflow-hidden bg-[#f9f5f0] relative">
                  <ImageWithFallback
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <button
                    onClick={() => {
                      setTryOnOpen(true);
                      fileInputRef.current?.click();
                    }}
                    className="absolute bottom-4 right-4 bg-[#2F3C67] text-white text-[9px] tracking-[0.25em] px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    TRY ON
                  </button>
                </div>
                <div className="p-7" style={{ borderTop: '0.5px solid rgba(221,194,167,0.6)' }}>
                  <h3 className="text-[#2F3C67] text-[14px] font-serif tracking-wide mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[#853D28] text-[15px] tracking-wide">${product.price.toLocaleString()}</span>
                    <button className="text-[10px] tracking-[0.3em] text-[#2F3C67] hover:text-[#853D28] transition-colors border-b border-[#2F3C67] hover:border-[#853D28] pb-0.5">
                      VIEW
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Virtual Try-On strip ──────────────────────────── */}
      <section className="bg-[#2F3C67] py-20">
        <div className="max-w-[1400px] mx-auto px-16 flex items-center justify-between">
          <div>
            <p className="text-[#DDC2A7] text-[10px] tracking-[0.5em] mb-3">AI POWERED</p>
            <h2 className="text-[36px] text-white font-serif">Virtual Try-On Studio</h2>
            <p className="text-[#DDC2A7] text-[12px] tracking-[0.15em] mt-4 opacity-70 max-w-sm leading-relaxed">
              Upload your photo and see how our pieces look on you with AI-powered visualization.
            </p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center" style={{ borderRight: '0.5px solid rgba(221,194,167,0.2)', paddingRight: '2rem' }}>
              <p className="text-[#DDC2A7] text-[28px] font-serif">01</p>
              <p className="text-[#DDC2A7] text-[9px] tracking-[0.3em] mt-2 opacity-60">UPLOAD PHOTO</p>
            </div>
            <div className="text-center" style={{ borderRight: '0.5px solid rgba(221,194,167,0.2)', paddingRight: '2rem' }}>
              <p className="text-[#DDC2A7] text-[28px] font-serif">02</p>
              <p className="text-[#DDC2A7] text-[9px] tracking-[0.3em] mt-2 opacity-60">SELECT JEWELRY</p>
            </div>
            <div className="text-center" style={{ paddingRight: '2rem' }}>
              <p className="text-[#DDC2A7] text-[28px] font-serif">03</p>
              <p className="text-[#DDC2A7] text-[9px] tracking-[0.3em] mt-2 opacity-60">SEE THE MAGIC</p>
            </div>
            <button
              onClick={() => {
                setTryOnOpen(true);
                fileInputRef.current?.click();
              }}
              className="bg-[#853D28] text-white text-[11px] tracking-[0.3em] px-10 py-4 hover:bg-[#6d3220] transition-colors ml-4"
            >
              BEGIN
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
        </div>
      </section>

      {/* ── Brand Story ─────────────────────────────────────── */}
      <section className="bg-[#DDC2A7] py-24">
        <div className="max-w-[1400px] mx-auto px-16">
          <div className="grid grid-cols-2 gap-0" style={{ border: '0.5px solid rgba(133,61,40,0.2)' }}>
            <div className="p-16" style={{ borderRight: '0.5px solid rgba(133,61,40,0.2)' }}>
              <p className="text-[#853D28] text-[10px] tracking-[0.5em] mb-6">OUR PHILOSOPHY</p>
              <h2 className="text-[36px] text-[#2F3C67] font-serif leading-snug mb-8">
                Every Piece<br />Tells A Story
              </h2>
              <div className="w-8 border-t mb-8" style={{ borderColor: '#853D28' }} />
              <p className="text-[#2F3C67] text-[13px] tracking-[0.1em] leading-loose opacity-70 max-w-xs">
                Mezor Jewels crafts heirloom-quality pieces using only the finest precious metals and ethically sourced gemstones. Each creation is a testament to generations of artisanal mastery.
              </p>
            </div>
            <div className="relative overflow-hidden" style={{ minHeight: '400px' }}>
              <img
                src={brandImage.src}
                alt="Mezor Jewels brand identity"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0" style={{ background: 'rgba(47,60,103,0.15)' }} />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white py-20">
        <div className="max-w-[1400px] mx-auto px-16">
          <div className="max-w-3xl mx-auto" style={{ border: '0.5px solid rgba(133,61,40,0.25)' }}>
            <div className="p-12">
              <p className="text-[#853D28] text-[10px] tracking-[0.5em] mb-3">CONTACT</p>
              <h3 className="text-[30px] text-[#2F3C67] font-serif mb-8">Speak With Our Atelier</h3>
              <form onSubmit={submitContactForm} className="grid grid-cols-2 gap-4">
                <input
                  value={contactForm.name}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="border border-[#DDC2A7] px-4 py-3 text-[#2F3C67] text-[12px] tracking-[0.12em] col-span-1"
                  placeholder="NAME"
                  required
                />
                <input
                  value={contactForm.email}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="border border-[#DDC2A7] px-4 py-3 text-[#2F3C67] text-[12px] tracking-[0.12em] col-span-1"
                  placeholder="EMAIL"
                  type="email"
                  required
                />
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                  className="border border-[#DDC2A7] px-4 py-3 text-[#2F3C67] text-[12px] tracking-[0.12em] col-span-2 min-h-32"
                  placeholder="MESSAGE"
                  required
                />
                <div className="col-span-2 flex items-center justify-between">
                  <button type="submit" className="bg-[#853D28] text-white text-[11px] tracking-[0.3em] px-10 py-4 hover:bg-[#6d3220] transition-colors">
                    SEND MESSAGE
                  </button>
                  {contactStatus && <p className="text-[#2F3C67] text-[10px] tracking-[0.2em]">{contactStatus}</p>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-[#2F3C67] py-16" style={{ borderTop: '0.5px solid rgba(221,194,167,0.15)' }}>
        <div className="max-w-[1400px] mx-auto px-16 flex flex-col items-center">
          <BrandIcon size={36} color="#DDC2A7" />
          <div className="mt-6">
            <MezorLogo beige large={false} />
          </div>
          <div className="mt-10 flex items-center gap-8 text-[#DDC2A7]">
            <span className="text-[10px] tracking-[0.4em] opacity-50">TIMELESS</span>
            <span className="text-[#853D28]">·</span>
            <span className="text-[10px] tracking-[0.4em] opacity-50">ELEGANT</span>
            <span className="text-[#853D28]">·</span>
            <span className="text-[10px] tracking-[0.4em] opacity-50">REFINED</span>
          </div>
          <p className="mt-8 text-[#DDC2A7] text-[9px] tracking-[0.3em] opacity-30">
            © 2026 MEZOR JEWELS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* ── AI Try-On Modal ───────────────────────────────────── */}
      {tryOnOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(10,14,30,0.85)' }}>
          <div className="bg-[#2F3C67] w-full max-w-2xl mx-6 relative" style={{ border: '0.5px solid rgba(221,194,167,0.2)' }}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-10 py-7" style={{ borderBottom: '0.5px solid rgba(221,194,167,0.15)' }}>
              <div>
                <p className="text-[#DDC2A7] text-[9px] tracking-[0.5em] mb-1">AI POWERED</p>
                <h3 className="text-white text-[20px] font-serif tracking-wide">Virtual Try-On Studio</h3>
              </div>
              <button onClick={() => { setTryOnOpen(false); setSelectedImage(null); }} className="text-[#DDC2A7] hover:text-white transition-colors">
                <X size={18} strokeWidth={1.2} />
              </button>
            </div>

            {/* Upload area */}
            <div className="p-10">
              <div
                className="aspect-video flex flex-col items-center justify-center"
                style={{ border: '0.5px dashed rgba(221,194,167,0.25)', background: 'rgba(0,0,0,0.2)' }}
              >
                {selectedImage ? (
                  <div className="relative w-full h-full">
                    <img src={selectedImage} alt="Uploaded" className="w-full h-full object-contain" />
                    <div className="absolute bottom-0 left-0 right-0 py-4 text-center" style={{ background: 'linear-gradient(to top, rgba(47,60,103,0.9), transparent)' }}>
                      <p className="text-white text-[10px] tracking-[0.3em]">JEWELRY OVERLAY PREVIEW</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="text-[#DDC2A7] mb-6 opacity-40" size={40} strokeWidth={1} />
                    <p className="text-[#DDC2A7] text-[10px] tracking-[0.4em] mb-6 opacity-60">UPLOAD YOUR PHOTO</p>
                    <label className="cursor-pointer">
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <span className="bg-[#853D28] text-white text-[10px] tracking-[0.35em] px-8 py-3 inline-block hover:bg-[#6d3220] transition-colors">
                        SELECT IMAGE
                      </span>
                    </label>
                    {uploadingImage && <p className="text-[#DDC2A7] text-[9px] tracking-[0.3em] mt-4 opacity-60">UPLOADING...</p>}
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
