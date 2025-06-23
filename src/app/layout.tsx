import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/contexts/auth-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Grock | Instant Gift Cards & Memberships',
    template: '%s | Grock',
  },
  description: 'Instantly buy and send digital gift cards and membership vouchers for top brands like Amazon, Steam, Netflix, and Spotify. The perfect gift, every time.',
  keywords: ['gift cards', 'digital gift cards', 'egift cards', 'membership vouchers', 'amazon', 'steam', 'netflix', 'spotify', 'google play'],
  openGraph: {
    title: 'Grock | Instant Gift Cards & Memberships',
    description: 'Instantly buy and send digital gift cards and membership vouchers for top brands.',
    url: 'https://grock.com',
    siteName: 'Grock',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grock | Instant Gift Cards & Memberships',
    description: 'Instantly buy and send digital gift cards and membership vouchers for top brands.',
    images: ['https://placehold.co/1200x630.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} dark`}>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className={cn("font-body antialiased")}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
