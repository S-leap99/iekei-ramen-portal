// ===============================
// 2) app/api/shops/[id]/route.ts
// GET /api/shops/:id
// ===============================
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const shop = await prisma.shop.findUnique({ where: { id: params.id } });
    if (!shop) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }
    return NextResponse.json(shop);
  } catch (error) {
    console.error(`GET /api/shops/${params.id} error:`, error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}