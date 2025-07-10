// =============================
// app/admin/shops/new/page.tsx
// 新規登録ページ
// =============================

'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewShopPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', address: '', paymentMethods: '', twitter: '', lat: '', lng: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 重複チェック
    try {
      const dupRes = await fetch(`/api/admin/shops?search=${encodeURIComponent(form.name)}`);
      const dupData = await dupRes.json();
      if (dupData.some((s: any) => s.name === form.name && s.address === form.address)) {
        setError('同じ店名と住所の店舗が既に登録されています。');
        return;
      }
    } catch (err) {
      console.error('重複チェックエラー', err);
    }
    // 登録リクエスト
    await fetch('/api/admin/shops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        address: form.address,
        paymentMethods: form.paymentMethods.split(',').map(s => s.trim()),
        twitter: form.twitter || undefined,
      }),
    });
    router.push('/admin/shops');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">新規店舗登録</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>店名<input name="name" value={form.name} onChange={handleChange} className="border p-2 w-full" required /></label>
        </div>
        <div>
          <label>住所<input name="address" value={form.address} onChange={handleChange} className="border p-2 w-full" required /></label>
        </div>
        <div>
          <label>支払い方法 (カンマ区切り)<input name="paymentMethods" value={form.paymentMethods} onChange={handleChange} className="border p-2 w-full" /></label>
        </div>
        <div>
          <label>Twitter URL<input name="twitter" value={form.twitter} onChange={handleChange} className="border p-2 w-full" /></label>
        </div>
        <div>
          <label>緯度<input name="lat" value={form.lat} onChange={handleChange} required /></label>
        </div>
        <div>
          <label>経度<input name="lng" value={form.lng} onChange={handleChange} required /></label>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">登録</button>
      </form>
    </div>
  );
}