// app/map/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

// React Leafletコンポーネントを動的インポート（SSRを無効化）
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface Shop { 
  id: string; 
  name: string; 
  address: string; 
  lat: number; 
  lng: number; 
}

// 動的に中心を再設定するコンポーネントも動的インポート
const Recenter = dynamic(
  () => import('react-leaflet').then((mod) => {
    const { useMap } = mod;
    return function RecenterComponent({ center }: { center: [number, number] }) {
      const map = useMap();
      useEffect(() => { 
        map.setView(center, map.getZoom()); 
      }, [center, map]);
      return null;
    };
  }),
  { ssr: false }
);

export default function MapPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const params = useSearchParams();
  const centerId = params.get('centerId');
  const [shops, setShops] = useState<Shop[]>([]);
  const [stampMap, setStampMap] = useState<Record<string, 'tabetai' | 'tabetta'>>({});
  const [center, setCenter] = useState<[number, number]>([35.464, 139.617]);
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでのみレンダリングするためのフラグ
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    fetch('/api/shops').then(r => r.json()).then(data => setShops(data));
    if (userId) {
      fetch(`/api/stamps?userId=${userId}`)
        .then(r => r.json())
        .then((stamps: any[]) => {
          const m: any = {};
          stamps.forEach(s => m[s.shopId] = s.status);
          setStampMap(m);
        });
    }
  }, [userId]);

  useEffect(() => {
    if (centerId) {
      fetch(`/api/shops/${centerId}`)
        .then(r => r.json())
        .then((shop: Shop) => {
          setCenter([shop.lat, shop.lng]);
        });
    }
  }, [centerId]);

  // クライアントサイドでない場合はローディング表示
  if (!isClient) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div>地図を読み込み中...</div>
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
        {shops.map(shop => {
          const status = stampMap[shop.id];
          const color = status === 'tabetai' ? 'red' : status === 'tabetta' ? 'gray' : 'blue';
          return (
            <CircleMarker 
              key={shop.id} 
              center={[shop.lat, shop.lng]} 
              radius={10}
              pathOptions={{ color, fillColor: color }}
            >
              <Popup>
                <strong>{shop.name}</strong><br/>
                <a href={`/shops/${shop.id}`}>詳細</a><br/>
                <a href="/genealogy">家系図</a>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}