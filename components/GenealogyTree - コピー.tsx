// components/GenealogyTree.tsx
'use client';

import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const Tree = dynamic(() => import('react-d3-tree'), { ssr: false });

type NodeDatum = {
  name: string;
  attributes?: { id: string };
  children?: NodeDatum[];
};

export default function GenealogyTree({ data }: { data: NodeDatum[] }) {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState<NodeDatum | null>(null);
  const nodeSize = { x: 100, y: 200 };

  const onNodeClick = useCallback((node: NodeDatum, evt: any) => {
    evt.stopPropagation();
    setSelectedNode(node);
  }, []);

  const renderNode = ({ nodeDatum }: any) => (
    <g onClick={(evt) => onNodeClick(nodeDatum, evt)} style={{ cursor: 'pointer', pointerEvents: 'all' }}>
      <rect
        x={-nodeSize.x / 2}
        y={-nodeSize.y / 2}
        width={nodeSize.x}
        height={nodeSize.y}
        fill="#f3f4f6"
        stroke="#4b5563"
        rx={10}
        ry={10}
      />
      <text
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ writingMode: 'vertical-rl', fontSize: '14px', pointerEvents: 'none' }}
      >
        {nodeDatum.name}
      </text>
    </g>
  );

  const renderLink = ({ source, target }: any) => {
    const startX = source.x;
    const startY = source.y + nodeSize.y / 2;
    const endX = target.x;
    const endY = target.y - nodeSize.y / 2;
    return (
      <path d={`M${startX},${startY} L${endX},${endY}`} stroke="#4b5563" strokeWidth={2} fill="none" />
    );
  };

  const handleBackgroundClick = (evt: React.MouseEvent) => {
    if (evt.target === evt.currentTarget) {
      setSelectedNode(null);
    }
  };

  return (
    <div className="relative w-full h-screen" onClick={handleBackgroundClick}>
      {data.map((root, idx) => (
        <Tree
          key={root.attributes?.id ?? idx}
          data={root}
          orientation="vertical"
          translate={{ x: 200 + idx * (nodeSize.x + 100), y: 100 }}
          nodeSize={{ x: 120, y: 250 }}
          separation={{ siblings: 1.5, nonSiblings: 2 }}
          renderCustomNodeElement={renderNode}
          renderCustomLinkElement={renderLink}
          collapsible={false}
        />
      ))}

      {selectedNode && (
        <>
          {/* オーバーレイ */}
          <div
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9998 }}
            onClick={() => setSelectedNode(null)}
          />
          {/* サイドパネル */}
          <div
            style={{ position: 'fixed', right: 0, top: 0, height: '100vh', width: '256px', backgroundColor: 'white', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', zIndex: 9999, overflowY: 'auto' }}
          >
            <button
              style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', fontSize: '24px', color: '#6b7280', cursor: 'pointer', padding: '4px', lineHeight: '1' }}
              onClick={() => setSelectedNode(null)}
            >
              ×
            </button>
            <div style={{ padding: '16px', marginTop: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1f2937' }}>
                {selectedNode.name}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedNode.attributes?.id && (
                  <button
                    onClick={() => router.push(`/shops/${selectedNode.attributes.id}`)}
                    style={{ width: '100%', padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', transition: 'background-color 0.2s' }}
                  >
                    店舗詳細
                  </button>
                )}
                <button
                  onClick={() => router.push(`/map?centerId=${selectedNode.attributes?.id}`)}
                  style={{ width: '100%', padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', transition: 'background-color 0.2s' }}
                >
                  マップ
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}