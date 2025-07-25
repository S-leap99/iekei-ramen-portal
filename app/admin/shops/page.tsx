// =============================
// app/admin/shops/page.tsx
// 店舗一覧ページ
// =============================

'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Shop {
  id: string;
  name: string;
  address: string;
  lat: number;        // 追加
  lng: number;        // 追加
  parentId?: string;  // 追加（nullableの場合は?を付ける）
  paymentMethods?: string[];
  twitter?: string;
}
export default function ShopListPage() {
  const [shops, setShops] = useState<Shop[]>([]);

  const fetchShops = async () => {
    const res = await fetch('/api/admin/shops');
    const data = await res.json();
    setShops(data);
  };

  useEffect(() => { fetchShops(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    await fetch(`/api/admin/shops/${id}`, { method: 'DELETE' });
    fetchShops();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">店舗一覧</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">店名</th>
            <th className="border px-4 py-2">住所</th>
            <th className="border px-4 py-2">緯度</th>
            <th className="border px-4 py-2">経度</th>
            <th className="border px-4 py-2">親店舗</th>
            <th className="border px-4 py-2">支払い方法</th>
            <th className="border px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {shops.map(shop => (
            <tr key={shop.id}>
              <td className="border px-4 py-2">{shop.id}</td>
              <td className="border px-4 py-2">{shop.name}</td>
              <td className="border px-4 py-2">{shop.address}</td>
              console.log(typeof shop);
              <td className="border px-4 py-2">{shop.lat}</td>
              <td className="border px-4 py-2">{shop.lng}</td>
              <td className="border px-4 py-2">{shop.parentId}</td>
              <td className="border px-4 py-2">{shop.paymentMethods.join(', ')}</td>
              <td className="border px-4 py-2 space-x-2">
                <Link href={`/admin/shops/${shop.id}/edit`} className="text-blue-500">編集</Link>
                <button onClick={() => handleDelete(shop.id)} className="text-red-500">削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}