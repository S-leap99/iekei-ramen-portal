// app/map/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Leafletマーカーアイコン設定
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

interface Shop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

// 中心座標を動的に再設定するコンポーネント
function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapPage() {
  const searchParams = useSearchParams();
  const centerId = searchParams.get('centerId');

  const [shops, setShops] = useState<Shop[]>([]);
  const [center, setCenter] = useState<[number, number]>([35.464, 139.617]);

  // 全店舗取得
  useEffect(() => {
    fetch('/api/shops')
      .then(res => res.json())
      .then((data: any[]) => {
        const loaded = data.map(shop => ({
          id: shop.id,
          name: shop.name,
          address: shop.address,
          lat: shop.lat ?? 35.464,
          lng: shop.lng ?? 139.617,
        }));
        setShops(loaded);
      });
  }, []);

  // 中心店舗が指定されていれば、その店舗の座標を取得
  useEffect(() => {
    if (centerId) {
      fetch(`/api/shops/${centerId}`)
        .then(res => res.json())
        .then((shop: Shop) => {
          if (shop.lat != null && shop.lng != null) {
            setCenter([shop.lat, shop.lng]);
          }
        })
        .catch(() => {});
    }
  }, [centerId]);

  return (
    <div className="w-full h-screen">
      <MapContainer
        key={centerId ?? 'default'}
        center={center}
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Recenter center={center} />
        {shops.map(shop => (
          <Marker key={shop.id} position={[shop.lat, shop.lng]}>  
            <Popup>
              <div className="flex flex-col gap-2">
                <strong>{shop.name}</strong>
                <Link href={`/shops/${shop.id}`}>詳細</Link>
                <Link href="/genealogy">家系図</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
