import { Suspense } from 'react';
import MenuPageClient from './MenuPageClient';

export const metadata = {
  title: 'Menu — CORE Cafe | Coffee, Snacks & More | Hinjwadi Pune',
  description: 'Browse CORE Cafe\'s full menu. Signature espressos, cold brews, fresh-baked pastries and snacks. Order directly from your table in Hinjwadi Phase 3, Pune.',
};

export default function MenuPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0A0A0A' }} />}>
      <MenuPageClient />
    </Suspense>
  );
}
