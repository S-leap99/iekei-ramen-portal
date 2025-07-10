// components/StampToggle.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface StampToggleProps {
  shopId: string;
}

type Stamp = {
  shopId: string;
  shopName: string;
  status: 'tabetta' | 'tabetai';
};

export default function StampToggle({ shopId }: StampToggleProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [status, setStatus] = useState<Stamp['status'] | null>(null);
  const [loading, setLoading] = useState(false);

  // 初期ロードで現在のスタンプ状態を取得
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/stamps?userId=${userId}`)
      .then(res => res.json())
      .then((stamps: Stamp[]) => {
        const existing = stamps.find(s => s.shopId === shopId);
        setStatus(existing?.status ?? null);
      })
      .catch(console.error);
  }, [userId, shopId]);

  const handleToggle = async (newStatus: Stamp['status']) => {
    if (!userId) return;
    setLoading(true);
    try {
      await fetch('/api/stamps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, shopId, status: newStatus }),
      });
      setStatus(newStatus);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <p className="text-sm text-gray-500">ログインでスタンプ可能</p>;
  }

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => handleToggle('tabetta')}
        disabled={loading}
        className={`px-3 py-1 rounded ${status === 'tabetta' ? 'bg-blue-500 text-white' : 'border border-gray-300'}`}
      >
        行った
      </button>
      <button
        onClick={() => handleToggle('tabetai')}
        disabled={loading}
        className={`px-3 py-1 rounded ${status === 'tabetai' ? 'bg-green-500 text-white' : 'border border-gray-300'}`}
      >
        行きたい
      </button>
    </div>
  );
}
