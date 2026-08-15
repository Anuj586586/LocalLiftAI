import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'LocalLift AI | The Ultimate AI Marketing Hub for Local Businesses',
  description: 'Skyrocket your local business growth with LocalLift AI. Automate your local SEO, generate ad copy, and respond to customer reviews in seconds.',
  keywords: 'local business marketing, AI marketing tool, local SEO software, AI review responder, small business marketing automation',
  openGraph: {
    title: 'LocalLift AI | Grow Your Local Business with AI',
    description: 'The all-in-one marketing suite for small businesses. Dominate local search, craft perfect ads, and manage reviews effortlessly with AI.',
    type: 'website',
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
