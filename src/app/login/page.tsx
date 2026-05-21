'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Identifiants incorrects');
      } else {
        router.push('/mezorAdminDash');
        router.refresh();
      }
    } catch (err) {
      setError('Identifiants incorrects');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white p-10 border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-sm">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-light text-gray-900 tracking-[0.2em] uppercase mb-2">
            Mezor
          </h1>
          <p className="text-xs tracking-widest text-gray-400 uppercase">
            Administration
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 text-xs tracking-wider text-center text-red-800 bg-red-50/50 border border-red-100 rounded-sm animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@mezor.com"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors bg-white placeholder-gray-300 font-light"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-widest">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors bg-white placeholder-gray-300 font-light"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1A1A1A] hover:bg-black text-white font-light py-4 px-4 rounded-sm transition-all duration-300 uppercase tracking-[0.15em] text-xs mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
