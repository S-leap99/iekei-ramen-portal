// app/api/stamps/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }
  const stamps = await prisma.userStampedShop.findMany({
    where: { userId },
    select: {
      shopId: true,
      status: true,
      shop: { select: { name: true } }
    }
  });
  const result = stamps.map(s => ({ shopId: s.shopId, shopName: s.shop.name, status: s.status }));
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const { userId, shopId, status } = await request.json();
  if (!userId || !shopId || !['tabetai','tabetta'].includes(status)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const upserted = await prisma.userStampedShop.upsert({
    where: { userId_shopId: { userId, shopId } },
    update: { status },
    create: { userId, shopId, status }
  });
  return NextResponse.json(upserted);
}