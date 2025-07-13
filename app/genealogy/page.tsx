// app/genealogy/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import GenealogyTree from '@/components/GenealogyTree';

export default function GenealogyPage() {
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/api/shops/genealogy')
      .then(res => res.json())
      .then((tree: any[]) => setData(tree))
      .catch(err => {
        console.error('系譜データ取得エラー', err);
        setData([]);  // エラーでも「空配列」で止める
      });
  }, []);

  // まだ取得前
  if (data === null) {
    return <div className="w-full h-screen flex items-center justify-center">系譜図を読み込み中…</div>;
  }

  // 取得後にデータが空ならメッセージ表示（DBにデータがないケース）
  if (data.length === 0) {
    return <div className="w-full h-screen flex items-center justify-center">系譜データがありません</div>;
  }

  // データがあるときだけ描画
  return (
    <div className="w-full h-screen">
      <GenealogyTree data={data} />
    </div>
  );
}
