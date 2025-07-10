// app/api/shops/genealogy/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DB から取得するフィールド型
type ShopRecord = {
  id: string;
  name: string;
  parentId: string | null;
};

// フラットなレコード配列をツリー構造に変換
function buildTree(items: ShopRecord[]) {
  const map = new Map<string, { name: string; attributes: { id: string }; children: any[] }>();
  const roots: any[] = [];

  // ノード初期化
  items.forEach(({ id, name }) => {
    map.set(id, { name, attributes: { id }, children: [] });
  });

  // 親子関係を構築
  items.forEach(({ id, parentId }) => {
    const node = map.get(id)!;
    if (parentId && map.has(parentId)) {
      map.get(parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export async function GET() {
  try {
    // すべての店舗 ID・名前・親ID を取得
    const shops = await prisma.shop.findMany({
      select: { id: true, name: true, parentId: true },
    });
    const tree = buildTree(shops as ShopRecord[]);
    return NextResponse.json(tree);
  } catch (error) {
    console.error('GET /api/shops/genealogy error:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}
