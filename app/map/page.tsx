// app/map/page.tsx
'use client';

import React from 'react';
import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

// MapComponent を動的インポートしてSSRを無効化
const MapComponent = dynamicImport(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">マップを読み込み中...</p>
      </div>
    </div>
  )
});

export default function MapPage() {
  return <MapComponent />;
}