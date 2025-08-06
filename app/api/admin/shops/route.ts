// ====================
// GET /api/admin/shops
// POST /api/admin/shops
// ====================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  const shops = await prisma.shop.findMany({
    where: {
      name: { contains: search },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      brand: true, // ← 追加
    },    
  });

  return NextResponse.json(shops);
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  const {
    id,
    name,
    address,
    paymentMethods,
    twitter,
    parentId,
    lat,
    lng,
    brandName, // 追加（任意）
  } = data;

  // brandIdを解決（brandNameがある場合のみ）
  let brandId: string | undefined = undefined;

  if (brandName && typeof brandName === 'string') {
    const existingBrand = await prisma.brand.findFirst({
      where: { name: brandName.trim() },
    });

    if (existingBrand) {
      brandId = existingBrand.id;
    } else {
      const newBrand = await prisma.brand.create({
        data: { name: brandName.trim() },
      });
      brandId = newBrand.id;
    }
  }

  const newShop = await prisma.shop.create({
    data: {
      id,
      name,
      address,
      paymentMethods,
      twitter,
      parentId,
      lat,
      lng,
      brandId: brandId ?? null,
    },
  });

  return NextResponse.json(newShop, { status: 201 });
}
