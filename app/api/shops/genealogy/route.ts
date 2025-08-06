// ==============================
// app/api/shops/genealogy/route.ts
// ノードデータ（ブランド単位＋ブランドなし店舗単位）生成
// ==============================

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const shops = await prisma.shop.findMany({
      include: {
        brand: true,
      },
    });

    // ブランドIDありの店舗を brandId ごとにグループ化
    const brandMap = new Map<
      string, // brandId
      {
        brandId: string;
        brandName: string;
        representativeShopId: string;
        parentBrandId: string | null;
      }
    >();

    // ブランドIDなしの店舗（単独ノード扱い）
    const standaloneNodes: {
      id: string;
      name: string;
      parentId: string | null;
    }[] = [];

    for (const shop of shops) {
      if (shop.brandId && shop.brand) {
        if (!brandMap.has(shop.brandId)) {
          brandMap.set(shop.brandId, {
            brandId: shop.brandId,
            brandName: shop.brand.name,
            representativeShopId: shop.id,
            parentBrandId: shop.parentId,
          });
        }
      } else {
        standaloneNodes.push({
          id: shop.id,
          name: shop.name,
          parentId: shop.parentId,
        });
      }
    }

    // ブランド単位ノードを生成
    const brandNodes = Array.from(brandMap.values()).map(brand => ({
      id: brand.brandId,
      name: brand.brandName,
      parentId: brand.parentBrandId,
    }));

    // 両者を統合してツリー構造に変換
    const allNodes = [...brandNodes, ...standaloneNodes];

    const map = new Map<string, any>();
    const roots: any[] = [];

    for (const node of allNodes) {
      map.set(node.id, {
        name: node.name,
        attributes: { id: node.id },
        children: [],
      });
    }

    for (const node of allNodes) {
      const current = map.get(node.id);
      if (node.parentId && map.has(node.parentId)) {
        map.get(node.parentId).children.push(current);
      } else {
        roots.push(current);
      }
    }

    return NextResponse.json(roots);
  } catch (error) {
    console.error('GET /api/shops/genealogy error:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}
