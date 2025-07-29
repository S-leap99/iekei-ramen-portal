// middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth({
  // stamp API だけ保護
  matcher: ["/api/stamps/:path*"],
})

export const config = {
  matcher: ["/api/stamps/:path*"],
}
