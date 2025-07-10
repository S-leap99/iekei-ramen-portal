// app/admin/shops/import/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ShopRow {
  id: string;
  name: string;
  address: string;
  paymentMethods: string;
  twitter?: string;
  parentId?: string;
  lat?: string;
  lng?: string;
  errors: string[];
}

export default function ImportShopsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ShopRow[]>([]);
  const [existing, setExisting] = useState<{ name: string; address: string; id: string }[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  // 既存データ取得（重複チェック用）
  useEffect(() => {
    fetch('/api/admin/shops')
      .then(res => res.json())
      .then(data => setExisting(data))
      .catch(err => console.error(err));
  }, []);

  // ファイル選択ハンドラ
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalError(null);
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  // CSV の読み込みとプレビュー生成
  const handleParse = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      const header = lines[0].split(',').map(h => h.trim());
      const expected = ['id','name','address','paymentMethods','twitter','parentId','lat','lng'];
      // 必須ヘッダ確認
      if (!expected.every(h => header.includes(h))) {
        setGlobalError(`CSV ヘッダは ${expected.join(', ')} の順番で存在する必要があります`);
        return;
      }
      const newRows: ShopRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const obj: any = {};
        header.forEach((h, idx) => { obj[h] = values[idx] ?? ''; });
        const errs: string[] = [];
        // 必須チェック
        if (!obj.id) errs.push('IDが空です');
        if (!obj.name) errs.push('店名が空です');
        if (!obj.address) errs.push('住所が空です');
        // 既存重複チェック
        if (existing.some(s => s.id === obj.id)) errs.push('IDが既存と重複');
        if (existing.some(s => s.name === obj.name && s.address === obj.address)) errs.push('店名+住所が既存と重複');
        // 行内重複チェック
        if (newRows.some(r => r.id === obj.id)) errs.push('ファイル内でID重複');
        if (newRows.some(r => r.name === obj.name && r.address === obj.address)) errs.push('ファイル内で店名+住所重複');
        newRows.push({
          id: obj.id,
          name: obj.name,
          address: obj.address,
          paymentMethods: obj.paymentMethods,
          twitter: obj.twitter,
          parentId: obj.parentId,
          lat: obj.lat,
          lng: obj.lng,
          errors: errs,
        });
      }
      setRows(newRows);
    };
    reader.readAsText(file, 'utf-8');
  };

  // インポート実行
  const handleImport = async () => {
    setImporting(true);
    for (const row of rows) {
      if (row.errors.length) continue;
      try {
        await fetch('/api/admin/shops', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: row.id,
            name: row.name,
            address: row.address,
            paymentMethods: row.paymentMethods.split(',').map((v:any) => v.trim()),
            twitter: row.twitter || undefined,
            parentId: row.parentId || undefined,
            lat: row.lat ? parseFloat(row.lat) : undefined,
            lng: row.lng ? parseFloat(row.lng) : undefined,
          }),
        });
      } catch (e) {
        console.error(e);
      }
    }
    setImporting(false);
    router.push('/admin/shops');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CSV 一括インポート</h1>
      {globalError && <p className="text-red-600 mb-2">{globalError}</p>}
      <div className="mb-4">
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button onClick={handleParse} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded" disabled={!file}>
          プレビュー表示
        </button>
      </div>
      {rows.length > 0 && (
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">行</th>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">店名</th>
                <th className="border px-2 py-1">住所</th>
                <th className="border px-2 py-1">エラー</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={r.errors.length ? 'bg-red-50' : ''}>
                  <td className="border px-2 py-1">{i + 2}</td>
                  <td className="border px-2 py-1">{r.id}</td>
                  <td className="border px-2 py-1">{r.name}</td>
                  <td className="border px-2 py-1">{r.address}</td>
                  <td className="border px-2 py-1 text-red-600">
                    {r.errors.map((e, idx) => <div key={idx}>{e}</div>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        onClick={handleImport}
        disabled={rows.some(r => r.errors.length) || importing}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        {importing ? 'インポート中...' : 'インポート実行'}
      </button>
    </div>
  );
}
