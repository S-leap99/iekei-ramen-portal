// app/admin/shops/[id]/edit/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Shop {
  id: string;
  name: string;
  address: string;
}

export default function EditShopPage() {
  const router = useRouter();
  const { id } = useParams();
  const [allShops, setAllShops] = useState<Shop[]>([]);
  const [form, setForm] = useState({
    id: '',
    name: '',
    address: '',
    paymentMethods: '',
    twitter: '',
    parentId: '',
    lat: '',
    lng: ''
  });
  const [error, setError] = useState<string | null>(null);

  // 既存店舗一覧（親選択＆ID重複チェック用）
  useEffect(() => {
    fetch('/api/admin/shops')
      .then(res => res.json())
      .then(setAllShops)
      .catch(console.error);
  }, []);

  // 編集対象データ読み込み
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/admin/shops/${id}`);
      if (!res.ok) {
        setError('店舗情報の取得に失敗しました');
        return;
      }
      const data = await res.json();
      setForm({
        id: data.id,
        name: data.name,
        address: data.address,
        paymentMethods: data.paymentMethods.join(', '),
        twitter: data.twitter || '',
        parentId: data.parentId || '',
        lat: data.lat != null ? String(data.lat) : '',
        lng: data.lng != null ? String(data.lng) : ''
      });
    })();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 基本バリデーション
    if (!form.id.trim() || !form.name.trim() || !form.address.trim()) {
      setError('ID・店名・住所は必須です');
      return;
    }
    // ID重複チェック（自身を除く）
    if (allShops.some(s => s.id === form.id && s.id !== id)) {
      setError('同じIDの店舗が既に存在します');
      return;
    }
    // 店名＋住所重複チェック
    if (
      allShops.some(s =>
        s.id !== id &&
        s.name === form.name &&
        s.address === form.address
      )
    ) {
      setError('同じ店名と住所の店舗が既に存在します');
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
    };

    const res = await fetch(`/api/admin/shops/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      setError('保存に失敗しました');
      return;
    }
    router.push('/admin/shops');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">店舗編集</h1>
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
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          保存
        </button>
      </form>
    </div>
  );
}
