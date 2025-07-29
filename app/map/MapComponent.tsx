// app/map/MapComponent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSearchParams } from 'next/navigation';

interface Shop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

// 動的に中心を再設定
function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapComponent() {
  // 認証不要なので session は取得しない
  const params = useSearchParams();
  const centerId = params.get('centerId');

  const [shops, setShops] = useState<Shop[]>([]);
  const [stampMap, setStampMap] = useState<Record<string, 'tabetai' | 'tabetta'>>({});
  const [center, setCenter] = useState<[number, number]>([35.464, 139.617]);
  const [isClient, setIsClient] = useState(false);

  // クライアントサイド判定
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 全店舗とスタンプ情報の取得（stampMap は不要なら削除可）
  useEffect(() => {
    if (!isClient) return;

    fetch('/api/shops')
      .then(r => r.json())
      .then(data => setShops(data))
      .catch(err => console.error('Failed to fetch shops:', err));

    // stampMap は必要に応じて…
    // fetch(`/api/stamps?userId=${userId}`)…
  }, [isClient]);

  // 中心店舗の取得
  useEffect(() => {
    if (!isClient || !centerId) return;

    fetch(`/api/shops/${centerId}`)
      .then(r => r.json())
      .then((shop: Shop) => {
        setCenter([shop.lat, shop.lng]);
      })
      .catch(err => console.error('Failed to fetch center shop:', err));
  }, [centerId, isClient]);

  if (!isClient) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">マップを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={center}
        zoom={13}
        key={centerId ?? 'default'}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Recenter center={center} />
        {shops.map((shop) => (
          <CircleMarker
            key={shop.id}
            center={[shop.lat, shop.lng]}
            radius={10}
            pathOptions={{
              color: stampMap[shop.id] === 'tabetai' ? 'red' :
                     stampMap[shop.id] === 'tabetta' ? 'gray' : 'blue',
              fillColor:
                stampMap[shop.id] === 'tabetai' ? 'red' :
                stampMap[shop.id] === 'tabetta' ? 'gray' : 'blue',
            }}
          >
            <Popup>
              <strong>{shop.name}</strong><br />
              <a href={`/shops/${shop.id}`}>詳細</a><br />
              <a href="/genealogy">家系図</a>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
