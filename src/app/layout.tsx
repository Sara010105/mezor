import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/index.css';

export const metadata: Metadata = {
  title: 'Mezor Jewels',
  description: 'Mezor Jewels',
};

import { Toaster } from 'sonner';

import ClientBannerWrapper from './components/ClientBannerWrapper';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientBannerWrapper />
        {children}
        <Toaster position="bottom-right" toastOptions={{
          style: { background: '#2F3C67', color: '#DDC2A7', border: '1px solid rgba(221,194,167,0.2)' }
        }} />
      </body>
    </html>
  );
}

