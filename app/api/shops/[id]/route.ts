// app/api/shops/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // params は非同期なので await して取得
    const { id } = await context.params;
    const shop = await prisma.shop.findUnique({ where: { id } });
    if (!shop) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }
    return NextResponse.json(shop);
  } catch (error) {
    console.error(`GET /api/shops/[id] error:`, error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}
