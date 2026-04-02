'use client';

import { usePathname } from 'next/navigation';
import FloatingContact from '@/components/ui/FloatingContact';

export default function FloatingContactProvider() {
  const pathname = usePathname();

  // Hide on admin and login pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  return <FloatingContact />;
}
