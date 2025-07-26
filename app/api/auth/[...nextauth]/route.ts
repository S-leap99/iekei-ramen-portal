// app/api/auth/[...nextauth]/route.ts
console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL);

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

// Next.js の Route ファイルでは、GET と POST でハンドラをエクスポート
export { handler as GET, handler as POST };
