import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
import '@/app/_styles/globals.css';
import Header from '@/app/_components/Header';
import Footer from './_components/Footer';
import { Toaster } from 'react-hot-toast';

const josefinSans = Josefin_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { template: '%s | VaxTracker', default: 'VaxTracker' },
  description: 'VaxTracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${josefinSans.className} text-primary-600 min-h-screen flex flex-col antialiased`}
      >
        <Header />
        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-6xl mx-auto w-full">{children}</main>
        </div>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: '8px' }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: '16px',
              maxWidth: '500px',
              padding: '16px 24px',
              backgroundColor: '#ffffff',
              color: '#374151',
            },
          }}
        />
        <Footer />
      </body>
    </html>
  );
}
