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

  // スタンプの取得（ログインしていない場合は取得しない）
  useEffect(() => {
    if (status !== 'authenticated') return;

    fetch(`/api/stamps?userId=${session!.user.id}`)
      .then(res => res.json())
      .then(stamps => {
        const stamp = stamps.find((s: any) => s.shopId === shopId);
        setStatusValue(stamp?.status ?? null);
      })
      .catch(() => setStatusValue(null));
  }, [status, session, shopId]);

  // ボタンを押したときに初めて signIn() or API呼び出し
  const handleToggle = async (newStatus: 'tabetai' | 'tabetta') => {
    if (status === 'unauthenticated') {
      signIn(); // この時点でログイン画面へ
      return;
    }

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
        onClick={() => handleToggle('tabetai')}
      >
        タベタイ
      </button>
      <button
        className={`px-4 py-2 rounded ${statusValue === 'tabetta' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        onClick={() => handleToggle('tabetta')}
      >
        タベタ
      </button>
    </div>
  );
}
