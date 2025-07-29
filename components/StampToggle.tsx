// components/StampToggle.tsx
'use client'

import { useState, useEffect } from 'react'

interface StampToggleProps {
  shopId: string
}

export default function StampToggle({ shopId }: StampToggleProps) {
  const [status, setStatus] = useState<'tabetai' | 'tabetta' | null>(null)

  useEffect(() => {
    if (!session) {
      setStatus(null)
      return
    }
    // 認証済ならユーザーのスタンプ状態を取得
    fetch(`/api/stamps?userId=${session.user.id}`)
      .then(r => r.json())
      .then((stamps: { shopId: string; status: 'tabetai' | 'tabetta' }[]) => {
        const s = stamps.find(s => s.shopId === shopId)
        setStatus(s?.status ?? null)
      })
  }, [session, shopId])

  const toggle = async () => {
    if (!session) {
      // 未認証ならメールサインイン画面へ
      signIn('email', { callbackUrl: window.location.href })
      return
    }
    // 認証済ならスタンプAPIを叩く
    const nextStatus = status === 'tabetai' ? 'tabetta' : 'tabetai'
    await fetch('/api/stamps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id, shopId, status: nextStatus }),
    })
    setStatus(nextStatus)
  }

  return (
    <button onClick={toggle}>
      {status === 'tabetai' ? 'タベタ!' : status === 'tabetta' ? 'タベタイ?' : 'スタンプする'}
    </button>
  )
}
