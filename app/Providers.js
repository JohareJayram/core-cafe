'use client';
import { CartProvider } from '../lib/cartContext';
import { OrderProvider } from '../lib/orderContext';

export function Providers({ children }) {
  return (
    <OrderProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </OrderProvider>
  );
}
