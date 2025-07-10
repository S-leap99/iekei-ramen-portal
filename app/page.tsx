// ==============================
// 2) app/page.tsx
// トップページ (ナビゲーション)
// ==============================
'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">家系ラーメンポータル</h1>
      <nav className="flex gap-4">
        <Link href="/map" className="px-4 py-2 bg-blue-500 text-white rounded">マップ</Link>
        <Link href="/genealogy" className="px-4 py-2 bg-green-500 text-white rounded">家系図</Link>
      </nav>
    </div>
  );
}