// app/api/admin/shops/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, context: any) {
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
  } catch (error) {
    console.error('GET /api/admin/shops/[id] error:', error);
    return NextResponse.json(
      { error: 'サーバーエラー' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    const data = await request.json();
    // 必要に応じてバリデーションを追加
    const { name, address, paymentMethods, twitter, parentId, lat, lng } = data;
    const updatedShop = await prisma.shop.update({
      where: { id },
      data: { name, address, paymentMethods, twitter, parentId, lat, lng },
    });
    return NextResponse.json(updatedShop);
  } catch (error) {
    console.error('PUT /api/admin/shops/[id] error:', error);
    return NextResponse.json(
      { error: '更新に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    await prisma.shop.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/shops/[id] error:', error);
    return NextResponse.json(
      { error: '削除に失敗しました' },
      { status: 500 }
    );
  }
}
