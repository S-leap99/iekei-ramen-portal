// ====================
// GET, PUT, DELETE /api/admin/shops/:id
// ====================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: any  // ← any にしてエラーを回避
) {
  const { id } = context.params;

  try {
    const shop = await prisma.shop.findUnique({ where: { id } });
    if (!shop) {
      return NextResponse.json(
        { error: '店舗が見つかりません' },
        { status: 404 }
      );
    }
    return NextResponse.json(shop);
  } catch {
    return NextResponse.json(
      { error: 'サーバーエラー' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json();
  const updated = await prisma.shop.update({ where: { id: params.id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await prisma.shop.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
