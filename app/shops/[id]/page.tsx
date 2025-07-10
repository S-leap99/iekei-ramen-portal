// app/shops/[id]/page.tsx
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import StampToggle from '@/components/StampToggle';

interface Shop {
  id: string;
  name: string;
  address: string;
  paymentMethods: string[];
  twitter?: string;
  lat?: number;
  lng?: number;
}

// サーバーサイドでページタイトルを動的に設定
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/shops/${id}`
  );
  const shop: Shop = await res.json();
  return { title: shop.name };
}

// 店舗詳細ページ（サーバーコンポーネント）
export default async function ShopDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/shops/${id}`,
    { cache: 'no-store' }
  );
  const shop: Shop = await res.json();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{shop.name}</h1>
      <p className="mb-2">住所: {shop.address}</p>
      <p className="mb-2">支払い方法: {shop.paymentMethods.join(', ')}</p>
      {shop.twitter && (
        <p className="mb-2">
          <a href={shop.twitter} target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </p>
      )}
      <div className="mt-4 flex gap-4">
        <Link href={`/map?centerId=${id}`} className="text-blue-500">
          マップへ
        </Link>
        <Link href="/genealogy" className="text-green-500">
          家系図へ
        </Link>
      </div>
      {/* スタンプトグル */}
      <StampToggle shopId={id} />
    </div>
  );
}