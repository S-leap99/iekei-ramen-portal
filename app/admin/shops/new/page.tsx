'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Shop {
  id: string;
  name: string;
  address: string;
}

interface Brand {
  id: string;
  name: string;
}

export default function NewShopPage() {
  const router = useRouter();
  const [allShops, setAllShops] = useState<Shop[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState({
    id: '',
    name: '',
    address: '',
    paymentMethods: '',
    twitter: '',
    parentId: '',
    lat: '',
    lng: '',
    brandId: '', // ← brandIdを追加
  });
  const [error, setError] = useState<string | null>(null);

  // 既存店舗の取得（親店舗選択用）
  useEffect(() => {
    fetch('/api/admin/shops')
      .then(res => res.json())
      .then(setAllShops)
      .catch(console.error);
  }, []);

  // ブランド一覧の取得
  useEffect(() => {
    fetch('/api/admin/brands')
      .then(res => res.json())
      .then(setBrands)
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id.trim()) {
      setError('店舗IDは必須です');
      return;
    }
    if (allShops.some(s => s.id === form.id)) {
      setError('同じIDの店舗が既に存在します');
      return;
    }
    if (!form.name.trim() || !form.address.trim()) {
      setError('店名と住所は必須です');
      return;
    }
    if (allShops.some(s => s.name === form.name && s.address === form.address)) {
      setError('同じ店名と住所の店舗が既に登録されています');
      return;
    }

    const payload = {
      id: form.id,
      name: form.name,
      address: form.address,
      paymentMethods: form.paymentMethods
        .split(',')
        .map(s => s.trim())
        .filter(s => s),
      twitter: form.twitter || undefined,
      parentId: form.parentId || undefined,
      lat: form.lat ? parseFloat(form.lat) : undefined,
      lng: form.lng ? parseFloat(form.lng) : undefined,
      brandId: form.brandId || undefined, // ← 追加
    };

    const res = await fetch('/api/admin/shops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      setError('登録に失敗しました');
      return;
    }
    router.push('/admin/shops');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">新規店舗登録</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>店舗ID
            <input
              name="id"
              value={form.id}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </label>
        </div>
        <div>
          <label>店名
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
          <label>住所
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
          <label>支払い方法（カンマ区切り）
            <input
              name="paymentMethods"
              value={form.paymentMethods}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </label>
        </div>
        <div>
          <label>Twitter URL
            <input
              name="twitter"
              value={form.twitter}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </label>
        </div>
        <div>
          <label>親店舗
            <select
              name="parentId"
              value={form.parentId}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              <option value="">――なし――</option>
              {allShops.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.id})
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>ブランド
            <select
              name="brandId"
              value={form.brandId}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              <option value="">――選択してください――</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>緯度 (lat)
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
          <label>経度 (lng)
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          登録
        </button>
      </form>
    </div>
  );
}
