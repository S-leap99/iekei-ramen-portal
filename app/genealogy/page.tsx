// app/genealogy/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import GenealogyTree from '@/components/GenealogyTree';
import { useSession } from 'next-auth/react';

export default function GenealogyPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [treeData, setTreeData] = useState<any[]>([]);
  const [stampMap, setStampMap] = useState<Record<string, 'tabetai' | 'tabetta'>>({});

  useEffect(() => {
    fetch('/api/shops/genealogy')
      .then(res => res.json())
      .then((data: any[]) => setTreeData(data))
      .catch(err => console.error('系譜データ取得エラー', err));
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/stamps?userId=${userId}`)
      .then(res => res.json())
      .then((stamps: { shopId: string; status: 'tabetai' | 'tabetta' }[]) => {
        const map: Record<string, 'tabetai' | 'tabetta'> = {};
        stamps.forEach(s => { map[s.shopId] = s.status; });
        setStampMap(map);
      })
      .catch(err => console.error('スタンプデータ取得エラー', err));
  }, [userId]);

  return (
    <div className="w-full h-screen">
      <GenealogyTree data={treeData} stampMap={stampMap} />
    </div>
  );
}