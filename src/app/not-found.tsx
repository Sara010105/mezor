import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <span className="text-[#853D28] text-[12px] tracking-[0.8em] uppercase mb-6">404</span>
      <h1 className="text-[32px] md:text-[42px] text-[#2F3C67] font-serif mb-8">
        Pièce Introuvable
      </h1>
      <p className="text-[#2F3C67] text-[14px] tracking-[0.1em] opacity-60 max-w-md leading-loose mb-12 uppercase">
        Le bijou que vous recherchez semble avoir disparu de notre collection ou n&apos;a jamais existé.
      </p>
      <Link 
        href="/"
        className="flex items-center gap-3 bg-[#2F3C67] text-white px-10 py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-[#1a233d] transition-colors"
      >
        <ArrowLeft size={16} />
        Retour à la boutique
      </Link>
    </div>
  );
}
