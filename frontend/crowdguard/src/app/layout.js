import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/headers/header';
import { Provider } from 'jotai';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CrowdGuard',
  description: 'Your lifeline in chaos',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Provider>
          <Header />
          <Toaster />
          {children}
        </Provider>
      </body>
    </html>
  );
}
