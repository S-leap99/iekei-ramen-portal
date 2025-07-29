import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  // セッションのユーザーIDと一致するかチェック
  if (session.user.id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const stamps = await prisma.userStampedShop.findMany({
    where: { userId },
    select: {
      shopId: true,
      status: true,
      shop: { select: { name: true } }
    }
  });

  const result = stamps.map((s: {
    shopId: string;
    status: string;
    shop: { name: string };
  }) => ({
    shopId: s.shopId,
    shopName: s.shop.name,
    status: s.status
  }));
  
  
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId, shopId, status } = await request.json();
  
  if (!userId || !shopId || !['tabetai','tabetta'].includes(status)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // セッションのユーザーIDと一致するかチェック
  if (session.user.id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const upserted = await prisma.userStampedShop.upsert({
    where: { userId_shopId: { userId, shopId } },
    update: { status },
    create: { userId, shopId, status }
  });

  return NextResponse.json(upserted);
}