// =============================
// components/GenealogyTree.tsx
// 系譜図表示・ノードクリック対応
// =============================

'use client';

import React, { useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type {
  RenderCustomNodeElementFn,
  CustomNodeElementProps,
} from 'react-d3-tree';

const Tree: any = dynamic(() => import('react-d3-tree'), { ssr: false });

interface NodeDatum {
  name: string;
  attributes: { id: string };
  children?: NodeDatum[];
}

interface Shop {
  id: string;
  name: string;
  address: string;
  brandId?: string | null;
}

export default function GenealogyTree({ data }: { data: NodeDatum[] }) {
  const router = useRouter();

  const [stampMap, setStampMap] = useState<Record<string, 'tabetai' | 'tabetta'>>({});
  const [selectedNode, setSelectedNode] = useState<NodeDatum | null>(null);
  const [relatedShops, setRelatedShops] = useState<Shop[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string>('');
  const [shouldShowShopSelect, setShouldShowShopSelect] = useState(false);
  const [brandIdPresent, setBrandIdPresent] = useState(false);
  const [panelReady, setPanelReady] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      const nodeId = selectedNode.attributes.id;
      console.log('🔍 Selected node:', selectedNode.name, 'nodeId:', nodeId);
      
      if (!nodeId) {
        console.log('❌ No nodeId found');
        setBrandIdPresent(false);
        setRelatedShops([]);
        setSelectedShopId('');
        setShouldShowShopSelect(false);
        setPanelReady(true);
        return;
      }

      console.log('📡 Fetching shops for nodeId:', nodeId);
      fetch(`/api/shops?brand=${nodeId}`)
        .then(res => res.json())
        .then(data => {
          console.log('📦 Raw API response:', data);
          const validShops = (data || []).filter((shop: Shop) => shop.brandId === nodeId);
          console.log('✅ Valid shops filtered:', validShops);
          
          if (validShops.length > 0) {
            // ブランドIDを持つ複数店舗の場合
            console.log('🏢 Brand with multiple shops');
            setRelatedShops(validShops);
            setBrandIdPresent(true);
            setShouldShowShopSelect(validShops.length > 1);
            
            if (validShops.length === 1) {
              console.log('🎯 Auto-selecting single brand shop:', validShops[0]);
              setSelectedShopId(validShops[0].id);
            } else {
              console.log('🔄 Multiple brand shops found, requiring selection');
              setSelectedShopId('');
            }
          } else {
            // ブランドIDがない単一店舗の場合、nodeIdを直接Shop.idとして扱う
            console.log('🏪 Single shop without brandId, using nodeId as shopId:', nodeId);
            setBrandIdPresent(false);
            setRelatedShops([]);
            setSelectedShopId(nodeId);
            setShouldShowShopSelect(false);
          }
          
          setPanelReady(true);
        })
        .catch(err => {
          console.error('❌ 関連店舗取得エラー:', err);
          // エラーの場合もnodeIdを直接Shop.idとして扱う
          console.log('🏪 Error occurred, fallback to using nodeId as shopId:', nodeId);
          setBrandIdPresent(false);
          setRelatedShops([]);
          setSelectedShopId(nodeId);
          setShouldShowShopSelect(false);
          setPanelReady(true);
        });
    } else {
      console.log('🚫 No node selected, resetting state');
      setRelatedShops([]);
      setSelectedShopId('');
      setShouldShowShopSelect(false);
      setBrandIdPresent(false);
      setPanelReady(false);
    }
  }, [selectedNode]);

  const handleNodeClick = useCallback(
    (nodeDatum: NodeDatum, evt: React.MouseEvent) => {
      evt.stopPropagation();
      setSelectedNode(nodeDatum);
    },
    []
  );

  const handleBackgroundClick = (evt: React.MouseEvent) => {
    if (evt.currentTarget === evt.target) setSelectedNode(null);
  };

  const renderRectNode: RenderCustomNodeElementFn = (props) => {
    const nodeDatum = (props as CustomNodeElementProps).nodeDatum as unknown as NodeDatum;
    const status = stampMap[nodeDatum.attributes.id];
    const fillColor =
      status === 'tabetai' ? '#ef4444'
      : status === 'tabetta' ? '#9ca3af'
      : '#f3f4f6';

    return (
      <g style={{ pointerEvents: 'all', cursor: 'pointer' }} onClick={evt => handleNodeClick(nodeDatum, evt)}>
        <rect width={100} height={160} x={-50} y={-80} rx={8} ry={10} fill={fillColor} stroke="#4b5563" strokeWidth={2} />
        <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" style={{ writingMode: 'vertical-rl', fontSize: '14px', pointerEvents: 'none', fill: '#1f2937' }}>
          {nodeDatum.name}
        </text>
      </g>
    );
  };

  const renderCustomLinkElement = (linkProps: any) => {
    const { source, target } = linkProps;
    return (
      <path
        d={`M${source.x},${source.y + 80} L${target.x},${target.y - 80}`}
        fill="none"
        stroke="#4b5563"
        strokeWidth={2}
      />
    );
  };

  // ナビゲーション用のshopIdを取得する関数
  const getNavigationShopId = () => {
    if (selectedShopId) return selectedShopId;
    if (relatedShops.length === 1) return relatedShops[0].id;
    // フォールバックとしてnodeIdを返す
    return selectedNode?.attributes.id || '';
  };

  return (
    <div className="w-full h-screen relative" onClick={handleBackgroundClick}>
      <div className="relative z-10 w-full h-full">
        <Tree
          data={data}
          orientation="vertical"
          translate={{ x: 300, y: 100 }}
          nodeSize={{ x: 120, y: 200 }}
          separation={{ siblings: 1.5, nonSiblings: 2 }}
          renderCustomNodeElement={renderRectNode}
          renderCustomLinkElement={renderCustomLinkElement}
          collapsible={false}
        />
      </div>

      {selectedNode && panelReady && (
        <>
          <div
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9998 }}
            onClick={() => setSelectedNode(null)}
          />
          <div
            style={{ position: 'fixed', top: 0, right: 0, width: '360px', height: '100vh', backgroundColor: 'white', boxShadow: '-2px 0 10px rgba(0,0,0,0.1)', zIndex: 9999, padding: '24px', overflowY: 'auto' }}
          >
            <button
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
              onClick={() => setSelectedNode(null)}
            >
              ×
            </button>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#1f2937' }}>
              {selectedNode.name}
            </h2>

            {brandIdPresent && shouldShowShopSelect && relatedShops.length > 1 && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontWeight: 500, marginBottom: '8px' }}>店舗を選択：</p>
                <select
                  value={selectedShopId}
                  onChange={e => setSelectedShopId(e.target.value)}
                  style={{ width: '100%', padding: '8px' }}
                >
                  <option value="">選択してください</option>
                  {relatedShops.map(shop => (
                    <option key={shop.id} value={shop.id}>
                      {shop.name}（{shop.address}）
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 単一店舗（ブランドIDなし）の場合の表示を追加 */}
            {!brandIdPresent && selectedShopId && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontWeight: 500, marginBottom: '8px' }}>店舗：</p>
                <p style={{ padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                  {selectedNode.name}
                </p>
              </div>
            )}

            {/* 単一店舗の場合の表示を追加 */}
            {brandIdPresent && relatedShops.length === 1 && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontWeight: 500, marginBottom: '8px' }}>店舗：</p>
                <p style={{ padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                  {relatedShops[0].name}（{relatedShops[0].address}）
                </p>
              </div>
            )}

            {/* ナビゲーションボタンの表示条件を修正 */}
            {console.log('🎮 Rendering navigation section:', {
              brandIdPresent,
              relatedShopsLength: relatedShops.length,
              selectedShopId,
              shouldShow: (!brandIdPresent || relatedShops.length === 1 || selectedShopId)
            })}
            {(!brandIdPresent || relatedShops.length === 1 || selectedShopId) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  onClick={() => {
                    const shopId = getNavigationShopId();
                    console.log('🏪 Navigating to shop details:', shopId);
                    router.push(`/shops/${shopId}`);
                  }}
                >
                  店舗詳細
                </button>
                <button
                  style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  onClick={() => {
                    const shopId = getNavigationShopId();
                    console.log('🗺️ Navigating to map:', shopId);
                    router.push(`/map?centerId=${shopId}`);
                  }}
                >
                  マップ
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}