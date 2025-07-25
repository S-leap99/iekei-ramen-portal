// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'

// Session.user に id を追加
declare module 'next-auth' {
  interface Session {
    user: {
      /** 前回 jwt コールバックでセットした user.id */
      id: string
    } & DefaultSession['user']
  }

  // JWT トークン側にも id を追加
  interface JWT {
    id: string
  }
}
