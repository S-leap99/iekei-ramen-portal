// app/layout.tsx
import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import Providers from '@/components/Providers';

export const metadata = {
  title: '家系ラーメンポータル',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          <header className="p-4 bg-gray-100">
            <nav className="flex gap-4">
              <Link href="/" className="text-blue-600">トップ</Link>
              <Link href="/map" className="text-blue-600">マップ</Link>
              <Link href="/genealogy" className="text-blue-600">家系図</Link>
              <Link href="/profile" className="text-blue-600">マイページ</Link>
            </nav>
          </header>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
