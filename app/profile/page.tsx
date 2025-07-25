// app/profile/page.tsx
import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '/lib/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'マイページ',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return (
      <div className="p-4">
        <p>ログインが必要です</p>
        <Link href="/auth/signin" className="text-blue-500">サインイン</Link>
      </div>
    );
  }
  // スタンプ取得
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/stamps?userId=${session.user.id}`,
    { cache: 'no-store' }
  );
  const stamps: Array<{ shopId: string; shopName: string; status: string }> = await res.json();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">マイページ</h1>
      <p className="mb-2">ようこそ、{session.user.email} さん！</p>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">行ったお店 (タベタ)</h2>
        {stamps.filter(s => s.status === 'tabetta').length === 0 ? (
          <p>まだありません</p>
        ) : (
          <ul>
            {stamps
              .filter(s => s.status === 'tabetta')
              .map(s => (
                <li key={s.shopId}>{s.shopName}</li>
              ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">行きたいお店 (タベタイ)</h2>
        {stamps.filter(s => s.status === 'tabetai').length === 0 ? (
          <p>まだありません</p>
        ) : (
          <ul>
            {stamps
              .filter(s => s.status === 'tabetai')
              .map(s => (
                <li key={s.shopId}>{s.shopName}</li>
              ))}
          </ul>
        )}
      </section>
    </div>
  );
}