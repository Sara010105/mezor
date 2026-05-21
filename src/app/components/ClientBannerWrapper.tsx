'use client';

import { usePathname } from 'next/navigation';
import LuxuryUSPBanner from './LuxuryUSPBanner';

export default function ClientBannerWrapper() {
  const pathname = usePathname();

  // Hide the banner on admin pages and login page
  if (pathname.startsWith('/mezorAdminDash') || pathname.startsWith('/login')) {
    return null;
  }

  return <LuxuryUSPBanner />;
}
