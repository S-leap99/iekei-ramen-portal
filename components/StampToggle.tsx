// components/StampToggle.tsx
'use client'

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

interface StampToggleProps {
  shopId: string;
}

export default function StampToggle({ shopId }: StampToggleProps) {
  const { data: session, status } = useSession();
  const [statusValue, setStatusValue] = useState<'tabetai' | 'tabetta' | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(); // ← 認証されていなければ即座にサインイン画面へ
      return;
    }

    if (!session) return;

    fetch(`/api/stamps?userId=${session.user.id}`)
      .then(res => res.json())
      .then(stamps => {
        const stamp = stamps.find((s: any) => s.shopId === shopId);
        setStatusValue(stamp?.status ?? null);
      })
      .catch(() => setStatusValue(null));
  }, [status, session, shopId]);

  const toggleStatus = async (newStatus: 'tabetai' | 'tabetta') => {
    if (!session) return;
    setLoading(true);
    await fetch('/api/stamps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session.user.id,
        shopId,
        status: newStatus,
      }),
    });
    setStatusValue(newStatus);
    setLoading(false);
  };

  if (status === 'loading' || loading) return <p>読み込み中...</p>;

  return (
    <div className="flex gap-4 mt-4">
      <button
        className={`px-4 py-2 rounded ${statusValue === 'tabetai' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
        onClick={() => toggleStatus('tabetai')}
      >
        タベタイ
      </button>
      <button
        className={`px-4 py-2 rounded ${statusValue === 'tabetta' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        onClick={() => toggleStatus('tabetta')}
      >
        タベタ
      </button>
    </div>
  );
}
