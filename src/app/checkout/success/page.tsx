"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { clearCart } from '../../hooks/useStore';

export default function SuccessPage() {
  useEffect(() => {
    // Clear cart on successful purchase
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-[#2F3C67] flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md"
      >
        <div className="mb-10 flex justify-center">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="#DDC2A7" strokeWidth="1" />
            <motion.path
              d="M25 40L35 50L55 30"
              stroke="#DDC2A7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </svg>
        </div>

        <h1 className="text-[#DDC2A7] text-[42px] font-serif mb-4 tracking-wide">Thank You</h1>
        <p className="text-[#DDC2A7] text-[14px] tracking-[0.2em] mb-10 opacity-70 leading-relaxed uppercase">
          Your order has been received and is being prepared by our atelier.
        </p>

        <Link
          href="/"
          className="inline-block border border-[#DDC2A7] text-[#DDC2A7] text-[11px] tracking-[0.3em] px-12 py-5 hover:bg-[#DDC2A7] hover:text-[#2F3C67] transition-all duration-500"
        >
          BACK TO HOME
        </Link>
      </motion.div>

      <div className="absolute bottom-10">
        <p className="text-[#DDC2A7] text-[9px] tracking-[0.4em] opacity-30 uppercase">
          Mezor Jewels © 2026
        </p>
      </div>
    </div>
  );
}
