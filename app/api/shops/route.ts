// ==============================
// 4) app/api/shops/route.ts
// GET /api/shops?brandId=xxx（← brandId対応）
// ==============================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');

    const shops = await prisma.shop.findMany({
      where: brandId ? { brandId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(shops);
  } catch (error) {
    console.error('GET /api/shops error:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}
