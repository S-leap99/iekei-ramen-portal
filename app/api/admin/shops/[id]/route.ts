import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';

// ✅ 修正された型定義（paramsをPromiseとして定義）
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // paramsをawaitして取得
    const { id } = await params;
    
    const shop = await prisma.shop.findUnique({
      where: { id },
      include: { brand: true },
    });
    
    if (!shop) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
    
    return NextResponse.json({ ...shop, brandId: shop.brandId });
  } catch (error) {
    console.error('GET error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // paramsをawaitして取得
    const { id } = await params;
    const data = await req.json();
    
    const updated = await prisma.shop.update({
      where: { id },
      data: {
        id: data.id,
        name: data.name,
        address: data.address,
        paymentMethods: data.paymentMethods,
        twitter: data.twitter,
        parentId: data.parentId,
        lat: data.lat,
        lng: data.lng,
        brandId: data.brandId || null,
      },
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}