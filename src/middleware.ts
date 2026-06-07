import NextAuth from "next-auth";
import authConfig from "@/auth.config";

/**
 * Auth.js v5 middleware for route protection.
 * Uses the edge-safe auth.config.ts (no Node.js modules).
 * Route protection logic is in auth.config.ts `authorized` callback.
 */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
