import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { ThemeToggle } from '@/components/theme-toggle';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'MarketMind — AI Marketing Consultant',
  description: 'Turn your product into a selling machine with AI-powered marketing strategies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="pointer-events-none fixed right-4 top-4 z-[200] flex justify-end md:right-6 md:top-5">
            <div className="pointer-events-auto">
              <ThemeToggle />
            </div>
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
