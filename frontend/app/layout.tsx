import { ReactNode } from 'react';
import { CartProvider } from './cart-provider';
import './globals.css';

export const metadata = {
  title: 'YO! GREEK - Greek Yogurt Shop',
  description: 'Premium Greek yogurt products',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
} 