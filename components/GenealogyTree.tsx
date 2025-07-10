// components/GenealogyTree.tsx
'use client';

import React, { useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const Tree = dynamic(() => import('react-d3-tree'), { ssr: false });

type NodeDatum = { name: string; attributes?: { id: string }; children?: NodeDatum[] };

interface TreeProps {
  data: NodeDatum[];
  stampMap: Record<string, 'tabetai' | 'tabetta'>;
}

export default function GenealogyTree({ data, stampMap }: TreeProps) {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState<NodeDatum | null>(null);
  const nodeSize = { x: 100, y: 200 };

  const onNodeClick = useCallback((nodeDatum: NodeDatum, evt: any) => {
    evt.stopPropagation();
    setSelectedNode(nodeDatum);
  }, []);

  const renderNode = ({ nodeDatum }: any) => {
    const id = nodeDatum.attributes?.id;
    const status = id ? stampMap[id] : undefined;
    const fillColor = status === 'tabetai' ? 'red' : status === 'tabetta' ? 'gray' : '#f3f4f6';
    return (
      <g
        onClick={(evt) => onNodeClick(nodeDatum, evt)}
        style={{ cursor: 'pointer', pointerEvents: 'all' }}
      >
        <rect
          x={-nodeSize.x / 2}
          y={-nodeSize.y / 2}
          width={nodeSize.x}
          height={nodeSize.y}
          fill={fillColor}
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
  };

  const renderLink = ({ source, target }: any) => {
    const startX = source.x;
    const startY = source.y + nodeSize.y / 2;
    const endX = target.x;
    const endY = target.y - nodeSize.y / 2;
    return (
      <path
        d={`M${startX},${startY} L${endX},${endY}`}
        stroke="#4b5563"
        strokeWidth={2}
        fill="none"
      />
    );
  };

  const handleBackgroundClick = (evt: React.MouseEvent) => {
    if (evt.target === evt.currentTarget) setSelectedNode(null);
  };

  return (
    <div className="w-full h-screen relative" onClick={handleBackgroundClick}>
      {/* ツリー描画 */}
      <Tree
        data={data}
        orientation="vertical"
        translate={{ x: 300, y: 100 }}
        nodeSize={{ x: 120, y: 250 }}
        separation={{ siblings: 1.5, nonSiblings: 2 }}
        renderCustomNodeElement={renderNode}
        renderCustomLinkElement={renderLink}
        collapsible={false}
      />

      {/* サイドパネル */}
      {selectedNode && (
        <>  
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
          <div
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              height: '100vh',
              width: '256px',
              backgroundColor: 'white',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              zIndex: 9999,
              overflowY: 'auto',
            }}
          >
            <button
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                color: '#6b7280',
                cursor: 'pointer',
                padding: '4px',
                lineHeight: '1',
              }}
              onClick={() => setSelectedNode(null)}
            >
              ×
            </button>
            <div style={{ padding: '16px', marginTop: '32px' }}>
              <h2
                style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1f2937' }}
              >
                {selectedNode.name}
              </h2>
              <div className="flex flex-col gap-2">
                <button
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background-color 0.2s',
                  }}
                  onClick={() =>
                    selectedNode.attributes?.id && router.push(`/shops/${selectedNode.attributes.id}`)
                  }
                >
                  店舗詳細
                </button>
                <button
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background-color 0.2s',
                  }}
                  onClick={() => router.push(`/map?centerId=${selectedNode.attributes?.id}`)}
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
