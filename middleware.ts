import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // 必要に応じて追加のロジックをここに記述
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // トークンが存在すれば認証済み
        return !!token
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

// 変更点: '/shops/:path*' を削除
export const config = { 
  matcher: ['/profile', '/map', '/genealogy'] 
};