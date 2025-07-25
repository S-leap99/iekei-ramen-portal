// ====================
// GET, PUT, DELETE /api/admin/shops/:id
// ====================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const shop = await prisma.shop.findUnique({ where: { id: params.id } });
  if (!shop) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(shop);
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
