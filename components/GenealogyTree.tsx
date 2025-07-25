// components/GenealogyTree.tsx
'use client';

import React, { useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// SSR をオフにしてクライアントでのみ読み込む
const Tree = dynamic(() => import('react-d3-tree'), { ssr: false });

interface NodeDatum {
  name: string;
  attributes: {
    id: string;
  };
  children?: NodeDatum[];
}

export default function GenealogyTree({ data }: { data: NodeDatum[] }) {
  const router = useRouter();
  const { data: session } = useSession();

  // スタンプ状態マップを空オブジェクトで初期化
  const [stampMap, setStampMap] = useState<Record<string, 'tabetai' | 'tabetta'>>({});

  // 選択中ノード。null ならパネル非表示
  const [selectedNode, setSelectedNode] = useState<NodeDatum | null>(null);

  // デバッグ用のuseEffect
  useEffect(() => {
    console.log('selectedNode state changed:', selectedNode);
  }, [selectedNode]);

  // マウント時にユーザーのスタンプ情報を取得して stampMap を構築
  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/stamps?userId=${session.user.id}`)
      .then(res => res.json())
      .then((stamps: { shopId: string; status: 'tabetai' | 'tabetta' }[]) => {
        const map: Record<string, 'tabetai' | 'tabetta'> = {};
        stamps.forEach(s => {
          map[s.shopId] = s.status;
        });
        setStampMap(map);
      })
      .catch(err => {
        console.error('スタンプ情報取得エラー', err);
      });
  }, [session]);

  // ノードクリックハンドラを簡潔に
  const handleNodeClick = useCallback((nodeDatum: NodeDatum, evt: React.MouseEvent) => {
    console.log('handleNodeClick called for:', nodeDatum.name);
    evt.preventDefault();
    evt.stopPropagation();
    
    setSelectedNode(prevSelected => {
      console.log('Previous selected:', prevSelected?.name || 'null');
      console.log('New selected:', nodeDatum.name);
      return nodeDatum;
    });
  }, []);

  // 背景クリックでパネルを閉じる
  const handleBackgroundClick = (evt: React.MouseEvent) => {
    if (evt.currentTarget === evt.target) {
      setSelectedNode(null);
    }
  };

  // カスタムノード描画：色分け + クリック
  const renderRectNode = ({ nodeDatum }: { nodeDatum: NodeDatum }) => {
    const status = stampMap[nodeDatum.attributes.id];
    const fillColor =
      status === 'tabetai'
        ? '#ef4444'
        : status === 'tabetta'
        ? '#9ca3af'
        : '#f3f4f6';

    return (
      <g
        style={{ pointerEvents: 'all', cursor: 'pointer' }}
        onClick={(evt) => handleNodeClick(nodeDatum, evt)}
      >
        <rect
          width={100}
          height={160}
          x={-50}
          y={-80}
          rx={8}
          ry={8}
          fill={fillColor}
          stroke="#4b5563"
          strokeWidth={2}
        />
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            writingMode: 'vertical-rl',
            fontSize: '14px',
            pointerEvents: 'none',
            fill: '#1f2937',
          }}
        >
          {nodeDatum.name}
        </text>
      </g>
    );
  };

  // カスタムリンク描画：短辺中心同士を直線接続
  const renderCustomLinkElement = ({ source, target }: any) => {
    const startX = source.x;
    const startY = source.y + 80;
    const endX = target.x;
    const endY = target.y - 80;
    return (
      <path
        d={`M${startX},${startY} L${endX},${endY}`}
        fill="none"
        stroke="#4b5563"
        strokeWidth={2}
      />
    );
  };

  return (
    <div className="w-full h-screen relative" onClick={handleBackgroundClick}>
      {/* Tree コンテナの z-index を明示的に設定 */}
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

      {selectedNode && (
        <>
          {console.log('Rendering side panel for:', selectedNode.name)}
          {/* オーバーレイ */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998,
            }}
            onClick={() => setSelectedNode(null)}
          />

          {/* サイドパネル */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '320px',
              height: '100vh',
              backgroundColor: 'white',
              boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
              zIndex: 9999,
              overflowY: 'auto',
              padding: '24px',
            }}
          >
            <button
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
              }}
              onClick={() => setSelectedNode(null)}
            >
              ×
            </button>

            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#1f2937',
            }}>
              {selectedNode.name}
            </h2>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  router.push(`/shops/${selectedNode.attributes.id}`)
                }
              >
                店舗詳細
              </button>
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  router.push(`/map?centerId=${selectedNode.attributes.id}`)
                }
              >
                マップ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}