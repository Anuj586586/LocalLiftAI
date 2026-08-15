import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { AuthProvider } from '@/lib/auth-context';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'LocalLift AI',
  description: 'AI Marketing App for local businesses',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
