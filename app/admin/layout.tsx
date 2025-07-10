// =============================
// app/admin/layout.tsx
// 管理画面全体のレイアウト
// =============================

'use client';
import { ReactNode } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      {/* サイドバー */}
      <nav className="w-64 h-screen bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">管理コンソール</h2>
        <ul className="flex flex-col gap-2">
          <li><Link href="/admin" className="hover:underline">ダッシュボード</Link></li>
          <li><Link href="/admin/shops" className="hover:underline">店舗一覧</Link></li>
          <li><Link href="/admin/shops/new" className="hover:underline">新規登録</Link></li>
          <li><Link href="/admin/shops/import" className="hover:underline">CSVインポート</Link></li>
        </ul>
      </nav>
      {/* コンテンツ */}
      <main className="flex-1 p-6 bg-white">
        {children}
      </main>
    </div>
  );
}