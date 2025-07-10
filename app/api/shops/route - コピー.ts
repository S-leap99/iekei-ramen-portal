// ==============================
// 1) app/api/shops/route.ts
// GET /api/shops
// ==============================
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const shops = await prisma.shop.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(shops);
  } catch (error) {
    console.error('GET /api/shops error:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}