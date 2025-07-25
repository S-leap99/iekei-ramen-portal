// app/_not-found/page.tsx
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">404 — ページが見つかりません</h1>
      <p className="mb-6 text-gray-600">お探しのページは存在しないか、移動した可能性があります。</p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        トップページへ戻る
      </Link>
    </main>
  );
}
