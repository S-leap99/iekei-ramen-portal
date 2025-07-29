// app/middleware.ts （復活して以下のように書く）
export const config = {
  matcher: [], // middleware無効
};
export default function middleware() {
  return; // 何も処理しない
}
