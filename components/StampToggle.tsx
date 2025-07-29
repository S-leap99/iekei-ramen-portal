<<<<<<< HEAD
'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
=======
// components/StampToggle.tsx
'use client'

import { useState, useEffect } from 'react'
>>>>>>> e8082cf4c86a91dd5df5581b3f5b4eea6a429bae

interface StampToggleProps {
  shopId: string
}

export default function StampToggle({ shopId }: StampToggleProps) {
  const [status, setStatus] = useState<'tabetai' | 'tabetta' | null>(null)

  useEffect(() => {
<<<<<<< HEAD
    if (!userId) return;
    fetch(`/api/stamps?userId=${userId}`)
      .then(res => res.json())
      .then((stamps: Stamp[]) => {
        const existing = stamps.find(s => s.shopId === shopId);
        setStatus(existing?.status ?? null);
      })
      .catch(console.error);
  }, [userId, shopId]);

  const handleToggle = async (newStatus: Stamp['status']) => {
    // 変更点: 未認証の場合はサインインページへリダイレクト
    if (!session) {
      signIn();
      return;
    }

    if (!userId) return;
    
    setLoading(true);
    try {
      await fetch('/api/stamps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, shopId, status: newStatus }),
      });
      setStatus(newStatus);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
=======
    if (!session) {
      setStatus(null)
      return
>>>>>>> e8082cf4c86a91dd5df5581b3f5b4eea6a429bae
    }
    // 認証済ならユーザーのスタンプ状態を取得
    fetch(`/api/stamps?userId=${session.user.id}`)
      .then(r => r.json())
      .then((stamps: { shopId: string; status: 'tabetai' | 'tabetta' }[]) => {
        const s = stamps.find(s => s.shopId === shopId)
        setStatus(s?.status ?? null)
      })
  }, [session, shopId])

<<<<<<< HEAD
  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => handleToggle('tabetta')}
        disabled={loading}
        className={`px-3 py-1 rounded ${
          status === 'tabetta' 
            ? 'bg-blue-500 text-white' 
            : 'border border-gray-300 hover:bg-gray-50'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {!session ? 'ログインして「行った」' : '行った'}
      </button>
      <button
        onClick={() => handleToggle('tabetai')}
        disabled={loading}
        className={`px-3 py-1 rounded ${
          status === 'tabetai' 
            ? 'bg-green-500 text-white' 
            : 'border border-gray-300 hover:bg-gray-50'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {!session ? 'ログインして「行きたい」' : '行きたい'}
      </button>
    </div>
  );
}
=======
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
>>>>>>> e8082cf4c86a91dd5df5581b3f5b4eea6a429bae
