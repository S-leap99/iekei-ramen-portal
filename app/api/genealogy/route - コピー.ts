// =========================================
// 3) app/api/genealogy/route.ts
// GET /api/genealogy (サンプル系譜)
// =========================================
import { NextResponse } from 'next/server';

const sampleData = [
  { name: '吉村家', attributes: { id: 'yoshimuraya' }, children: [
      { name: '杉田家', attributes: { id: 'sugitaya' } },
      { name: '末廣家', attributes: { id: 'suehiro' } },
    ]
  },
];

export async function GET() {
  return NextResponse.json(sampleData);
}