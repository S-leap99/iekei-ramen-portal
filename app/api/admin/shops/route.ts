// ====================
// GET /api/admin/shops
// POST /api/admin/shops
// ====================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  // クエリパラメータ取得例
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  // 店舗リスト取得
  const shops = await prisma.shop.findMany({
    where: {
      name: { contains: search },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(shops);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  // TODO: バリデーション
  const { id, name, address, paymentMethods, twitter, parentId, lat, lng } = data;

  const newShop = await prisma.shop.create({
    data: { id, name, address, paymentMethods, twitter, parentId, lat, lng },
  });

  return NextResponse.json(newShop, { status: 201 });
}
