// app/genealogy/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import GenealogyTree from '@/components/GenealogyTree';

export default function GenealogyPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/shops/genealogy')
      .then(res => res.json())
      .then((tree: any[]) => {
      console.log('系譜API:', tree);
      setData(tree);
      })
      .catch(err => console.error('系譜データ取得エラー', err));
  }, []);

  return (
    <div className="w-full h-screen">
      <GenealogyTree data={data} />
    </div>
  );
}
