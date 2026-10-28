import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Vinka — Muy Pronto | Espacios Únicos & Momentos Inolvidables',
  description: 'Vinka está transformando la forma de descubrir, rentar y organizar eventos en locaciones exclusivas. Participa en nuestra preventa y encuestas.',
  icons: {
    icon: '/logo-coffee.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
