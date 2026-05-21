"use client";

import { Sparkles, Package, Gem } from "lucide-react";

export default function LuxuryUSPBanner() {
  const items = [
    { text: "Waterproof & Tarnish-Free", icon: <Sparkles size={14} strokeWidth={1} className="text-[#C4A77D]" /> },
    { text: "Free & Fast Shipping", icon: <Package size={14} strokeWidth={1} className="text-[#C4A77D]" /> },
    { text: "Premium Stainless Steel", icon: <Gem size={14} strokeWidth={1} className="text-[#C4A77D]" /> },
  ];

  // Duplicating items for an infinite, smooth marquee
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="fixed top-0 left-0 right-0 h-9 z-[60] flex items-center overflow-hidden border-b border-[#C4A77D]/20 shadow-sm"
         style={{
           // Light ivory base with a subtle satin-like linear shimmer gradient
           background: "linear-gradient(90deg, #FAF6F0 0%, #ffffff 50%, #FAF6F0 100%)",
           backgroundSize: "200% auto",
           animation: "title-shine 8s linear infinite"
         }}>
      <div className="flex w-[200%] animate-marquee">
        <div className="flex w-1/2 justify-around items-center">
          {repeatedItems.slice(0, 6).map((item, index) => (
            <div key={`block1-${index}`} className="flex items-center gap-6 px-6 whitespace-nowrap">
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-[#C4A77D] text-[10px] tracking-[0.25em] uppercase font-serif font-light">
                  {item.text}
                </span>
              </div>
              {/* Subtle vertical divider */}
              <span className="text-[#C4A77D]/30 text-[10px]">|</span>
            </div>
          ))}
        </div>
        <div className="flex w-1/2 justify-around items-center">
          {repeatedItems.slice(0, 6).map((item, index) => (
            <div key={`block2-${index}`} className="flex items-center gap-6 px-6 whitespace-nowrap">
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-[#C4A77D] text-[10px] tracking-[0.25em] uppercase font-serif font-light">
                  {item.text}
                </span>
              </div>
              {/* Subtle vertical divider */}
              <span className="text-[#C4A77D]/30 text-[10px]">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
