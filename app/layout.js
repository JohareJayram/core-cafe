import './globals.css';
import { CartProvider } from '../lib/cartContext';
import { OrderProvider } from '../lib/orderContext';

export const metadata = {
  title: 'CORE Cafe — Order Freshly Brewed Coffee Without Waiting',
  description: 'Browse our full menu and order coffee, snacks & more directly from your table at CORE Cafe, Hinjwadi Pune. No waiter needed — just scan, pick, and enjoy.',
  keywords: 'cafe pune, hinjwadi cafe, order coffee online, waiterless cafe, CORE cafe, coffee hinjwadi phase 3',
  authors: [{ name: 'CORE Cafe' }],
  openGraph: {
    title: 'CORE Cafe — Order Your Way. No Waiting.',
    description: 'The premium waiterless cafe experience in Hinjwadi, Pune. Scan. Order. Enjoy.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'CORE Cafe',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CORE Cafe — Order Your Way. No Waiting.',
    description: 'Premium waiterless cafe in Hinjwadi Pune. Scan QR → Order → Enjoy.',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://corecafe.in'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Restaurant',
              name: 'CORE Cafe',
              description: 'A premium waiterless cafe in Hinjwadi Phase 3, Pune',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Hinjwadi Phase 3',
                addressLocality: 'Pune',
                addressRegion: 'Maharashtra',
                postalCode: '411057',
                addressCountry: 'IN',
              },
              telephone: '+91-98765-43210',
              url: 'https://corecafe.in',
              openingHours: ['Mo-Fr 08:00-22:00', 'Sa-Su 08:00-23:00'],
              servesCuisine: ['Coffee', 'Snacks', 'Bakery'],
              priceRange: '₹₹',
              hasMenu: 'https://corecafe.in/menu',
            }),
          }}
        />
      </head>
      <body>
        <OrderProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </OrderProvider>
      </body>
    </html>
  );
}
