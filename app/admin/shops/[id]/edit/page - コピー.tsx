// app/admin/shops/[id]/edit/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Shop {
  id: string;
  name: string;
  address: string;
  paymentMethods: string[];
  twitter?: string;
  lat?: number;
  lng?: number;
}

export default function EditShopPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    address: '',
    paymentMethods: '',
    twitter: '',
    lat: '',
    lng: '',
  });
  const [error, setError] = useState<string | null>(null);

  // 初期データ読み込み
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/shops/${id}`);
        if (!res.ok) throw new Error('店舗情報の取得に失敗しました');
        const data: Shop = await res.json();
        setForm({
          name: data.name,
          address: data.address,
          paymentMethods: data.paymentMethods.join(', '),
          twitter: data.twitter || '',
          lat: data.lat != null ? String(data.lat) : '',
          lng: data.lng != null ? String(data.lng) : '',
        });
      } catch (e) {
        console.error(e);
        setError('初期データの読み込みに失敗しました');
      }
    })();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 必須チェック
    if (!form.name.trim() || !form.address.trim()) {
      setError('店名と住所は必須です');
      return;
    }
    // 重複チェック
    try {
      const dupRes = await fetch(`/api/admin/shops?search=${encodeURIComponent(form.name)}`);
      const dupData: Shop[] = await dupRes.json();
      if (dupData.some(s => s.id !== id && s.name === form.name && s.address === form.address)) {
        setError('同じ店名と住所の店舗が既に存在します');
        return;
      }
    } catch (err) {
      console.error('重複チェックエラー', err);
    }
    // 送信
    try {
      const payload = {
        name: form.name,
        address: form.address,
        paymentMethods: form.paymentMethods
          .split(',')
          .map(s => s.trim())
          .filter(s => s),
        twitter: form.twitter || undefined,
        lat: form.lat ? parseFloat(form.lat) : undefined,
        lng: form.lng ? parseFloat(form.lng) : undefined,
      };
      const res = await fetch(`/api/admin/shops/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('更新に失敗しました');
      router.push('/admin/shops');
    } catch (e) {
      console.error(e);
      setError('保存中にエラーが発生しました');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">店舗編集</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>
            店名
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </label>
        </div>
        <div>
          <label>
            住所
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </label>
        </div>
        <div>
          <label>
            支払い方法（カンマ区切り）
            <input
              name="paymentMethods"
              value={form.paymentMethods}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </label>
        </div>
        <div>
          <label>
            Twitter URL
            <input
              name="twitter"
              value={form.twitter}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </label>
        </div>
        <div>
          <label>
            緯度 (lat)
            <input
              name="lat"
              type="number"
              step="any"
              value={form.lat}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </label>
        </div>
        <div>
          <label>
            経度 (lng)
            <input
              name="lng"
              type="number"
              step="any"
              value={form.lng}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </label>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          保存
        </button>
      </form>
    </div>
  );
}
