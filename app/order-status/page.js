import { Suspense } from 'react';
import OrderStatusClient from './OrderStatusClient';

export const metadata = {
  title: 'Order Status — CORE Cafe',
  description: 'Track your live order at CORE Cafe. See real-time kitchen updates from placed to served.',
};

export default function OrderStatusPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0A0A0A' }} />}>
      <OrderStatusClient />
    </Suspense>
  );
}
